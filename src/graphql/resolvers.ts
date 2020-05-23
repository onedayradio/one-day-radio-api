import {
  authMutationsResolvers,
  userQueriesResolvers,
  genreQueriesResolvers,
  searchQueriesResolvers,
} from '../components'

export const resolvers = {
  Query: {
    ...userQueriesResolvers,
    ...genreQueriesResolvers,
    ...searchQueriesResolvers,
  },
  Mutation: {
    ...authMutationsResolvers,
  },
}
