import { DBUser, SpotifyDevice } from '../../types'
import { SpotifyService } from '..'

export class DevicesService {
  loadPlayerDevices(user: DBUser): Promise<SpotifyDevice[]> {
    const spotifyService = new SpotifyService()
    return spotifyService.loadPlayerDevices(user)
  }
}
