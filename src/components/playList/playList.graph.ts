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
  loadPlayList(genreId: String, date: String): PlayList
`

export const playListQueriesResolvers = {
  loadPlayList: (
    root: unknown,
    { genreId, date }: PlayListArgs,
    { playListService, currentUser }: AppContext,
  ): Promise<PlayList> => {
    if (!currentUser) {
      throw new AuthenticationError('Unauthorized!!')
    }
    return playListService.loadPlayList(currentUser, genreId, date)
  },
}
