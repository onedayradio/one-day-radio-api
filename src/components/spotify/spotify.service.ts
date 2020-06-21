import { getValue, SpotifyClient, SpotifyUnauthorizedError } from '../../shared'
import { DBUser, Song, SpotifyPlayList, SpotifyDevice } from '../../types'
import { UsersService } from '../users/users.service'

export class SpotifyService {
  user: DBUser
  usersService: UsersService

  constructor(user: DBUser) {
    this.user = user
    this.usersService = new UsersService()
  }

  async refreshAccessToken(): Promise<DBUser> {
    const newAccessToken = await SpotifyClient.refreshAccessToken(this.getUserRefreshToken())
    const newUser = await this.usersService.updateUser(this.user._id, {
      spotifyData: {
        accessToken: newAccessToken,
        refreshToken: this.getUserRefreshToken(),
      },
    })
    return newUser
  }

  getUserAccessToken(): string {
    const { spotifyData } = this.user
    return spotifyData.accessToken
  }

  getUserRefreshToken(): string {
    const { spotifyData } = this.user
    return spotifyData.refreshToken
  }

  async searchSong(songQuery: string): Promise<Song[]> {
    try {
      const response = await SpotifyClient.searchSong(this.getUserAccessToken(), songQuery)
      const songs = response.tracks.items
      return songs.map((spotifySong) => ({
        id: spotifySong.id,
        name: spotifySong.name,
        artists: spotifySong.artists.map((spotifyArtist) => spotifyArtist.name).join(','),
        album: spotifySong.album,
      }))
    } catch (error) {
      if (error instanceof SpotifyUnauthorizedError) {
        this.user = await this.refreshAccessToken()
        return this.searchSong(songQuery)
      }
      throw error
    }
  }

  async getPlayList(playListId: string): Promise<SpotifyPlayList> {
    try {
      const accessToken = await SpotifyClient.refreshAccessToken(getValue('spotify_refresh_token'))
      return await SpotifyClient.getPlayList(accessToken, playListId)
    } catch (error) {
      if (error instanceof SpotifyUnauthorizedError) {
        this.user = await this.refreshAccessToken()
        return this.getPlayList(playListId)
      }
      throw error
    }
  }

  async createPlayList(playList: SpotifyPlayList): Promise<SpotifyPlayList> {
    const accessToken = await SpotifyClient.refreshAccessToken(getValue('spotify_refresh_token'))
    const userId = getValue('spotify_one_day_radio_user_id')
    return SpotifyClient.createPlayList(accessToken, userId, playList)
  }

  async loadPlayerDevices(): Promise<SpotifyDevice[]> {
    try {
      const { devices = [] } = await SpotifyClient.getPlayerDevices(this.getUserAccessToken())
      return devices
    } catch (error) {
      if (error instanceof SpotifyUnauthorizedError) {
        this.user = await this.refreshAccessToken()
        return this.loadPlayerDevices()
      }
      throw error
    }
  }

  async playOnDevice(playListId: string, deviceId: string): Promise<boolean> {
    try {
      const { uri } = await SpotifyClient.getPlayList(this.getUserAccessToken(), playListId)
      if (uri) {
        await SpotifyClient.followPlayList(this.getUserAccessToken(), playListId)
        await SpotifyClient.playOnDevice(this.getUserAccessToken(), deviceId, uri)
        return true
      }
      return false
    } catch (error) {
      if (error instanceof SpotifyUnauthorizedError) {
        this.user = await this.refreshAccessToken()
        return this.playOnDevice(playListId, deviceId)
      }
      throw error
    }
  }
}
