import { PlayListModel } from './playList'
import { PlaylistSongsModel } from './playlist-songs'
import { DBPlayList, PlayListData, PlayListFilter, DBPlaylistSongs, Song } from '../../types'

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

  async getPlaylistSongsByUser(playlistId: string, userId: string): Promise<DBPlaylistSongs[]> {
    return PlaylistSongsModel.find({
      playlist: playlistId,
      user: userId,
    })
  }

  async playlistContains(playlistId: string, spotifySongIds: string[]): Promise<DBPlaylistSongs[]> {
    return PlaylistSongsModel.find({ playlist: playlistId, spotifyId: { $in: spotifySongIds } })
  }

  async addSongToPlaylist(
    userId: string,
    playlistId: string,
    song: Song,
  ): Promise<DBPlaylistSongs> {
    return PlaylistSongsModel.create({
      playlist: playlistId,
      user: userId,
      spotifyId: song.id,
      spotifyUri: song.uri,
      name: song.name,
      artists: song.artists,
    })
  }
}
