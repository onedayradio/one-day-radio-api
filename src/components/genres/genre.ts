import mongoose, { Model } from 'mongoose'
import { DBGenre } from '../../types'

const Schema = mongoose.Schema

const GenreSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    order: {
      type: Number,
      required: [true, 'Order is required'],
    },
  },
  {
    timestamps: true,
    collection: 'genres',
  },
)

let genreModel: Model<DBGenre>
try {
  genreModel = mongoose.model<DBGenre>('Genre')
} catch (error) {
  genreModel = mongoose.model<DBGenre>('Genre', GenreSchema)
}

export { genreModel as GenreModel }
