import { AuthenticationError } from 'apollo-server-lambda'
import { AppContext, SearchQueryArgs, Song } from '../../types'

export const searchQueryTypes = `
  search(query: String): [Song]
`

export const searchQueriesResolvers = {
  search: (
    root: unknown,
    { query }: SearchQueryArgs,
    { searchService, currentUser }: AppContext,
  ): Promise<Song[]> => {
    if (!currentUser) {
      throw new AuthenticationError('Unauthorized!!')
    }
    return searchService.search(currentUser, query)
  },
}
