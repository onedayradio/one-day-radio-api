import { authMutationsResolvers, userQueriesResolvers } from '../components'

export const resolvers = {
  Query: {
    ...userQueriesResolvers,
  },
  Mutation: {
    ...authMutationsResolvers,
  },
}
