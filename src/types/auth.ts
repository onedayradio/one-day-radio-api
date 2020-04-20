import { DBUser, User } from './users'

export interface DecodedToken {
  userId: string
  userRoles?: string[]
}

export interface AuthResponse {
  user: DBUser
  token: string
}

export interface AuthSocialArgs {
  user: User
}
