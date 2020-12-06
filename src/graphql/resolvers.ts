import {
  userQueriesResolvers,
  genreQueriesResolvers,
  playlistQueriesResolvers,
  deviceQueriesResolvers,
  playlistMutationsResolvers,
} from '../components'

export const resolvers = {
  Query: {
    ...userQueriesResolvers,
    ...genreQueriesResolvers,
    ...playlistQueriesResolvers,
    ...deviceQueriesResolvers,
  },
  Mutation: {
    ...playlistMutationsResolvers,
  },
}
