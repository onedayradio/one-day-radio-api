import { AuthenticationError } from 'apollo-server-lambda'
import { AppContext, SpotifyDevice } from '../../types'

export const deviceType = `
  type SpotifyDevice {
    id: String
    name: String
  }
`

export const devicesQueryTypes = `
  loadSpotifyDevices: [SpotifyDevice]
`

export const deviceQueriesResolvers = {
  loadSpotifyDevices: (
    root: unknown,
    args: unknown,
    { devicesService, currentUser }: AppContext,
  ): Promise<SpotifyDevice[]> => {
    if (!currentUser) {
      throw new AuthenticationError('Unauthorized!!')
    }
    return devicesService.loadPlayerDevices(currentUser)
  },
}
