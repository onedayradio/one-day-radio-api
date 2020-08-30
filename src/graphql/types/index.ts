import { queryTypes } from './queries'
import { mutationsTypes } from './mutations'
import { sharedTypes } from './shared-graph-types'
import { userType, genreType, playListType, deviceType } from '../../components'

export const typeDefs = `
  ${sharedTypes}
  ${queryTypes}
  ${mutationsTypes}
  ${userType}
  ${genreType}
  ${playListType}
  ${deviceType}
`
