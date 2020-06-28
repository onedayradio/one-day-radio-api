import moment from 'moment'

import { PlayListDao } from './playList.dao'
import {
  PlayList,
  DBUser,
  SpotifyPlayList,
  PlayListDate,
  PlayListData,
  DBPlaylistSongs,
  Song,
} from '../../types'
import { ValidationError } from 'apollo-server-lambda'
import { SpotifyService } from './../spotify/spotify.service'

import { GenresService } from '..'
import { Constants, getValueAsInt } from '../../shared'

export class PlayListService {
  playListDao: PlayListDao

  constructor() {
    this.playListDao = new PlayListDao()
  }

  async createPlayList(user: DBUser, playList: PlayListData): Promise<SpotifyPlayList> {
    const spotifyService = new SpotifyService(user)
    const { name, description, genreId, year, month, day } = playList
    const spotifyPlayList = await spotifyService.createPlayList({ name, description })
    const { id } = spotifyPlayList
    await this.playListDao.create({
      spotifyId: id,
      name,
      description,
      genreId,
      year,
      month,
      day,
    })
    return spotifyPlayList
  }

  async loadPlayList(
    user: DBUser,
    genreId: string,
    day: string,
    month: string,
    year: string,
  ): Promise<PlayList> {
    const playListDate = this.createPlayListDate(day, month, year)
    const playList = await this.playListDao.load({ genreId, ...playListDate })
    if (playList && playList.spotifyId) {
      const spotifyService = new SpotifyService(user)
      return (await spotifyService.getPlayList(playList.spotifyId)) as PlayList
    }
    const playListData = await this.createPlayListData(genreId, playListDate)
    return this.createPlayList(user, playListData) as Promise<PlayList>
  }

  async createPlayListData(genreId: string, playListDate: PlayListDate): Promise<PlayListData> {
    const genreService = new GenresService()
    const genre = await genreService.getDetailById(genreId)
    const name = this.createPlayListName(genre.name, playListDate)
    return {
      name,
      description: this.createPlayListDescription(name),
      genreId,
      ...playListDate,
    }
  }

  createPlayListName(genreName: string, playListDate: PlayListDate): string {
    const { year, month, day } = playListDate
    return `One day Radio. ${genreName} playlist - ${year}-${month}-${day}`
  }

  createPlayListDescription(name: string): string {
    return `This playlist has been created to you, from your community. ${name}`
  }

  createPlayListDate(day: string, month: string, year: string): PlayListDate {
    if (!moment(`${year}-${month}-${day}`, Constants.DATE.FORMAT, true).isValid()) {
      throw new ValidationError('Invalid date format')
    }
    return {
      day,
      month,
      year,
    }
  }

  async playOnDevice(user: DBUser, playListId: string, deviceId: string): Promise<boolean> {
    const spotifyService = new SpotifyService(user)
    return spotifyService.playOnDevice(playListId, deviceId)
  }

  async getPlaylistSongsByUser(playlistId: string, userId: string): Promise<DBPlaylistSongs[]> {
    return this.playListDao.getPlaylistSongsByUser(playlistId, userId)
  }

  async playlistContains(
    playlistId: string,
    spotifySongIds: string[],
  ): Promise<{ spotifyId: string; duplicate: boolean }[]> {
    const songs = await this.playListDao.playlistContains(playlistId, spotifySongIds)
    const duplicateSpotifyIds = songs.map((song) => song.spotifyId)
    return spotifySongIds.map((spotifyId) => ({
      spotifyId,
      duplicate: duplicateSpotifyIds.includes(spotifyId),
    }))
  }

  async addSongToPlaylist(user: DBUser, playlistId: string, song: Song): Promise<DBPlaylistSongs> {
    const maxSongsAllowed = getValueAsInt('max_user_songs_per_playlist')
    const playlist = await this.playListDao.loadBySpotifyId(playlistId)
    if (!playlist) {
      throw new Error(`Playlist with id ${playlistId} does not exists!`)
    }
    const userSongs = await this.getPlaylistSongsByUser(playlist._id, user._id)
    if (userSongs.length > maxSongsAllowed) {
      throw new Error('User has reached max amount of songs for this playlist')
    }
    const [songDuplicateData] = await this.playlistContains(playlist._id, [song.id])
    if (songDuplicateData.duplicate) {
      throw new Error(`Song ${song.name} by ${song.artists} is already in this playlist`)
    }
    const spotifyService = new SpotifyService(user)
    await spotifyService.addSongToPlaylist(playlist.spotifyId, song.uri)
    return this.playListDao.addSongToPlaylist(user._id, playlist._id, song)
  }
}
