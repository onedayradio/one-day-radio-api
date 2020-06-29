import { getValue, SpotifyClient, SpotifyUnauthorizedError } from '../../shared'
import { DBUser, Song, SpotifyPlayList, SpotifyDevice } from '../../types'
import { UsersService } from '../users/users.service'

export class SpotifyService {
  usersService: UsersService

  constructor() {
    this.usersService = new UsersService()
  }

  async refreshAccessToken(dbUser: DBUser): Promise<DBUser> {
    const userRefreshToken = this.getUserRefreshToken(dbUser)
    const newAccessToken = await SpotifyClient.refreshAccessToken(userRefreshToken)
    const newUser = await this.usersService.updateUser(dbUser._id, {
      spotifyData: {
        accessToken: newAccessToken,
        refreshToken: userRefreshToken,
      },
    })
    return newUser
  }

  getUserAccessToken(user: DBUser): string {
    const { spotifyData } = user
    return spotifyData.accessToken
  }

  getUserRefreshToken(user: DBUser): string {
    const { spotifyData } = user
    return spotifyData.refreshToken
  }

  async searchSong(songQuery: string): Promise<Song[]> {
    const accessToken = await SpotifyClient.refreshAccessToken(getValue('spotify_refresh_token'))
    const response = await SpotifyClient.searchSong(accessToken, songQuery)
    const songs = response.tracks.items
    return songs.map((spotifySong) => ({
      id: spotifySong.id,
      name: spotifySong.name,
      artists: spotifySong.artists.map((spotifyArtist) => spotifyArtist.name).join(','),
      uri: spotifySong.uri,
      album: spotifySong.album,
    }))
  }

  async getPlayList(playListId: string): Promise<SpotifyPlayList> {
    const accessToken = await SpotifyClient.refreshAccessToken(getValue('spotify_refresh_token'))
    return await SpotifyClient.getPlayList(accessToken, playListId)
  }

  async createPlayList(playList: SpotifyPlayList): Promise<SpotifyPlayList> {
    const accessToken = await SpotifyClient.refreshAccessToken(getValue('spotify_refresh_token'))
    const userId = getValue('spotify_one_day_radio_user_id')
    return SpotifyClient.createPlayList(accessToken, userId, playList)
  }

  async loadPlayerDevices(user: DBUser): Promise<SpotifyDevice[]> {
    try {
      const { devices = [] } = await SpotifyClient.getPlayerDevices(this.getUserAccessToken(user))
      return devices
    } catch (error) {
      if (error instanceof SpotifyUnauthorizedError) {
        const dbUser = await this.refreshAccessToken(user._id)
        return this.loadPlayerDevices(dbUser)
      }
      throw error
    }
  }

  async playOnDevice(user: DBUser, playListId: string, deviceId: string): Promise<boolean> {
    try {
      const userAccessToken = this.getUserAccessToken(user)
      const { uri } = await SpotifyClient.getPlayList(userAccessToken, playListId)
      if (uri) {
        await SpotifyClient.followPlayList(userAccessToken, playListId)
        await SpotifyClient.playOnDevice(userAccessToken, deviceId, uri)
        return true
      }
      return false
    } catch (error) {
      if (error instanceof SpotifyUnauthorizedError) {
        const dbUser = await this.refreshAccessToken(user._id)
        return this.playOnDevice(dbUser, playListId, deviceId)
      }
      throw error
    }
  }

  async addSongToPlaylist(playlistId: string, songUri: string): Promise<boolean> {
    const accessToken = await SpotifyClient.refreshAccessToken(getValue('spotify_refresh_token'))
    const response = await SpotifyClient.addSongToPlaylist(accessToken, playlistId, songUri)
    return response
  }

  async uploadyPlaylistCoverImage(
    spotifyPlaylistId: string,
    imageBase64: string | Buffer,
  ): Promise<boolean> {
    const accessToken = await SpotifyClient.refreshAccessToken(getValue('spotify_refresh_token'))
    const response = await SpotifyClient.uploadyPlaylistCoverImage(
      accessToken,
      spotifyPlaylistId,
      imageBase64,
    )
    return response
  }
}
