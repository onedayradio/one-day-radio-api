import { ApolloServer } from 'apollo-server-lambda'
import { Context, APIGatewayProxyEvent, APIGatewayProxyCallback } from 'aws-lambda'

import { schema, context, plugins } from './graphql'
import { createNeo4JDriver, getValue } from './shared'

const apolloServer = new ApolloServer({
  schema,
  context,
  plugins,
})

const graphqlHandler = apolloServer.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
})

let cachedNeo4JDriver: any = null

export const handler = (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: APIGatewayProxyCallback,
): void => {
  context.callbackWaitsForEmptyEventLoop = false
  cachedNeo4JDriver = createNeo4JDriver(cachedNeo4JDriver)
  graphqlHandler(event as any, context, callback)
}
