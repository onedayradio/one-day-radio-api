import {
  authMutationsResolvers,
  userQueriesResolvers,
  genreQueriesResolvers,
  searchQueriesResolvers,
  playListQueriesResolvers,
} from '../components'

export const resolvers = {
  Query: {
    ...userQueriesResolvers,
    ...genreQueriesResolvers,
    ...searchQueriesResolvers,
    ...playListQueriesResolvers,
  },
  Mutation: {
    ...authMutationsResolvers,
  },
}
