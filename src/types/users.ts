import { Document } from 'mongoose'

export interface UserSpotifyData {
  accessToken: string
  refreshToken: string
}

export interface User {
  email: string
  firstname?: string
  lastname?: string
  displayName?: string
  countryCode?: string
  profileImageUrl?: string
  spotifyData?: UserSpotifyData
  updatedAt?: string
}

export interface DBUser extends Document, User {}

export interface UserGetOrCreateResponse {
  isNewUser: boolean
  dbUser: DBUser
}
