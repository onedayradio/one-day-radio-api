import { User } from './users'

export interface DecodedToken {
  userId: string
  userRoles?: string[]
}

export interface AuthSocialArgs {
  user: User
}
