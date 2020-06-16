import { AuthenticationError } from 'apollo-server-lambda'
import { AppContext, PlayListArgs, PlayList, PlayOnDeviceArgs } from '../../types'

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
  playOnDevice(playListId: String, deviceId: String): Boolean
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

  playOnDevice: (
    root: unknown,
    { playListId, deviceId }: PlayOnDeviceArgs,
    { playListService, currentUser }: AppContext,
  ): Promise<boolean> => {
    if (!currentUser) {
      throw new AuthenticationError('Unauthorized!!')
    }
    return playListService.playOnDevice(currentUser, playListId, deviceId)
  },
}
