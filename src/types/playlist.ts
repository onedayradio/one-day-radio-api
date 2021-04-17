import { Song } from './songs'
import { Pagination } from './pagination'
import { User } from './users'

export interface Playlist {
  id: number
  spotifyId: string
  name: string
  description: string
  genreId: number
}

export interface PlaylistSong {
  song: Song & { id: number }
  sharedBy: User
  sharedOn: Date
  active: boolean
}

export interface SearchSong {
  song: Song
  sharedBy?: User
  sharedOn?: Date
  active: boolean
}

export interface PaginatedPlaylistSongs extends Pagination {
  songs: Song[]
}

export interface PlaylistData {
  spotifyId?: string
  name: string
  description: string
  genreId: number
}

export interface PlaylistArgs {
  playlistId: number
}

export interface PlayOnDeviceArgs {
  playlistId: number
  spotifyDeviceId?: string
  spotifySongUri?: string
}

export interface AddSongToPlaylistMutationArgs {
  playlistId: number
  song: Song
}

export interface LoadPlaylistSongsArgs {
  playlistId: number
}

export interface SearchSongsArgs {
  playlistId: number
  searchText: string
}
