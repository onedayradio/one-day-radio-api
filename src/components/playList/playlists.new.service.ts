import { Session } from 'neo4j-driver'
import * as base64Image from 'node-base64-image'

import { PlaylistsDao } from './playlists.new.dao'
import { BaseService, Constants, errorsLogger, getValueAsInt } from '../../shared'
import { PlaylistSchema } from './palylist.schema'
import { Playlist, PlaylistData, PlaylistSong, SearchSong, Song, User } from '../../types'
import { GenresService } from '../genres/genres.service'
import { SpotifyService } from '../spotify/spotify.service'

export class PlaylistsService extends BaseService<Playlist, PlaylistsDao> {
  genresService: GenresService
  spotifyService: SpotifyService

  constructor(session: Session) {
    const dao = new PlaylistsDao({ session, schema: PlaylistSchema, label: 'Playlist' })
    super(session, dao)
    this.genresService = new GenresService(session)
    this.spotifyService = new SpotifyService(session)
  }

  async create(playlist: PlaylistData): Promise<Playlist> {
    const { name, description, genreId } = playlist
    const spotifyPlaylist = await this.spotifyService.createPlaylist({ name, description })
    const { id } = spotifyPlaylist
    const dbPlaylist = await this.dao.create({
      spotifyId: id,
      name,
      description,
      genreId,
    })
    await this.uploadPlaylistImage(dbPlaylist.spotifyId, genreId)
    return dbPlaylist
  }

  async getByGenreIdOrCreate(genreId: number): Promise<Playlist> {
    const playlist = await this.dao.loadByGenreId(genreId)
    if (playlist) {
      return playlist
    }
    const playlistData = await this.createPlaylistData(genreId)
    return this.create(playlistData)
  }

  async addSongToPlaylist(userId: number, genreId: number, song: Song): Promise<PlaylistSong> {
    const maxSongsAllowedPerUser = getValueAsInt('max_user_songs_per_playlist')
    const playlist = await this.getByGenreIdOrCreate(genreId)
    const userSongs = await this.loadActiveSongsByUser(playlist.id, userId)
    if (userSongs.length >= maxSongsAllowedPerUser) {
      throw new Error('User has reached max amount of songs for this playlist')
    }
    const [songDuplicateData] = await this.playlistContains(playlist.id, [song.spotifyId])
    if (songDuplicateData.duplicate) {
      throw new Error(`Song ${song.name} by ${song.artistsNames} is already in this playlist`)
    }
    const playlistGenre = await this.genresService.loadById({ id: playlist.genreId })
    const allPlaylistSongs = await this.loadAllPlaylistActiveSongs(playlist.id)
    if (allPlaylistSongs.length >= playlistGenre.maxSongs) {
      const { song: oldestSong } = allPlaylistSongs[allPlaylistSongs.length - 1]
      await this.spotifyService.removeSongFromPlaylist(playlist.spotifyId, oldestSong.spotifyUri)
      await this.removeSongFromPlaylist(playlist.id, oldestSong.id)
    }
    await this.spotifyService.addSongToPlaylist(playlist.spotifyId, song.spotifyUri)
    const dbSong = await this.dao.addSongToPlaylist(userId, playlist.id, song)

    return dbSong
  }

  loadActiveSongsByUser(playlistId: number, userId: number): Promise<PlaylistSong[]> {
    return this.dao.loadActiveSongsByUser(playlistId, userId)
  }

  loadActiveSongsBySpotifyIds(playlistId: number, spotifyIds: string[]): Promise<PlaylistSong[]> {
    return this.dao.loadActiveSongsBySpotifyIds(playlistId, spotifyIds)
  }

  async loadAllPlaylistActiveSongsByGenre(genreId: number): Promise<PlaylistSong[]> {
    const playlist = await this.getByGenreIdOrCreate(genreId)
    return this.dao.loadAllPlaylistActiveSongs(playlist.id)
  }

  loadAllPlaylistActiveSongs(playlistId: number): Promise<PlaylistSong[]> {
    return this.dao.loadAllPlaylistActiveSongs(playlistId)
  }

  removeSongFromPlaylist(playlistId: number, songId: number): Promise<PlaylistSong> {
    return this.dao.removeSongFromPlaylist(playlistId, songId)
  }

  async playlistContains(
    playlistId: number,
    spotifySongIds: string[],
  ): Promise<{ spotifyId: string; duplicate: boolean }[]> {
    const playlistSongs = await this.loadActiveSongsBySpotifyIds(playlistId, spotifySongIds)
    const duplicateSpotifyIds = playlistSongs.map(({ song }) => song.spotifyId)
    return spotifySongIds.map((spotifyId) => ({
      spotifyId,
      duplicate: duplicateSpotifyIds.includes(spotifyId),
    }))
  }

  async createPlaylistData(genreId: number): Promise<PlaylistData> {
    const genre = await this.genresService.loadById({ id: genreId })
    const name = this.createPlaylistName(genre.name)
    return {
      name,
      description: this.createPlaylistDescription(name),
      genreId,
    }
  }

  async playOnDevice(user: User, genreId: number, deviceId: string): Promise<boolean> {
    const playlist = await this.dao.loadByGenreId(genreId)
    if (!playlist || !playlist.spotifyId) {
      throw new Error(`Playlist for the genre Id ${genreId} does not exists!`)
    }
    return this.spotifyService.playOnDevice(user, playlist.spotifyId, deviceId)
  }

  createPlaylistDescription(name: string): string {
    return `This playlist has been created for you by the community. ${name}`
  }

  createPlaylistName(genreName: string): string {
    return `One day Radio. ${genreName} playlist`
  }

  async uploadPlaylistImage(spotifyPlaylistId: string, genreId: number): Promise<boolean> {
    try {
      const genre = await this.genresService.loadById({ id: genreId })
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

  async searchSongs(playlistId: number, searchText: string): Promise<SearchSong[]> {
    const searchResponse = await this.spotifyService.searchSong(searchText)
    const { songs } = searchResponse
    const spotifySongIds = songs.map((song) => song.spotifyId)
    const dbPlaylistSongs = await this.loadActiveSongsBySpotifyIds(playlistId, spotifySongIds)
    return songs.map((song) => {
      const dbSong = dbPlaylistSongs.find(
        (playlistSong) => playlistSong.song.spotifyId === song.spotifyId,
      )
      return {
        song,
        sharedBy: dbSong && dbSong.sharedBy,
        sharedOn: dbSong && dbSong.sharedOn,
        active: dbSong ? true : false,
      }
    })
  }
}
