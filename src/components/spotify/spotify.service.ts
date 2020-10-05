import { getValue, SpotifyClient, SpotifyUnauthorizedError } from '../../shared'
import {
  DBUser,
  SpotifyPlaylist,
  SpotifyDevice,
  SpotifySong,
  SpotifyPlaylistSongs,
  Song,
} from '../../types'
import { UsersService } from '..'

export class SpotifyService {
  usersService: UsersService

  constructor() {
    this.usersService = new UsersService()
  }

  async refreshAccessToken(dbUser: DBUser): Promise<DBUser> {
    const userRefreshToken = this.getUserRefreshToken(dbUser)
    const newAccessToken = await SpotifyClient.refreshAccessToken(userRefreshToken)
    return this.usersService.updateUser(dbUser._id, {
      spotifyData: {
        accessToken: newAccessToken,
        refreshToken: userRefreshToken,
      },
    })
  }

  getUserAccessToken(user: DBUser): string {
    const { spotifyData } = user
    return spotifyData.accessToken
  }

  getUserRefreshToken(user: DBUser): string {
    const { spotifyData } = user
    return spotifyData.refreshToken
  }

  async searchSong(songQuery: string): Promise<SpotifyPlaylistSongs> {
    const accessToken = await SpotifyClient.refreshAccessToken(getValue('spotify_refresh_token'))
    const response = await SpotifyClient.searchSong(accessToken, songQuery)
    const songs = response.items.map((spotifySong) => ({
      id: spotifySong.id,
      name: spotifySong.name,
      artists: spotifySong.artists.map((spotifyArtist) => spotifyArtist.name).join(','),
      uri: spotifySong.uri,
      album: spotifySong.album,
    }))

    return {
      ...response,
      songs,
    }
  }

  async getPlaylist(playListId: string): Promise<SpotifyPlaylist> {
    const accessToken = await SpotifyClient.refreshAccessToken(getValue('spotify_refresh_token'))
    return await SpotifyClient.getPlaylist(accessToken, playListId)
  }

  async createPlaylist(playList: SpotifyPlaylist): Promise<SpotifyPlaylist> {
    const accessToken = await SpotifyClient.refreshAccessToken(getValue('spotify_refresh_token'))
    const userId = getValue('spotify_one_day_radio_user_id')
    return SpotifyClient.createPlaylist(accessToken, userId, playList)
  }

  async loadPlayerDevices(user: DBUser): Promise<SpotifyDevice[]> {
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

  async playOnDevice(user: DBUser, spotifyPlaylistId: string, deviceId: string): Promise<boolean> {
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
    playListId: string,
    currentPage: number,
    perPage: number,
  ): Promise<SpotifyPlaylistSongs> {
    const accessToken = await SpotifyClient.refreshAccessToken(getValue('spotify_refresh_token'))
    const response = await SpotifyClient.getPlaylistItems(
      accessToken,
      playListId,
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
    return {
      id: spotifySong.id,
      name: spotifySong.name,
      artists: spotifySong.artists.map((spotifyArtist) => spotifyArtist.name).join(','),
      uri: spotifySong.uri,
      album: spotifySong.album,
    }
  }
}
