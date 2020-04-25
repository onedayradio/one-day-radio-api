import { doRequest, getValue } from '../util'
import {
  TokenRequestOptionsParams,
  TokenRequestOptions,
  TokenRequestOptionsForm,
  GetTokensResponse,
  SpotifyUserData,
} from 'src/types'

export class SpotifyApi {
  static BASE_AUTH_API_URL = 'https://accounts.spotify.com/api'
  static BASE_API_URL = 'https://api.spotify.com/v1'

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
      url: `${this.BASE_AUTH_API_URL}/token`,
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
    const response = await doRequest(requestOptions, 'post')
    return {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      expiresIn: response.expires_in,
    }
  }

  static async getUserData(accessToken: string): Promise<SpotifyUserData> {
    const options = {
      url: `${this.BASE_API_URL}/me`,
      headers: { Authorization: 'Bearer ' + accessToken },
      json: true,
    }
    const userData = await doRequest(options)
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
}
