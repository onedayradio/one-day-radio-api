import { Context, Callback } from 'aws-lambda'
import querystring from 'querystring'

import { getValue, generalLogger, generateToken, SpotifyClient, errorsLogger } from './shared'
import { initDBConnection } from './shared/database'
import { SpotifyEvent, SpotifyUserData, GetTokensResponse, User } from './types'
import { UsersService } from './components'

const REDIRECT_HTTP_CODE = 301
const SPOTIFY_AUTH_STATE_SIZE = 16
const SPOTIFY_AUTH_STATE_KEY = 'spotify_auth_state'

const extractStoredStateFromCookies = (event: SpotifyEvent): string => {
  const { headers } = event
  const cookies = headers.Cookie as string
  return cookies.substr(
    cookies.lastIndexOf(`${SPOTIFY_AUTH_STATE_KEY}=`) + SPOTIFY_AUTH_STATE_KEY.length + 1,
    SPOTIFY_AUTH_STATE_SIZE,
  )
}

const getUserData = (spotifyUser: SpotifyUserData, spotifyTokens: GetTokensResponse): User => ({
  email: spotifyUser.email,
  displayName: spotifyUser.displayName,
  countryCode: spotifyUser.country,
  profileImageUrl: spotifyUser.profileImageUrl,
  spotifyData: {
    accessToken: spotifyTokens.accessToken,
    refreshToken: spotifyTokens.refreshToken,
    spotifyUserId: spotifyUser.id,
  },
})

export const authCallback = async (
  event: SpotifyEvent,
  context: Context,
  callback: Callback,
): Promise<void> => {
  generalLogger.info('Handling spotify authorization callback...')
  await initDBConnection().catch((error) =>
    errorsLogger.error('error connecting to atlas db', error),
  )
  const { queryStringParameters } = event
  const { state, code } = queryStringParameters
  const storedState = extractStoredStateFromCookies(event)
  if (state === null || state !== `${storedState}`) {
    return callback(null, {
      statusCode: REDIRECT_HTTP_CODE,
      headers: {
        Location: `${getValue('frontend_url')}?${querystring.stringify({
          authError: 'state_mismatch',
        })}`,
      },
    })
  }
  const usersService = new UsersService()
  const spotifyTokens = await SpotifyClient.getTokens(code)
  const spotifyUser = await SpotifyClient.getUserData(spotifyTokens.accessToken)
  const userResponse = await usersService.getByEmailOrCreate(
    spotifyUser.email,
    getUserData(spotifyUser, spotifyTokens),
  )
  const token = generateToken(userResponse.dbUser._id)
  const redirectUrl = `${getValue('frontend_url')}/auth-callback?${querystring.stringify({
    token,
  })}`
  const response = {
    statusCode: REDIRECT_HTTP_CODE,
    headers: {
      Location: redirectUrl,
    },
  }
  return callback(null, response)
}
