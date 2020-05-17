import { DBUser } from './users'
import { DecodedToken } from './auth'
import { UsersService, AuthService, GenresService } from '../components'

export interface ServerContextEvent {
  headers: {
    authorization?: string
    Authorization?: string
  }
}

export interface ServerContextParams {
  event: ServerContextEvent
}

export interface AppContext {
  token?: string
  currentUser?: DBUser
  tokenData?: DecodedToken
  usersService: UsersService
  authService: AuthService
  genresService: GenresService
}
