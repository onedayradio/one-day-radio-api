import { makeExecutableSchema } from 'graphql-tools'

import { typeDefs } from './types'
import { resolvers } from './resolvers'
import { GraphQLSchema } from 'graphql'

const getSchema = (): GraphQLSchema =>
  makeExecutableSchema({
    typeDefs,
    resolvers,
  })

const schema = getSchema()

export { schema }
