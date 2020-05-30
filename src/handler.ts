import { ApolloServer } from 'apollo-server-lambda'
import { Context, APIGatewayProxyEvent, APIGatewayProxyCallback } from 'aws-lambda'

import { schema, context } from './graphql'
import { initDBConnection } from './shared/database'
import { generalLogger, errorsLogger } from './shared'

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

const connect = initDBConnection()

export const handler = (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: APIGatewayProxyCallback,
): void => {
  context.callbackWaitsForEmptyEventLoop = false
  connect
    .then(() => {
      generalLogger.info('Successfully connected to MongoDB!')
      graphqlHandler(event, context, callback)
    })
    .catch((error) => errorsLogger.error('unexpected error connecting to database', error))
}
