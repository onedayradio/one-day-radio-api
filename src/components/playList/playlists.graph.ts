import { getUserFromToken } from 'src/shared'
import {
  AppContext,
  PlaylistArgs,
  Playlist,
  AddSongToPlaylistMutationArgs,
  PlayOnDeviceArgs,
  LoadPlaylistSongsArgs,
  PlaylistSong,
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
    id: String!
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
    id: String!
    name: String
    description: String
    spotifyId: String
    genreId: Int
  }
`

export const playlistQueryTypes = `
  loadPlaylist(genreId: Int): Playlist
  loadPlaylistSongs(genreId: String, searchText: String, perPage: Int, currentPage: Int): PlaylistSong[]
`

export const playlistQueriesResolvers = {
  loadPlaylist: async (
    root: unknown,
    { genreId }: PlaylistArgs,
    { playlistService, session, token }: AppContext,
  ): Promise<Playlist> => {
    await getUserFromToken(session, token)
    return playlistService.getByGenreIdOrCreate(genreId)
  },
  loadPlaylistSongs: async (
    root: unknown,
    { genreId }: LoadPlaylistSongsArgs,
    { playlistService, session, token }: AppContext,
  ): Promise<PlaylistSong[]> => {
    await getUserFromToken(session, token)
    return playlistService.loadAllPlaylistActiveSongsByGenre(genreId)
  },
}

export const playlistMutationTypes = `
  addSongToPlaylist(genreId: Int, song: SongInput): PlaylistSong
  playOnDevice(genreId: Int, deviceId: String): Boolean
`

export const playlistMutationsResolvers = {
  addSongToPlaylist: async (
    root: unknown,
    { genreId, song }: AddSongToPlaylistMutationArgs,
    { playlistService, session, token }: AppContext,
  ): Promise<PlaylistSong> => {
    const currentUser = await getUserFromToken(session, token)
    return playlistService.addSongToPlaylist(currentUser.id, genreId, song)
  },
  playOnDevice: async (
    root: unknown,
    { genreId, deviceId }: PlayOnDeviceArgs,
    { playlistService, session, token }: AppContext,
  ): Promise<boolean> => {
    const currentUser = await getUserFromToken(session, token)
    return playlistService.playOnDevice(currentUser, genreId, deviceId)
  },
}
