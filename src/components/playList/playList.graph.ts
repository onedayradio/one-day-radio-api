import { AuthenticationError } from 'apollo-server-lambda'
import {
  AppContext,
  PlayListArgs,
  PlayList,
  AddSongToPlaylistMutationArgs,
  PlaylistSongs,
  PlayOnDeviceArgs,
} from '../../types'

export const playListType = `
  type ItemImage {
    height: Int
    width: Int
    url: String
  }

  type Album {
    id: String!
    name: String
    images: [ItemImage]
  }

  type Song {
    id: String!
    name: String
    artists: String
    album: Album
    uri: String
  }

  input SongInput {
    id: String!
    name: String
    artists: String
    uri: String
  }

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

  type PlaylistSong {
    playlist: String
    user: String
    spotifyId: String
    spotifyUri: String
    name: String
    artists: String
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

export const playlistMutationTypes = `
  addSongToPlaylist(playlistId: String, song: SongInput): PlaylistSong
`

export const playlistMutationsResolvers = {
  addSongToPlaylist: (
    root: unknown,
    { playlistId, song }: AddSongToPlaylistMutationArgs,
    { playListService, currentUser }: AppContext,
  ): Promise<PlaylistSongs> => {
    if (!currentUser) {
      throw new AuthenticationError('Unauthorized!!')
    }
    return playListService.addSongToPlaylist(currentUser, playlistId, song)
  },
}
