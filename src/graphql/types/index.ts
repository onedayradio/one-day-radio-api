import { queryTypes } from './queries'
import { mutationsTypes } from './mutations'
import { sharedTypes } from './shared-graph-types'
import { authType, userType, genreType, playListType, deviceType } from '../../components'

export const typeDefs = `
  ${sharedTypes}
  ${queryTypes}
  ${mutationsTypes}
  ${authType}
  ${userType}
  ${genreType}
  ${playListType}
  ${deviceType}
`
