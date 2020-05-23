import { SpotifyClient, SpotifyUnauthorizedError } from '../../shared'
import { DBUser, Song } from '../../types'
import { UsersService } from '../users/users.service'

export class SpotifyService {
  user: DBUser
  usersService: UsersService

  constructor(user: DBUser) {
    this.user = user
    this.usersService = new UsersService()
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
}
