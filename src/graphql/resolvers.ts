import {
  authMutationsResolvers,
  userQueriesResolvers,
  genreQueriesResolvers,
  searchQueriesResolvers,
  playListQueriesResolvers,
  deviceQueriesResolvers,
} from '../components'

export const resolvers = {
  Query: {
    ...userQueriesResolvers,
    ...genreQueriesResolvers,
    ...searchQueriesResolvers,
    ...playListQueriesResolvers,
    ...deviceQueriesResolvers,
  },
  Mutation: {
    ...authMutationsResolvers,
  },
}
