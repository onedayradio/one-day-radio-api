import mongoose, { Model } from 'mongoose'
import { DBPlaylistSongs } from '../../types'

const Schema = mongoose.Schema

const PlaylistSongsSchema = new Schema(
  {
    playlist: {
      type: Schema.Types.ObjectId,
      ref: 'PlayList',
      required: [true, 'Playlist id is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User id is required'],
    },
    spotifyId: {
      type: String,
      required: [true, 'Spotify song id is required'],
    },
    spotifyUri: {
      type: String,
      required: [true, 'Spotify song uri is required'],
    },
    name: {
      type: String,
      required: [true, 'Song name is required'],
    },
    artists: {
      type: String,
      required: [true, 'Song artists names are required'],
    },
    year: {
      type: String,
      required: [true, 'Year is required'],
    },
    month: {
      type: String,
      required: [true, 'Month is required'],
    },
    day: {
      type: String,
      required: [true, 'Day is required'],
    },
    removedFromSpotify: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'playlist-songs',
  },
)

let playlistSongsModel: Model<DBPlaylistSongs>
try {
  playlistSongsModel = mongoose.model<DBPlaylistSongs>('PlaylistSongs')
} catch (error) {
  playlistSongsModel = mongoose.model<DBPlaylistSongs>('PlaylistSongs', PlaylistSongsSchema)
}

export { playlistSongsModel as PlaylistSongsModel }
