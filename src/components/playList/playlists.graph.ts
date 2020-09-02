import { AuthenticationError } from 'apollo-server-lambda'
import {
  AppContext,
  PlaylistArgs,
  Playlist,
  AddSongToPlaylistMutationArgs,
  PlaylistSongs,
  PlayOnDeviceArgs,
  PlaylistItemsArgs,
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

  type PlaylistSongs {
    songs: [Song]
    total: Int
    perPage: Int
    lastPage: Int
    currentPage: Int
    from: Int
    to: Int
  }

  type Playlist {
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
  loadPlaylist(genreId: String): Playlist
  loadPlaylistSongs(genreId: String, perPage: Int, currentPage: Int): PlaylistSongs
`

export const playListQueriesResolvers = {
  loadPlaylist: (
    root: unknown,
    { genreId }: PlaylistArgs,
    { playlistService, currentUser }: AppContext,
  ): Promise<Playlist> => {
    if (!currentUser) {
      throw new AuthenticationError('Unauthorized!!')
    }
    return playlistService.loadPlaylist(genreId)
  },
  loadPlaylistSongs: (
    root: unknown,
    { genreId, currentPage, perPage }: PlaylistItemsArgs,
    { playlistService, currentUser }: AppContext,
  ): Promise<PaginatedPlaylistSongs> => {
    if (!currentUser) {
      throw new AuthenticationError('Unauthorized!!')
    }
    return playlistService.loadPlaylistSongs(genreId, currentPage, perPage)
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
    { playlistService, currentUser }: AppContext,
  ): Promise<PlaylistSongs> => {
    if (!currentUser) {
      throw new AuthenticationError('Unauthorized!!')
    }
    return playlistService.addSongToPlaylist(currentUser, playlistId, song, date)
  },
  playOnDevice: (
    root: unknown,
    { playListId, deviceId }: PlayOnDeviceArgs,
    { playlistService, currentUser }: AppContext,
  ): Promise<boolean> => {
    if (!currentUser) {
      throw new AuthenticationError('Unauthorized!!')
    }
    return playlistService.playOnDevice(currentUser, playListId, deviceId)
  },
}