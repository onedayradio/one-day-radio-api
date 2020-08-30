import moment from 'moment'
import * as base64Image from 'node-base64-image'

import { PlaylistsDao } from './playlists.dao'
import {
  DBUser,
  SpotifyPlaylist,
  PlaylistData,
  DBPlaylistSongs,
  Song,
  SpotifyItem,
  PaginatedPlaylistSongs,
  DateData,
  Playlist,
} from '../../types'
import { ValidationError } from 'apollo-server-lambda'
import { SpotifyService } from '..'

import { GenresService } from '..'
import { Constants, getValueAsInt, errorsLogger } from '../../shared'
import { createPaginationObject } from '../../shared/util/paginator'

export class PlaylistsService {
  playlistDao: PlaylistsDao
  spotifyService: SpotifyService
  genresService: GenresService

  constructor() {
    this.playlistDao = new PlaylistsDao()
    this.spotifyService = new SpotifyService()
    this.genresService = new GenresService()
  }

  async loadPlaylistSongs(
    genreId: string,
    currentPage = 0,
    perPage = 10,
  ): Promise<PaginatedPlaylistSongs> {
    const playlist = await this.playlistDao.loadByGenreId(genreId)
    if (!playlist) {
      throw new Error(`Playlist for genre Id ${genreId} does not exists!`)
    }
    const playlistItems = await this.spotifyService.getPlaylistItems(
      playlist.spotifyId,
      currentPage,
      perPage,
    )
    const songIds = playlistItems.items.map((item) => item.track.id)
    const songs = await this.mergePlaylistSongs(playlist._id, songIds, playlistItems.items)
    const pagination = createPaginationObject({
      total: playlistItems.total,
      perPage,
      currentPage,
    })
    return {
      ...pagination,
      songs,
    }
  }

  async mergePlaylistSongs(
    playlistId: string,
    songIds: string[],
    items: SpotifyItem[],
  ): Promise<Song[]> {
    const songs = await this.playlistDao.playlistContains(playlistId, songIds)
    return items.map((item) => {
      const song = songs.find((song) => song.spotifyId === item.track.id)
      if (!song || !song.user) {
        throw new Error(`Playlist song with id ${item.track.id} does not exists!`)
      }
      return {
        id: item.track.id,
        name: song.name,
        artists: song.artists,
        uri: song.spotifyUri,
        sharedBy: song.user.displayName,
        album: item.track.album,
      }
    })
  }

  async createPlaylist(playList: PlaylistData): Promise<SpotifyPlaylist> {
    const { name, description, genreId } = playList
    const spotifyPlaylist = await this.spotifyService.createPlaylist({ name, description })
    const { id } = spotifyPlaylist
    const dbPlaylist = await this.playlistDao.create({
      spotifyId: id,
      name,
      description,
      genreId,
    })
    await this.uploadPlaylistImage(dbPlaylist.spotifyId, genreId)
    return spotifyPlaylist
  }

  async loadPlaylist(genreId: string): Promise<Playlist> {
    const playList = await this.playlistDao.loadByGenreId(genreId)
    if (playList && playList.spotifyId) {
      return (await this.spotifyService.getPlaylist(playList.spotifyId)) as Playlist
    }
    const playListData = await this.createPlaylistData(genreId)
    return (await this.createPlaylist(playListData)) as Playlist
  }

  async createPlaylistData(genreId: string): Promise<PlaylistData> {
    const genre = await this.genresService.getDetailById(genreId)
    const name = this.createPlaylistName(genre.name)
    return {
      name,
      description: this.createPlaylistDescription(name),
      genreId,
    }
  }

  createPlaylistName(genreName: string): string {
    return `One day Radio. ${genreName} playlist`
  }

  createPlaylistDescription(name: string): string {
    return `This playlist has been created to you, from your community. ${name}`
  }

  async playOnDevice(user: DBUser, playListId: string, deviceId: string): Promise<boolean> {
    return this.spotifyService.playOnDevice(user, playListId, deviceId)
  }

  async getPlaylistSongsByUser(playlistId: string, user: DBUser): Promise<DBPlaylistSongs[]> {
    return this.playlistDao.getPlaylistSongsByUser(playlistId, user)
  }

  async playlistContains(
    playlistId: string,
    spotifySongIds: string[],
  ): Promise<{ spotifyId: string; duplicate: boolean }[]> {
    const songs = await this.playlistDao.playlistContains(playlistId, spotifySongIds)
    const duplicateSpotifyIds = songs.map((song) => song.spotifyId)
    return spotifySongIds.map((spotifyId) => ({
      spotifyId,
      duplicate: duplicateSpotifyIds.includes(spotifyId),
    }))
  }

  async addSongToPlaylist(
    user: DBUser,
    spotifyPlaylistId: string,
    song: Song,
    date: DateData,
  ): Promise<DBPlaylistSongs> {
    const maxSongsAllowedPerUser = getValueAsInt('max_user_songs_per_playlist')
    const playlist = await this.playlistDao.loadBySpotifyId(spotifyPlaylistId)
    if (!playlist) {
      throw new Error(`Playlist with id ${spotifyPlaylistId} does not exists!`)
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
    const playlistGenre = await this.genresService.getDetailById(playlist.genreId)
    const allPlaylistSongs = await this.loadAllPlaylistSongs(playlist._id)
    if (allPlaylistSongs.length >= playlistGenre.maxSongs) {
      const oldestSong = allPlaylistSongs[0]
      await this.spotifyService.removeSongFromPlaylist(playlist.spotifyId, oldestSong.spotifyUri)
      await this.playlistDao.removeSongFromPlaylist(oldestSong)
    }
    await this.spotifyService.addSongToPlaylist(playlist.spotifyId, song.uri)
    return this.playlistDao.addSongToPlaylist(user, playlist._id, song, date)
  }

  loadAllPlaylistSongs(playlistId: string): Promise<DBPlaylistSongs[]> {
    return this.playlistDao.loadAllPlaylistSongs(playlistId)
  }

  async uploadPlaylistImage(spotifyPlaylistId: string, genreId: string): Promise<boolean> {
    try {
      const genre = await this.genresService.getDetailById(genreId)
      const s3GenreImageName = genre.name.toLowerCase().replace(/ /g, '-')
      const s3GenreImageUrl = `${Constants.S3_GENRE_IMAGES_BASE_URL}/${s3GenreImageName}.jpg`
      const imageBase64Encoded = await base64Image.encode(encodeURI(s3GenreImageUrl), {
        string: true,
      })
      await this.spotifyService.uploadPlaylistCoverImage(spotifyPlaylistId, imageBase64Encoded)
      return true
    } catch (error) {
      errorsLogger.error(
        `Unexpected error uploading genre image. SpotifyPlaylistId: ${spotifyPlaylistId}, genreId: ${genreId}`,
        error,
      )
      return false
    }
  }
}
