import { authMutationsResolvers, userQueriesResolvers, genreQueriesResolvers } from '../components'

export const resolvers = {
  Query: {
    ...userQueriesResolvers,
    ...genreQueriesResolvers,
  },
  Mutation: {
    ...authMutationsResolvers,
  },
}
