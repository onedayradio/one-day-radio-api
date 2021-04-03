import { Session } from 'neo4j-driver'

import { GenresDao } from './genres.dao'
import { BaseService } from '../../shared'
import { GenreSchema } from './genre.schema'
import { Genre } from '../../types'

export class GenresService extends BaseService<Genre, GenresDao> {
  constructor(session: Session) {
    const dao = new GenresDao({ session, schema: GenreSchema, label: 'Genre' })
    super(session, dao)
  }
}
