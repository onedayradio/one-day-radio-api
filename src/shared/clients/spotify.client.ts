import diacritics from 'diacritic'

import {
  TokenRequestOptionsParams,
  TokenRequestOptions,
  TokenRequestOptionsForm,
  GetTokensResponse,
  SpotifyUserData,
  SpotifySearchSongsResponse,
  SpotifyPlayList,
  SpotifyDevices,
  SpotifyPlayListItems,
} from '../../types'
import { getValue, doRequest } from '../util'

const BASE_AUTH_API_URL = 'https://accounts.spotify.com/api'
const BASE_API_URL = 'https://api.spotify.com/v1'
const UNAUTHORIZED_STATUS = 401

interface RequestOptions {
  url: string
  json?: boolean
  headers: {
    Authorization: string
  }
  mode?: string
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
      id: userData.id,
      displayName: userData.display_name,
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

  static async createPlayList(
    accessToken: string,
    userId: string,
    playList: SpotifyPlayList,
  ): Promise<SpotifyPlayList> {
    const options = {
      url: `${BASE_API_URL}/users/${userId}/playlists`,
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { ...playList, public: false, collaborative: false },
      json: true,
    }
    return this.doSpotifyRequest(options, 'post')
  }

  static async getPlayList(accessToken: string, playListId: string): Promise<SpotifyPlayList> {
    const options = {
      url: `${BASE_API_URL}/playlists/${playListId}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      json: true,
    }
    return this.doSpotifyRequest(options)
  }

  static async getPlayListItems(
    accessToken: string,
    playListId: string,
    currentPage: number,
    perPage: number,
  ): Promise<SpotifyPlayListItems> {
    const options = {
      url: `${BASE_API_URL}/playlists/${playListId}/tracks?limit=${perPage}&offset=${currentPage}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      json: true,
    }
    return this.doSpotifyRequest(options)
  }

  static async getPlayerDevices(accessToken: string): Promise<SpotifyDevices> {
    const options = {
      url: `${BASE_API_URL}/me/player/devices`,
      headers: { Authorization: 'Bearer ' + accessToken },
      json: true,
    }
    const playerDevices = await SpotifyClient.doSpotifyRequest(options)
    return playerDevices
  }

  static async playOnDevice(
    accessToken: string,
    deviceId: string,
    contextUri: string,
  ): Promise<void> {
    const options = {
      url: `${BASE_API_URL}/me/player/play?device_id=${deviceId}`,
      headers: { Authorization: 'Bearer ' + accessToken },
      body: {
        context_uri: contextUri,
      },
      json: true,
    }
    await SpotifyClient.doSpotifyRequest(options, 'put')
  }

  static async followPlayList(accessToken: string, playListId: string): Promise<void> {
    const options = {
      url: `${BASE_API_URL}/playlists/${playListId}/followers`,
      headers: { Authorization: 'Bearer ' + accessToken },
      body: {
        public: false,
      },
      json: true,
    }
    await SpotifyClient.doSpotifyRequest(options, 'put')
  }

  static async addSongToPlaylist(
    accessToken: string,
    playlistId: string,
    songUri: string,
  ): Promise<boolean> {
    const options = {
      url: `${BASE_API_URL}/playlists/${playlistId}/tracks`,
      headers: { Authorization: 'Bearer ' + accessToken },
      body: {
        uris: [songUri],
      },
      json: true,
    }
    await SpotifyClient.doSpotifyRequest(options, 'post')
    return true
  }

  static async removeSongFromPlaylist(
    accessToken: string,
    playlistId: string,
    songUri: string,
  ): Promise<boolean> {
    const options = {
      url: `${BASE_API_URL}/playlists/${playlistId}/tracks`,
      headers: { Authorization: 'Bearer ' + accessToken },
      body: {
        uris: [songUri],
      },
      json: true,
    }
    await SpotifyClient.doSpotifyRequest(options, 'delete')
    return true
  }

  static async uploadyPlaylistCoverImage(
    accessToken: string,
    spotifyPlaylistId: string,
    imageBase64: string | Buffer,
  ): Promise<boolean> {
    const options = {
      url: `${BASE_API_URL}/playlists/${spotifyPlaylistId}/images`,
      headers: { Authorization: 'Bearer ' + accessToken, ['Content-Type']: 'image/jpeg' },
      body: imageBase64,
    }
    await SpotifyClient.doSpotifyRequest(options, 'put')
    return true
  }

  static async refreshAccessToken(refreshToken: string): Promise<string> {
    const requestOptions = SpotifyClient.getTokenRequestOptions({
      grantType: 'refresh_token',
      refreshToken,
    })
    const response = await this.doSpotifyRequest(requestOptions, 'post')
    return response.access_token
  }

  static async doSpotifyRequest(options: RequestOptions, method = 'get'): Promise<any> {
    const response = await doRequest(options, method)

    if (response && response.error && response.error.status === UNAUTHORIZED_STATUS) {
      throw new SpotifyUnauthorizedError(response.error.message)
    } else if (response && response.error) {
      throw new Error(response.error.message)
    }
    return response
  }
}
