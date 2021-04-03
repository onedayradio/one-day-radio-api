export const plugins = [
  {
    // eslint-disable-next-line
    requestDidStart: (): any => {
      return {
        // before returning anything from graphQL we make sure
        // that we close the current neo4j session! :)
        willSendResponse: async (reqContext: any) => {
          const { context } = reqContext
          if (context && context.session) {
            await context.session.close()
          }
        },
      }
    },
  },
]
