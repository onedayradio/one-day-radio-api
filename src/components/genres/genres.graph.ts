import { AuthenticationError } from 'apollo-server-lambda'
import { AppContext, DBGenre } from '../../types'

export const genreType = `
  type Genre {
    id: String!
    name: String
  }
`

export const genresQueryTypes = `
  loadAllGenres: [Genre]
`

export const genreQueriesResolvers = {
  loadAllGenres: (
    root: {},
    args: {},
    { genresService, currentUser }: AppContext,
  ): Promise<DBGenre[]> => {
    if (!currentUser) {
      throw new AuthenticationError('Unauthorized!!')
    }
    return genresService.loadAll()
  },
}
