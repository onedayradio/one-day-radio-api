import moment from 'moment'
import {
  DBPlaylistSongs,
  Song,
  PaginatedPlaylistSongs,
  SpotifyPlaylistSongs,
  User,
} from '../../types'
import { ValidationError } from 'apollo-server-lambda'

import { Constants, getValueAsInt } from '../../shared'
import { createPaginationObject } from '../../shared/util/paginator'

export class PlaylistsService {
  async loadPlaylistSongs(
    genreId: number,
    searchText: string,
    currentPage = 0,
    perPage = 10,
  ): Promise<PaginatedPlaylistSongs> {
    const playlist = await this.playlistDao.loadByGenreId(genreId)
    if (!playlist) {
      throw new Error(`Playlist for genre Id ${genreId} does not exists!`)
    }
    const spotifyPlaylistSongs = await this.spotifyService.getPlaylistItems(
      playlist.spotifyId,
      currentPage,
      perPage,
    )
    const songIds = spotifyPlaylistSongs.songs.map((song) => song.id)
    const dbPlaylistSongs = await this.playlistDao.playlistContains(playlist._id, songIds)
    if (searchText) {
      return this.searchSongs(searchText, dbPlaylistSongs, currentPage, perPage)
    }
    return this.loadSongs(spotifyPlaylistSongs, dbPlaylistSongs, currentPage, perPage)
  }

  async loadSongs(
    playlistSongs: SpotifyPlaylistSongs,
    dbPlaylistSongs: DBPlaylistSongs[],
    currentPage: number,
    perPage: number,
  ): Promise<PaginatedPlaylistSongs> {
    const songs = await this.mergePlaylistSongs(dbPlaylistSongs, playlistSongs.songs)
    const pagination = createPaginationObject({
      total: playlistSongs.total,
      perPage,
      currentPage,
    })
    return {
      ...pagination,
      songs,
    }
  }

  async searchSongs(
    searchText: string,
    playlistSongs: DBPlaylistSongs[],
    currentPage: number,
    perPage: number,
  ): Promise<PaginatedPlaylistSongs> {
    const searchedSongs = await this.spotifyService.searchSong(searchText)
    const songs = await this.mergeSearchedSongs(searchText, playlistSongs, searchedSongs.songs)
    const pagination = createPaginationObject({
      total: searchedSongs.total,
      perPage,
      currentPage,
    })
    return {
      ...pagination,
      songs,
    }
  }

  async mergeSearchedSongs(
    searchText: string,
    dbSongs: DBPlaylistSongs[],
    searchedSongs: Song[],
  ): Promise<Song[]> {
    return searchedSongs.map((song) => {
      const playlistSong = dbSongs.find((item) => song.id === item.spotifyId)
      return {
        id: song.id,
        name: song.name,
        artists: song.artists,
        uri: song.uri,
        sharedBy: playlistSong ? playlistSong.user.displayName : '',
        album: song.album,
        inPlaylist: !!playlistSong,
      }
    })
  }

  async mergePlaylistSongs(dbSongs: DBPlaylistSongs[], spotifySongs: Song[]): Promise<Song[]> {
    return spotifySongs.map((song) => {
      const dbSong = dbSongs.find((item) => song.id === item.spotifyId)
      if (!dbSong || !dbSong.user) {
        throw new Error(`Playlist song with id ${song.id} does not exists!`)
      }
      return {
        id: song.id,
        name: dbSong.name,
        artists: dbSong.artists,
        uri: dbSong.spotifyUri,
        sharedBy: dbSong.user.displayName,
        album: song.album,
      }
    })
  }

  async addSongToPlaylist(user: User, genreId: number, song: Song): Promise<Song> {
    const maxSongsAllowedPerUser = getValueAsInt('max_user_songs_per_playlist')
    const playlist = await this.playlistDao.loadByGenreId(genreId)
    if (!playlist) {
      throw new Error(`Playlist for the genre Id, does not exists!`)
    }
    const userSongs = await this.getPlaylistSongsByUser(playlist._id, user)
    if (userSongs.length > maxSongsAllowedPerUser) {
      throw new Error('User has reached max amount of songs for this playlist')
    }
    const [songDuplicateData] = await this.playlistContains(playlist._id, [song.id])
    if (songDuplicateData.duplicate) {
      throw new Error(`Song ${song.name} by ${song.artists} is already in this playlist`)
    }
    const { year, month, day } = date
    if (!moment(`${year}-${month}-${day}`, Constants.DATE.FORMAT, true).isValid()) {
      throw new ValidationError('Invalid date format')
    }
    const playlistGenre = await this.genresService.loadById({ id: playlist.genreId })
    const allPlaylistSongs = await this.loadAllPlaylistSongs(playlist._id)
    if (allPlaylistSongs.length >= playlistGenre.maxSongs) {
      const oldestSong = allPlaylistSongs[0]
      await this.spotifyService.removeSongFromPlaylist(playlist.spotifyId, oldestSong.spotifyUri)
      await this.playlistDao.removeSongFromPlaylist(oldestSong)
    }
    await this.spotifyService.addSongToPlaylist(playlist.spotifyId, song.uri)
    const dbSong = await this.playlistDao.addSongToPlaylist(user, playlist._id, song, date)

    return {
      id: song.id,
      name: dbSong.name,
      artists: dbSong.artists,
      uri: dbSong.spotifyUri,
      sharedBy: dbSong.user.displayName,
      album: song.album,
    }
  }

  loadAllPlaylistSongs(playlistId: string): Promise<DBPlaylistSongs[]> {
    return this.playlistDao.loadAllPlaylistSongs(playlistId)
  }
}
