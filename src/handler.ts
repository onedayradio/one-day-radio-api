import { ApolloServer } from 'apollo-server-lambda'
import { Context, APIGatewayProxyEvent, APIGatewayProxyCallback } from 'aws-lambda'

import { schema, context } from './graphql'
import { connectToDatabase } from './shared/database'
import { errorsLogger } from './shared'

const apolloServer = new ApolloServer({
  schema,
  context,
})

const graphqlHandler = apolloServer.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
})

let cachedDb: any = null

export const handler = (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: APIGatewayProxyCallback,
): void => {
  context.callbackWaitsForEmptyEventLoop = false
  connectToDatabase(cachedDb)
    .then((db) => {
      cachedDb = db
      graphqlHandler(event, context, callback)
    })
    .catch((error: Error) => errorsLogger.error('unexpected error connecting to database', error))
}
