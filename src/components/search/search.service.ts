import { Song, DBUser } from '../../types'
import { SpotifyService } from '../spotify/spotify.service'

export class SearchService {
  async search(user: DBUser, query: string): Promise<Song[]> {
    const spotifyApi = new SpotifyService()
    const songs = await spotifyApi.searchSong(query)
    return songs
  }
}
