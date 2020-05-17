import { queryTypes } from './queries'
import { mutationsTypes } from './mutations'
import { sharedTypes } from './shared-graph-types'
import { authType, userType, genreType } from '../../components'

export const typeDefs = `
  ${sharedTypes}
  ${queryTypes}
  ${mutationsTypes}
  ${authType}
  ${userType}
  ${genreType}
`
