import { Document } from 'mongoose'

export interface PlayList {
  spotifyId?: string
  name: string
  description: string
}

export interface DBPlayList extends Document, PlayList {}

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
