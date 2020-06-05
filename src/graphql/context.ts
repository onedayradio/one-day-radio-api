import {
  UsersService,
  AuthService,
  GenresService,
  SearchService,
  PlayListService,
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
    authService: new AuthService(),
    genresService: new GenresService(),
    searchService: new SearchService(),
    playListService: new PlayListService(),
  }
}
