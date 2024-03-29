import { Song } from './songs'

export interface TokenRequestOptionsParams {
  grantType: string
  code?: string
  refreshToken?: string
}

export interface TokenRequestOptionsForm {
  grant_type?: string
  redirect_uri?: string
  code?: string
  refresh_token?: string
}

export interface TokenRequestOptions {
  url: string
  form: TokenRequestOptionsForm
  headers: {
    Authorization: string
  }
  json: boolean
}

export interface GetTokensResponse {
  accessToken: string
  refreshToken: string
  expiresIn: string
}

export interface SpotifyEvent {
  queryStringParameters: {
    code: string
    state: string
  }
  headers: {
    Cookie: string
  }
}

export interface SpotifyUserData {
  country: string
  id: string
  email: string
  profileImageUrl?: string
  displayName?: string
}

export interface SpotifyPlaylist {
  id?: string
  name: string
  description: string
  public?: boolean
  uri?: string
}

interface SpotifyPaginationData {
  limit: number
  total: number
  next?: string
  previous?: string
  offset: number
}

export interface SpotifySearchSongsResponse extends SpotifyPaginationData {
  href: string
  items: SpotifySong[]
}

export interface SpotifyPlaylistItems extends SpotifyPaginationData {
  items: { track: SpotifySong }[]
  href: string
}

export interface SpotifySong {
  artists: { id: string; name: string }[]
  duration_ms: number
  explicit: boolean
  id: string
  name: string
  popularity: number
  album: { id: string; name: string; images: SpotifyImage[] }
  uri: string
}

export interface SpotifyImage {
  width: number
  height: number
  url: string
}

export interface SpotifyDevice {
  id: string
  name: string
}

export interface SpotifyDevices {
  devices: SpotifyDevice[]
}

export interface SpotifySongsList extends SpotifyPaginationData {
  songs: Song[]
}
