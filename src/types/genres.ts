import { Document } from 'mongoose'

export interface Genre {
  name: string
  order: number
  maxSongs: number
}

export interface DBGenre extends Document, Genre {}
