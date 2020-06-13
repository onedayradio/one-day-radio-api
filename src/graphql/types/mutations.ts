import { authMutationTypes, playlistMutationTypes } from '../../components'

export const mutationsTypes = `
  type Mutation {
    ${authMutationTypes}
    ${playlistMutationTypes}
  }
`
