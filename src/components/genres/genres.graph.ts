import { AppContext, LoadGenreArgs, Genre } from '../../types'

export const genreType = `
  type Genre {
    id: String!
    name: String
    playlistId: String
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
    { genresService }: AppContext,
  ): Promise<Genre[]> => {
    return genresService.loadAll({ orderBy: 'order' })
  },

  loadGenre: async (
    root: unknown,
    { genreId }: LoadGenreArgs,
    { genresService }: AppContext,
  ): Promise<Genre> => {
    return genresService.loadById({ id: genreId })
  },
}
