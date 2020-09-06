export interface UserSpotifyData {
  accessToken: string
  refreshToken: string
  spotifyUserId?: string
}

export interface User {
  id: number
  firstname?: string
  lastname?: string
  displayName?: string
  countryCode?: string
  profileImageUrl?: string
  updatedAt?: string
  email: string
  spotifyData: UserSpotifyData
}

export interface UserGetOrCreateResponse {
  isNewUser: boolean
  dbUser: User
}
