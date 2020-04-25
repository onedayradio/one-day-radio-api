import { Document } from 'mongoose'

export interface User {
  firstname?: string
  lastname?: string
  email: string
  updatedAt?: string
}

export interface DBUser extends Document, User {}

export interface UserGetOrCreateResponse {
  isNewUser: boolean
  dbUser: DBUser
}
