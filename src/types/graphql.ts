import { UsersService, GenresService, PlaylistsService, DevicesService } from '../components'
import { Session } from 'neo4j-driver'

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
  usersService: UsersService
  genresService: GenresService
  playlistService: PlaylistsService
  devicesService: DevicesService
  session: Session
}
