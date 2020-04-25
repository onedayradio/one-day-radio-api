import { Context, Callback } from 'aws-lambda'
import querystring from 'querystring'

import {
  generateRandomString,
  getValue,
  generalLogger,
  SpotifyApi,
  initDBConnection,
  generateToken,
} from './shared'
import { SpotifyEvent, SpotifyUserData, GetTokensResponse, User } from './types'
import { UsersService } from './components'

const BASE_SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize'
const REDIRECT_HTTP_CODE = 301
const SPOTIFY_AUTH_STATE_SIZE = 16
const SPOTIFY_AUTH_STATE_KEY = 'spotify_auth_state'

interface SpotifyRedirectParams {
  response_type: string
  client_id: string
  scope: string
  redirect_uri: string
  state: string
}

const getSpotifyAuthParams = (state: string): SpotifyRedirectParams => {
  return {
    ['response_type']: 'code',
    ['client_id']: getValue('spotify_client_id'),
    scope: getValue('spotify_scopes'),
    ['redirect_uri']: getValue('spotify_redirect_url'),
    state,
  }
}

export const authorize = (event: SpotifyEvent, context: Context, callback: Callback): void => {
  generalLogger.info('Handling spotify authorization...')
  const state = generateRandomString(SPOTIFY_AUTH_STATE_SIZE)
  const params = getSpotifyAuthParams(state)
  const redirectUrl = `${BASE_SPOTIFY_AUTH_URL}?${querystring.stringify(params as any)}`
  const response = {
    statusCode: REDIRECT_HTTP_CODE,
    headers: {
      Location: redirectUrl,
      'Set-Cookie': `${SPOTIFY_AUTH_STATE_KEY}=${state}; Max-Age=120000`,
    },
  }
  return callback(null, response)
}

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
  displayName: spotifyUser.username,
  countryCode: spotifyUser.country,
  profileImageUrl: spotifyUser.profileImageUrl,
  spotifyData: {
    accessToken: spotifyTokens.accessToken,
    refreshToken: spotifyTokens.refreshToken,
  },
})

export const authCallback = async (
  event: SpotifyEvent,
  context: Context,
  callback: Callback,
): Promise<void> => {
  generalLogger.info('Handling spotify authorization callback...')
  await initDBConnection()
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
  const spotifyTokens = await SpotifyApi.getTokens(code)
  const spotifyUser = await SpotifyApi.getUserData(spotifyTokens.accessToken)
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
