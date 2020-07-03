import { PlayListModel } from './playList'
import { PlaylistSongsModel } from './playlist-songs'
import { DBPlayList, PlayListData, DBPlaylistSongs, Song, DBUser, DateData } from '../../types'

export class PlayListDao {
  create(playListData: PlayListData): Promise<DBPlayList> {
    const playList = new PlayListModel(playListData)
    return playList.save()
  }

  async loadBySpotifyId(spotifyId: string): Promise<DBPlayList | null> {
    return PlayListModel.findOne({ spotifyId })
  }

  async loadByGenreId(genreId: string): Promise<DBPlayList | null> {
    return PlayListModel.findOne({ genreId })
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

  async loadAllPlaylistSongs(playlistId: string): Promise<DBPlaylistSongs[]> {
    return PlaylistSongsModel.find({
      playlist: playlistId,
      removedFromSpotify: false,
    }).sort({
      createdAt: 1,
    })
  }

  async addSongToPlaylist(
    user: DBUser,
    playlistId: string,
    song: Song,
    dateData: DateData,
  ): Promise<DBPlaylistSongs> {
    return PlaylistSongsModel.create({
      playlist: playlistId,
      user,
      spotifyId: song.id,
      spotifyUri: song.uri,
      name: song.name,
      artists: song.artists,
      year: dateData.year,
      month: dateData.month,
      day: dateData.day,
    })
  }

  async removeSongFromPlaylist(dbPlaylistSong: DBPlaylistSongs): Promise<void> {
    return dbPlaylistSong.updateOne({ removedFromSpotify: true })
  }
}
