import { PlaylistModel } from './playlist'
import { PlaylistSongsModel } from './playlistSongs'
import { DBPlaylist, PlaylistData, DBPlaylistSongs, Song, User, DateData } from '../../types'

export class PlaylistsDao {
  create(playlistData: PlaylistData): Promise<DBPlaylist> {
    const playlist = new PlaylistModel(playlistData)
    return playlist.save()
  }

  async loadByGenreId(genreId: number): Promise<DBPlaylist | null> {
    return PlaylistModel.findOne({ genreId })
  }

  async getPlaylistSongsByUser(playlistId: string, user: User): Promise<DBPlaylistSongs[]> {
    return PlaylistSongsModel.find({
      playlist: playlistId,
      user,
    })
  }

  async playlistContains(playlistId: string, spotifySongIds: string[]): Promise<DBPlaylistSongs[]> {
    return PlaylistSongsModel.find({
      playlist: playlistId,
      spotifyId: { $in: spotifySongIds },
      removedFromSpotify: false,
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
    user: User,
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
