import mongoose, { Model } from 'mongoose'
import { DBPlayList } from '../../types'

const Schema = mongoose.Schema

const PlayListSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    spotifyId: {
      type: String,
      required: [true, 'Spotify id is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    genreId: {
      type: String,
      required: [true, 'Genre Id is required'],
    },
  },
  {
    timestamps: true,
    collection: 'playLists',
  },
)

let playListModel: Model<DBPlayList>
try {
  playListModel = mongoose.model<DBPlayList>('PlayList')
} catch (error) {
  playListModel = mongoose.model<DBPlayList>('PlayList', PlayListSchema)
}

export { playListModel as PlayListModel }
