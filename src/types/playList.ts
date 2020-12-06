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
  genreId: number
}

export interface PlayOnDeviceArgs {
  genreId: number
  deviceId: string
}

export interface AddSongToPlaylistMutationArgs {
  genreId: number
  song: Song
}

export interface LoadPlaylistSongsArgs {
  genreId: number
}
