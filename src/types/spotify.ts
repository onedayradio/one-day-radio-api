export interface TokenRequestOptionsParams {
  grantType: string
  code?: string
  refreshToken?: string
}

export interface TokenRequestOptionsForm {
  grant_type: string
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

export interface SpotifyEvent {
  queryStringParameters: {
    code: string
    state: string
  }
  headers: {
    Cookie: string
  }
}
