import { queryTypes } from './queries'
import { mutationsTypes } from './mutations'
import { sharedTypes } from './shared-graph-types'
import { userType, genreType, playlistType, deviceType } from '../../components'

export const typeDefs = `
  ${sharedTypes}
  ${queryTypes}
  ${mutationsTypes}
  ${userType}
  ${genreType}
  ${playlistType}
  ${deviceType}
`
