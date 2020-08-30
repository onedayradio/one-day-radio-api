import { keyBy } from 'lodash'
import { ApolloError } from 'apollo-server-lambda'

import { GenresDao } from './genres.dao'
import { Genre, DBGenre } from '../../types'

export class GenresService {
  genresDao: GenresDao

  constructor() {
    this.genresDao = new GenresDao()
  }

  async loadByIds(ids: string[]): Promise<DBGenre[]> {
    const genres = await this.genresDao.loadByIds(ids)
    const genresById = keyBy(genres, '_id')
    const genresSorted = ids.map((genreId: string) => genresById[genreId])
    return genresSorted
  }

  create(data: Genre): Promise<DBGenre> {
    return this.genresDao.create(data)
  }

  async getDetailById(genreId: string): Promise<DBGenre> {
    const genre = await this.genresDao.getDetailById(genreId)
    if (!genre) {
      throw new ApolloError(`Genre with id ${genreId} not found in the database`)
    }
    return genre
  }

  loadAll(): Promise<DBGenre[]> {
    return this.genresDao.loadAll()
  }

  async loadGenre(genreId: string): Promise<DBGenre> {
    return this.getDetailById(genreId)
  }
}
