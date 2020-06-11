import { AuthenticationError } from 'apollo-server-lambda'
import { AppContext, PlayListArgs, PlayList } from '../../types'

export const playListType = `
  type Tracks {
    href: String
    items: [Song]
    limit: Int,
    next: Int,
    offset: Int,
    previous: Int,
    total: Int
  }
  
  type PlayList {
    id: String!
    name: String
    description: String
    tracks: Tracks
  }
`

export const playListQueryTypes = `
  loadPlayList(genreId: String, day: String, month: String, year: String): PlayList
`

export const playListQueriesResolvers = {
  loadPlayList: (
    root: unknown,
    { genreId, day, month, year }: PlayListArgs,
    { playListService, currentUser }: AppContext,
  ): Promise<PlayList> => {
    if (!currentUser) {
      throw new AuthenticationError('Unauthorized!!')
    }
    return playListService.loadPlayList(currentUser, genreId, day, month, year)
  },
}
