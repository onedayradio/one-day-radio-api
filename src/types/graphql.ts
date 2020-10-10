import { DBUser } from './users'
import { DecodedToken } from './auth'
import { UsersService, GenresService, PlaylistsService, DevicesService } from '../components'

export interface ServerContextEvent {
  body: string
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
  genresService: GenresService
  playlistService: PlaylistsService
  devicesService: DevicesService
}
