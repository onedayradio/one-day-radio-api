import { DBUser, SpotifyDevice } from '../../types'
import { SpotifyService } from '..'

export class DevicesService {
  loadPlayerDevices(user: DBUser): Promise<SpotifyDevice[]> {
    const spotifyApi = new SpotifyService(user)
    return spotifyApi.loadPlayerDevices()
  }
}
