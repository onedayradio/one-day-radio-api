import { Document } from 'mongoose'

export interface UserSpotifyData {
  accessToken: string
  refreshToken: string
  spotifyUserId?: string
}

interface BaseUser {
  firstname?: string
  lastname?: string
  displayName?: string
  countryCode?: string
  profileImageUrl?: string
  updatedAt?: string
}

export interface UserUpdateData extends BaseUser {
  email?: string
  spotifyData?: UserSpotifyData
}

export interface User extends BaseUser {
  email: string
  spotifyData: UserSpotifyData
}

export interface DBUser extends Document, User {}

export interface UserGetOrCreateResponse {
  isNewUser: boolean
  dbUser: DBUser
}
