import querystring from 'querystring'

import { getValue, generalLogger, generateToken, SpotifyClient } from './shared'
import { createNeo4JDriver, getNeo4JSession } from './shared/database'
import { SpotifyEvent, SpotifyUserData, GetTokensResponse, User } from './types'
import { UsersService } from './components'

const REDIRECT_HTTP_CODE = 302
const SPOTIFY_AUTH_STATE_SIZE = 16
const SPOTIFY_AUTH_STATE_KEY = 'spotify_auth_state'

const extractStoredStateFromCookies = (event: SpotifyEvent): string => {
  const { headers } = event
  const cookies = headers ? (headers.Cookie as string) : undefined
  return cookies
    ? cookies.substr(
        cookies.lastIndexOf(`${SPOTIFY_AUTH_STATE_KEY}=`) + SPOTIFY_AUTH_STATE_KEY.length + 1,
        SPOTIFY_AUTH_STATE_SIZE,
      )
    : ''
}

const getUserData = (
  spotifyUser: SpotifyUserData,
  spotifyTokens: GetTokensResponse,
): Partial<User> => ({
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

let cachedNeo4JDriver: any = null

export const authCallback = async (event: SpotifyEvent): Promise<any> => {
  generalLogger.info('Handling spotify authorization callback!')
  cachedNeo4JDriver = createNeo4JDriver(cachedNeo4JDriver)
  const session = getNeo4JSession()
  generalLogger.info('Successfully connected to neo4J')
  const { queryStringParameters } = event
  const { state, code } = queryStringParameters
  const storedState = extractStoredStateFromCookies(event)
  if (state === null || state !== `${storedState}`) {
    return {
      statusCode: REDIRECT_HTTP_CODE,
      headers: {
        Location: `${getValue('frontend_url')}?${querystring.stringify({
          authError: 'state_mismatch',
        })}`,
      },
    }
  }
  const usersService = new UsersService(session)
  const spotifyTokens = await SpotifyClient.getTokens(code)
  const spotifyUser = await SpotifyClient.getUserData(spotifyTokens.accessToken)
  const userResponse = await usersService.getByEmailOrCreate(
    spotifyUser.email,
    getUserData(spotifyUser, spotifyTokens),
  )
  const token = generateToken(userResponse.dbUser.id)
  const redirectUrl = `${getValue('frontend_url')}/auth-callback?${querystring.stringify({
    token,
  })}`
  const response = {
    statusCode: REDIRECT_HTTP_CODE,
    headers: {
      Location: redirectUrl,
    },
  }
  generalLogger.info('returning successful response', redirectUrl)
  return response
}
