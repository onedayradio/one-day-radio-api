import mongoose, { Model } from 'mongoose'
import { DBPlaylist } from '../../types'

const Schema = mongoose.Schema

const PlaylistSchema = new Schema(
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
      type: Schema.Types.ObjectId,
      ref: 'Genre',
      required: [true, 'Genre Id is required'],
    },
  },
  {
    timestamps: true,
    collection: 'playlists',
  },
)

let playlistModel: Model<DBPlaylist>
try {
  playlistModel = mongoose.model<DBPlaylist>('Playlist')
} catch (error) {
  playlistModel = mongoose.model<DBPlaylist>('Playlist', PlaylistSchema)
}

export { playlistModel as PlaylistModel }
