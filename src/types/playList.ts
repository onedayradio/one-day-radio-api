import { Document } from 'mongoose'
import { Song } from './songs'
import { User } from './users'
import { Pagination } from './pagination'

export interface PlayList {
  spotifyId?: string
  name: string
  description: string
}

export interface DBPlayList extends Document, PlayList {
  spotifyId: string
}

export interface PlaylistSongs {
  playlist: string
  user: User
  spotifyId: string
  spotifyUri: string
  name: string
  artists: string
}

export interface PaginatedPlaylistSongs extends Pagination {
  songs: Song[]
}

export interface DBPlaylistSongs extends Document, PlaylistSongs {}

export interface PlayListData {
  spotifyId?: string
  name: string
  description: string
  genreId: string
  year: string
  month: string
  day: string
}

export interface PlayListDate {
  year: string
  month: string
  day: string
}

export interface PlayListFilter extends PlayListDate {
  genreId: string
}

export interface PlayListArgs {
  genreId: string
  day: string
  month: string
  year: string
}

export interface PlayOnDeviceArgs {
  playListId: string
  deviceId: string
}

export interface AddSongToPlaylistMutationArgs {
  playlistId: string
  song: Song
}

export interface PlayListItemsArgs {
  playListId: string
  perPage: number
  currentPage: number
}
