import { PlayListModel } from './playList'
import { PlaylistSongsModel } from './playlist-songs'
import {
  DBPlayList,
  PlayListData,
  PlayListFilter,
  DBPlaylistSongs,
  Song,
  DBUser,
} from '../../types'

export class PlayListDao {
  create(playListData: PlayListData): Promise<DBPlayList> {
    const playList = new PlayListModel(playListData)
    return playList.save()
  }

  async loadBySpotifyId(spotifyId: string): Promise<DBPlayList | null> {
    return PlayListModel.findOne({ spotifyId })
  }

  async load(playListFilter: PlayListFilter): Promise<DBPlayList | null> {
    return PlayListModel.findOne(playListFilter)
  }

  async getPlaylistSongsByUser(playlistId: string, user: DBUser): Promise<DBPlaylistSongs[]> {
    return PlaylistSongsModel.find({
      playlist: playlistId,
      user,
    })
  }

  async playlistContains(playlistId: string, spotifySongIds: string[]): Promise<DBPlaylistSongs[]> {
    return PlaylistSongsModel.find({
      playlist: playlistId,
      spotifyId: { $in: spotifySongIds },
    }).populate('user')
  }

  async addSongToPlaylist(user: DBUser, playlistId: string, song: Song): Promise<DBPlaylistSongs> {
    return PlaylistSongsModel.create({
      playlist: playlistId,
      user,
      spotifyId: song.id,
      spotifyUri: song.uri,
      name: song.name,
      artists: song.artists,
    })
  }
}
