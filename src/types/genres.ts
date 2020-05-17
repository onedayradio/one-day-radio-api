import { Document } from 'mongoose'

export interface Genre {
  name: string
  order: number
}

export interface DBGenre extends Document, Genre {}
