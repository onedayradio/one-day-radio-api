import diacritics from 'diacritic'

import {
  TokenRequestOptionsParams,
  TokenRequestOptions,
  TokenRequestOptionsForm,
  GetTokensResponse,
  SpotifyUserData,
  SpotifySearchSongsResponse,
} from '../../types'
import { getValue, doRequest } from '../util'

const BASE_AUTH_API_URL = 'https://accounts.spotify.com/api'
const BASE_API_URL = 'https://api.spotify.com/v1'
const UNAUTHORIZED_STATUS = 401

interface RequestOptions {
  url: string
  json: boolean
  headers: {
    Authorization: string
  }
}

export class SpotifyUnauthorizedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SpotifyUnauthorizedError'
  }
}

export class SpotifyClient {
  static getTokenRequestOptions({
    grantType,
    code,
    refreshToken,
  }: TokenRequestOptionsParams): TokenRequestOptions {
    const spotifyRedirectUrl = getValue('spotify_redirect_url')
    const clientId = getValue('spotify_client_id')
    const clientSecret = getValue('spotify_client_secret')
    const authBuffer = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    let optionsForm: TokenRequestOptionsForm = { ['grant_type']: grantType }
    if (code) {
      optionsForm = {
        ...optionsForm,
        ['redirect_uri']: spotifyRedirectUrl,
        code,
      }
    }
    if (refreshToken) {
      optionsForm = {
        ...optionsForm,
        ['refresh_token']: refreshToken,
      }
    }
    const options = {
      url: `${BASE_AUTH_API_URL}/token`,
      form: optionsForm,
      headers: {
        Authorization: `Basic ${authBuffer}`,
      },
      json: true,
    }
    return options
  }

  static async getTokens(code: string): Promise<GetTokensResponse> {
    const requestOptions = this.getTokenRequestOptions({
      grantType: 'authorization_code',
      code,
    })
    const response = await SpotifyClient.doSpotifyRequest(requestOptions, 'post')
    return {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      expiresIn: response.expires_in,
    }
  }

  static async getUserData(accessToken: string): Promise<SpotifyUserData> {
    const options = {
      url: `${BASE_API_URL}/me`,
      headers: { Authorization: 'Bearer ' + accessToken },
      json: true,
    }
    const userData = await SpotifyClient.doSpotifyRequest(options)
    let profileImageUrl
    if (userData.images && userData.images.length > 0) {
      profileImageUrl = userData.images[0].url
    }
    return {
      country: userData.country,
      username: userData.id,
      email: userData.email,
      profileImageUrl,
    }
  }

  static async searchSong(
    accessToken: string,
    songQuery: string,
  ): Promise<SpotifySearchSongsResponse> {
    const songQueryClean = diacritics.clean(songQuery.replace('&', '').split(' ').join('+'))
    const options = {
      url: `${BASE_API_URL}/search?q=${songQueryClean}&type=track`,
      headers: { Authorization: 'Bearer ' + accessToken },
      json: true,
    }
    const searchResult = (await SpotifyClient.doSpotifyRequest(
      options,
    )) as SpotifySearchSongsResponse
    return searchResult
  }

  static async refreshAccessToken(refreshToken: string): Promise<string> {
    const requestOptions = SpotifyClient.getTokenRequestOptions({
      grantType: 'refresh_token',
      refreshToken,
    })
    const response = await doRequest(requestOptions, 'post')
    return response.access_token
  }

  static async doSpotifyRequest(options: RequestOptions, method = 'get'): Promise<any> {
    const response = await doRequest(options, method)
    if (response.error && response.error.status === UNAUTHORIZED_STATUS) {
      throw new SpotifyUnauthorizedError(response.error.message)
    } else if (response.error) {
      throw new Error(response.error.message)
    }
    return response
  }
}
