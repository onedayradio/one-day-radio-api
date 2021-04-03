import { User } from './users'

export interface DecodedToken {
  userId: number
  userRoles?: string[]
}

export interface AuthSocialArgs {
  user: User
}
