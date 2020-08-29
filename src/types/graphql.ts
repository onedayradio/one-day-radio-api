import { DBUser } from './users'
import { DecodedToken } from './auth'
import {
  UsersService,
  GenresService,
  SearchService,
  PlayListService,
  DevicesService,
} from '../components'

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
  searchService: SearchService
  playListService: PlayListService
  devicesService: DevicesService
}
