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

export interface SpotifyUserData {
  country: string
  username: string
  email: string
  profileImageUrl?: string
}

export interface SpotifyPlayList {
  id?: string
  name: string
  description: string
  public?: boolean
  tracks?: {
    href: string
    items: SpotifySong[]
  }
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

export interface SpotifySearchSongsResponse {
  tracks: {
    href: string
    items: SpotifySong[]
  }
  limit: number
  total: number
  next?: string
  previous?: string
}

export interface SpotifySong {
  artists: { id: string; name: string }[]
  duration_ms: number
  explicit: boolean
  id: string
  name: string
  popularity: number
  album: { id: string; name: string; images: SpotifyImage[] }
}

export interface SpotifyImage {
  width: number
  height: number
  url: string
}
