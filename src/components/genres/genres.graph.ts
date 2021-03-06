import { AppContext, LoadGenreArgs, Genre } from '../../types'
import { validateUserAuth } from '../../shared'

export const genreType = `
  type Genre {
    id: String!
    name: String
  }
`

export const genresQueryTypes = `
  loadAllGenres: [Genre]
  loadGenre(genreId: Int): Genre
`

export const genreQueriesResolvers = {
  loadAllGenres: async (
    root: unknown,
    args: unknown,
    { genresService, token, session }: AppContext,
  ): Promise<Genre[]> => {
    await validateUserAuth(session, token)
    return genresService.loadAll({ orderBy: 'order' })
  },

  loadGenre: async (
    root: unknown,
    { genreId }: LoadGenreArgs,
    { genresService, session, token }: AppContext,
  ): Promise<Genre> => {
    await validateUserAuth(session, token)
    return genresService.loadById({ id: genreId })
  },
}
