import { Session } from 'neo4j-driver'
import { ApolloError } from 'apollo-server-lambda'
import { keyBy } from 'lodash'

import { BaseDao } from './base.dao'
import { LoadAllArgs, LoadByIdArgs, LoadByIdsArgs } from '../../types'

export class BaseService<EntityType, DaoType> {
  session: Session
  dao: BaseDao<EntityType> & DaoType
  constructor(session: Session, dao: BaseDao<EntityType> & DaoType) {
    this.session = session
    this.dao = dao
  }

  create(data: Partial<EntityType>): Promise<EntityType> {
    return this.dao.create(data)
  }

  update(id: number, data: Partial<EntityType>): Promise<EntityType> {
    return this.dao.update(id, data)
  }

  loadAll(args?: LoadAllArgs): Promise<EntityType[]> {
    return this.dao.loadAll(args)
  }

  async loadByIds(args: LoadByIdsArgs): Promise<EntityType[]> {
    const genres = await this.dao.loadByIds(args)
    const genresById = keyBy(genres, 'id')
    const genresSorted = args.ids.map((genreId: number) => genresById[genreId])
    return genresSorted
  }

  async loadById(args: LoadByIdArgs): Promise<EntityType> {
    const entityFound = await this.dao.loadById(args)
    if (!entityFound) {
      throw new ApolloError(`Genre with id ${args.id} not found in the database`)
    }
    return entityFound
  }
}
