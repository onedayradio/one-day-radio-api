import {
  UsersService,
  GenresService,
  SearchService,
  PlaylistsService,
  DevicesService,
} from '../components'
import { getTokenData } from '../shared'
import { ServerContextParams, AppContext } from '../types'

export const context = async ({ event }: ServerContextParams): Promise<AppContext> => {
  let user
  const { headers } = event
  const token = headers['authorization'] || headers['Authorization']
  const tokenData = await getTokenData(token || '')
  const usersService = new UsersService()
  if (tokenData) {
    user = await usersService.getDetailById(tokenData.userId)
  }
  return {
    token,
    currentUser: user,
    tokenData,
    usersService,
    genresService: new GenresService(),
    searchService: new SearchService(),
    playlistService: new PlaylistsService(),
    devicesService: new DevicesService(),
  }
}
