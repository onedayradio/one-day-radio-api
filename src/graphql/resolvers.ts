import {
  authMutationsResolvers,
  userQueriesResolvers,
  genreQueriesResolvers,
  searchQueriesResolvers,
  playListQueriesResolvers,
  deviceQueriesResolvers,
  playlistMutationsResolvers,
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
    ...playlistMutationsResolvers,
  },
}
