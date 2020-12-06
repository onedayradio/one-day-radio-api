import { User, SpotifyDevice } from '../../types'
import { SpotifyService } from '..'
import { Session } from 'neo4j-driver'

export class DevicesService {
  spotifyService: SpotifyService

  constructor(session: Session) {
    this.spotifyService = new SpotifyService(session)
  }

  loadPlayerDevices(user: User): Promise<SpotifyDevice[]> {
    return this.spotifyService.loadPlayerDevices(user)
  }
}
