import { validateUserAuth } from '../../shared'
import {
  AppContext,
  PlaylistArgs,
  Playlist,
  AddSongToPlaylistMutationArgs,
  PlayOnDeviceArgs,
  LoadPlaylistSongsArgs,
  PlaylistSong,
  SearchSong,
  SearchSongsArgs,
} from '../../types'

export const playlistType = `
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
    id: String
    name: String
    spotifyId: String
    spotifyUri: String
    artistSpotifyIds: String
    artistsNames: String
    albumSpotifyId: String
    albumName: String
    albumImage300: String
  }

  input SongInput {
    name: String
    spotifyId: String
    spotifyUri: String
    artistSpotifyIds: String
    artistsNames: String
    albumSpotifyId: String
    albumName: String
    albumImage300: String
  }

  type PlaylistSong {
    song: Song
    sharedOn: String
    sharedBy: User
    active: Boolean
  }

  type Playlist {
    id: Int!
    name: String
    description: String
    spotifyId: String
    genreId: Int
  }
`

export const playlistQueryTypes = `
  loadPlaylist(genreId: Int): Playlist
  loadPlaylistSongs(playlistId: Int): [PlaylistSong]
  searchSongs(playlistId: Int, searchText: String): [PlaylistSong]
`

export const playlistQueriesResolvers = {
  loadPlaylist: async (
    root: unknown,
    { genreId }: PlaylistArgs,
    { playlistService, session, token }: AppContext,
  ): Promise<Playlist> => {
    await validateUserAuth(session, token)
    return playlistService.getByGenreIdOrCreate(genreId)
  },
  loadPlaylistSongs: async (
    root: unknown,
    { playlistId }: LoadPlaylistSongsArgs,
    { playlistService, session, token }: AppContext,
  ): Promise<PlaylistSong[]> => {
    await validateUserAuth(session, token)
    return playlistService.loadAllPlaylistActiveSongs(playlistId)
  },
  searchSongs: async (
    root: unknown,
    { playlistId, searchText }: SearchSongsArgs,
    { playlistService, session, token }: AppContext,
  ): Promise<SearchSong[]> => {
    await validateUserAuth(session, token)
    return playlistService.searchSongs(playlistId, searchText)
  },
}

export const playlistMutationTypes = `
  addSongToPlaylist(playlistId: Int, song: SongInput): PlaylistSong
  playOnDevice(playlistId: Int, deviceId: String): Boolean
`

export const playlistMutationsResolvers = {
  addSongToPlaylist: async (
    root: unknown,
    { playlistId, song }: AddSongToPlaylistMutationArgs,
    { playlistService, session, token }: AppContext,
  ): Promise<PlaylistSong> => {
    const currentUser = await validateUserAuth(session, token)
    return playlistService.addSongToPlaylist(currentUser.id, playlistId, song)
  },
  playOnDevice: async (
    root: unknown,
    { playlistId, deviceId }: PlayOnDeviceArgs,
    { playlistService, session, token }: AppContext,
  ): Promise<boolean> => {
    const currentUser = await validateUserAuth(session, token)
    return playlistService.playOnDevice(currentUser, playlistId, deviceId)
  },
}
