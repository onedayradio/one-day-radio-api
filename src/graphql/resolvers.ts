import {
  userQueriesResolvers,
  genreQueriesResolvers,
  playListQueriesResolvers,
  deviceQueriesResolvers,
  playlistMutationsResolvers,
} from '../components'

export const resolvers = {
  Query: {
    ...userQueriesResolvers,
    ...genreQueriesResolvers,
    ...playListQueriesResolvers,
    ...deviceQueriesResolvers,
  },
  Mutation: {
    ...playlistMutationsResolvers,
  },
}
