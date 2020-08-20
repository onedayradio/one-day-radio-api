import { Document } from 'mongoose'
import { Song } from './songs'
import { User } from './users'
import { Pagination } from './pagination'

export interface PlayList {
  spotifyId?: string
  name: string
  description: string
  genreId: string
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
  year: string
  month: string
  day: string
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
}

export interface PlayListArgs {
  genreId: string
}

export interface PlayOnDeviceArgs {
  playListId: string
  deviceId: string
}

export interface AddSongToPlaylistMutationArgs {
  playlistId: string
  song: Song
  date: DateData
}

export interface PlayListItemsArgs {
  playListId: string
  perPage: number
  currentPage: number
}

export interface DateData {
  day: string
  month: string
  year: string
}
