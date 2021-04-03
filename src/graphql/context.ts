import { UsersService, GenresService, PlaylistsService, DevicesService } from '../components'
import { ServerContextParams, AppContext } from '../types'
import { getNeo4JSession } from '../shared'

export const context = async ({ event }: ServerContextParams): Promise<AppContext> => {
  const { headers } = event
  const token = headers['authorization'] || headers['Authorization']
  const session = getNeo4JSession()
  return {
    token,
    session,
    usersService: new UsersService(session),
    genresService: new GenresService(session),
    playlistService: new PlaylistsService(session),
    devicesService: new DevicesService(session),
  }
}
