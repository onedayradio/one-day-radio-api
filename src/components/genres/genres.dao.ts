import { GenreModel } from './genre'
import { DBGenre, Genre } from '../../types'

export class GenresDao {
  async loadByIds(ids: string[]): Promise<DBGenre[]> {
    const genres = await GenreModel.find({ _id: { $in: ids } })
    return genres
  }

  create(genreData: Genre): Promise<DBGenre> {
    const newGenre = new GenreModel(genreData)
    return newGenre.save()
  }

  async getDetailById(id: string): Promise<DBGenre | null> {
    return GenreModel.findById(id)
  }

  async loadAll(): Promise<DBGenre[]> {
    return GenreModel.find({}).sort({ order: 'asc' })
  }
}
