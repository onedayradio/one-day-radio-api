import { AuthenticationError } from 'apollo-server-lambda'
import {
  AppContext,
  PlayListArgs,
  PlayList,
  AddSongToPlaylistMutationArgs,
  PlaylistSongs,
  PlayOnDeviceArgs,
  PlayListItemsArgs,
  PaginatedPlaylistSongs,
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
    sharedBy: String
  }

  input SongInput {
    id: String!
    name: String
    artists: String
    uri: String
  }

  input DateDataInput {
    day: String!
    month: String!
    year: String!
  }

  type PlayListSongs {
    songs: [Song]
    total: Int
    perPage: Int
    lastPage: Int
    currentPage: Int
    from: Int
    to: Int
  }

  type PlayList {
    id: String!
    name: String
    description: String
  }

  type PlaylistSong {
    playlist: String
    user: User
    spotifyId: String
    spotifyUri: String
    name: String
    artists: String
  }
`

export const playListQueryTypes = `
  loadPlayList(genreId: String): PlayList
  loadPlayListSongs(playListId: String, perPage: Int, currentPage: Int): PlayListSongs
`

export const playListQueriesResolvers = {
  loadPlayList: (
    root: unknown,
    { genreId }: PlayListArgs,
    { playListService, currentUser }: AppContext,
  ): Promise<PlayList> => {
    if (!currentUser) {
      throw new AuthenticationError('Unauthorized!!')
    }
    return playListService.loadPlayList(genreId)
  },
  loadPlayListSongs: (
    root: unknown,
    { playListId, currentPage, perPage }: PlayListItemsArgs,
    { playListService, currentUser }: AppContext,
  ): Promise<PaginatedPlaylistSongs> => {
    if (!currentUser) {
      throw new AuthenticationError('Unauthorized!!')
    }
    return playListService.loadPlayListSongs(playListId, currentPage, perPage)
  },
}

export const playlistMutationTypes = `
  addSongToPlaylist(playlistId: String, song: SongInput, date: DateDataInput): PlaylistSong
  playOnDevice(playListId: String, deviceId: String): Boolean
`

export const playlistMutationsResolvers = {
  addSongToPlaylist: (
    root: unknown,
    { playlistId, song, date }: AddSongToPlaylistMutationArgs,
    { playListService, currentUser }: AppContext,
  ): Promise<PlaylistSongs> => {
    if (!currentUser) {
      throw new AuthenticationError('Unauthorized!!')
    }
    return playListService.addSongToPlaylist(currentUser, playlistId, song, date)
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
