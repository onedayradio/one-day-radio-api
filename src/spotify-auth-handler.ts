import { Context, Callback } from 'aws-lambda'
import querystring from 'querystring'

import { generateRandomString, getValue, generalLogger } from './shared'
import { SpotifyEvent } from './types'

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
  generalLogger.info('Handling spotify authorization....')
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
