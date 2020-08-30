import { AuthenticationError } from 'apollo-server-lambda'
import { AppContext, DBGenre, LoadGenreArgs } from '../../types'

export const genreType = `
  type Genre {
    id: String!
    name: String
  }
`

export const genresQueryTypes = `
  loadAllGenres: [Genre]
  loadGenre(genreId: String): Genre
`

export const genreQueriesResolvers = {
  loadAllGenres: (
    root: unknown,
    args: unknown,
    { genresService, currentUser }: AppContext,
  ): Promise<DBGenre[]> => {
    if (!currentUser) {
      throw new AuthenticationError('Unauthorized!!')
    }
    return genresService.loadAll()
  },

  loadGenre: (
    root: unknown,
    { genreId }: LoadGenreArgs,
    { genresService, currentUser }: AppContext,
  ): Promise<DBGenre> => {
    if (!currentUser) {
      throw new AuthenticationError('Unauthorized!!')
    }
    return genresService.loadGenre(genreId)
  },
}
