import { Session } from 'neo4j-driver'

import { getValue, SpotifyClient, SpotifyUnauthorizedError } from '../../shared'
import {
  User,
  SpotifyPlaylist,
  SpotifyDevice,
  SpotifySong,
  SpotifySongsList,
  Song,
} from '../../types'
import { UsersService } from '..'

export class SpotifyService {
  usersService: UsersService

  constructor(session: Session) {
    this.usersService = new UsersService(session)
  }

  async refreshAccessToken(dbUser: User): Promise<User> {
    const userRefreshToken = this.getUserRefreshToken(dbUser)
    const newAccessToken = await SpotifyClient.refreshAccessToken(userRefreshToken)
    return this.usersService.update(dbUser.id, {
      spotifyData: {
        accessToken: newAccessToken,
        refreshToken: userRefreshToken,
      },
    })
  }

  getUserAccessToken(user: User): string {
    const { spotifyData } = user
    return spotifyData.accessToken
  }

  getUserRefreshToken(user: User): string {
    const { spotifyData } = user
    return spotifyData.refreshToken
  }

  async searchSong(songQuery: string): Promise<SpotifySongsList> {
    const accessToken = await SpotifyClient.refreshAccessToken(getValue('spotify_refresh_token'))
    const response = await SpotifyClient.searchSong(accessToken, songQuery)

    const songs = response.items.map((spotifySong) => {
      return this.formatSpotifySong(spotifySong)
    })

    return {
      ...response,
      songs,
    }
  }

  async getPlaylist(playlistId: string): Promise<SpotifyPlaylist> {
    const accessToken = await SpotifyClient.refreshAccessToken(getValue('spotify_refresh_token'))
    return await SpotifyClient.getPlaylist(accessToken, playlistId)
  }

  async createPlaylist(playlist: SpotifyPlaylist): Promise<SpotifyPlaylist> {
    const accessToken = await SpotifyClient.refreshAccessToken(getValue('spotify_refresh_token'))
    const userId = getValue('spotify_one_day_radio_user_id')
    return SpotifyClient.createPlaylist(accessToken, userId, playlist)
  }

  async loadPlayerDevices(user: User): Promise<SpotifyDevice[]> {
    try {
      const { devices = [] } = await SpotifyClient.getPlayerDevices(this.getUserAccessToken(user))
      return devices
    } catch (error) {
      if (error instanceof SpotifyUnauthorizedError) {
        const dbUser = await this.refreshAccessToken(user)
        return this.loadPlayerDevices(dbUser)
      }
      throw error
    }
  }

  async playOnDevice(user: User, spotifyPlaylistId: string, deviceId: string): Promise<boolean> {
    try {
      const userAccessToken = this.getUserAccessToken(user)
      const { uri } = await SpotifyClient.getPlaylist(userAccessToken, spotifyPlaylistId)
      if (uri) {
        await SpotifyClient.followPlaylist(userAccessToken, spotifyPlaylistId)
        await SpotifyClient.playOnDevice(userAccessToken, deviceId, uri)
        return true
      }
      return false
    } catch (error) {
      if (error instanceof SpotifyUnauthorizedError) {
        const dbUser = await this.refreshAccessToken(user)
        return this.playOnDevice(dbUser, spotifyPlaylistId, deviceId)
      }
      throw error
    }
  }

  async addSongToPlaylist(playlistId: string, songUri: string): Promise<boolean> {
    const accessToken = await SpotifyClient.refreshAccessToken(getValue('spotify_refresh_token'))
    return SpotifyClient.addSongToPlaylist(accessToken, playlistId, songUri)
  }

  async removeSongFromPlaylist(playlistId: string, songUri: string): Promise<boolean> {
    const accessToken = await SpotifyClient.refreshAccessToken(getValue('spotify_refresh_token'))
    return SpotifyClient.removeSongFromPlaylist(accessToken, playlistId, songUri)
  }

  async uploadPlaylistCoverImage(
    spotifyPlaylistId: string,
    imageBase64: string | Buffer,
  ): Promise<boolean> {
    const accessToken = await SpotifyClient.refreshAccessToken(getValue('spotify_refresh_token'))
    return SpotifyClient.uploadPlaylistCoverImage(accessToken, spotifyPlaylistId, imageBase64)
  }

  async getPlaylistItems(
    playlistId: string,
    currentPage: number,
    perPage: number,
  ): Promise<SpotifySongsList> {
    const accessToken = await SpotifyClient.refreshAccessToken(getValue('spotify_refresh_token'))
    const response = await SpotifyClient.getPlaylistItems(
      accessToken,
      playlistId,
      currentPage,
      perPage,
    )
    const songs = response.items.map((song) => {
      return this.formatSpotifySong(song.track)
    })

    return {
      ...response,
      songs,
    }
  }

  formatSpotifySong(spotifySong: SpotifySong): Song {
    const albumImages = spotifySong.album.images || []
    const albumImage300 = albumImages.find((image) => image.width === 300)
    return {
      spotifyId: spotifySong.id,
      name: spotifySong.name,
      artistSpotifyIds: spotifySong.artists.map((spotifyArtist) => spotifyArtist.id).join(','),
      artistsNames: spotifySong.artists.map((spotifyArtist) => spotifyArtist.name).join(','),
      spotifyUri: spotifySong.uri,
      albumName: spotifySong.album.name,
      albumSpotifyId: spotifySong.album.id,
      albumImage300: albumImage300 ? albumImage300.url : '',
    }
  }
}
