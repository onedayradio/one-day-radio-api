import { validateUserAuth } from '../../shared'
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
  loadSpotifyDevices: async (
    root: unknown,
    args: unknown,
    { devicesService, session, token }: AppContext,
  ): Promise<SpotifyDevice[]> => {
    const currentUser = await validateUserAuth(session, token)
    return devicesService.loadPlayerDevices(currentUser)
  },
}
