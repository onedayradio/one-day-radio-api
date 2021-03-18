import { Session } from 'neo4j-driver'
import { ObjectSchema } from 'yup'

import { QueryHelper } from '../queryHelper'
import { DaoArgs, LoadAllArgs, LoadByIdArgs, LoadByIdsArgs } from '../../types'

export class BaseDao<EntityType> {
  session: Session
  queryHelper: QueryHelper
  schema: ObjectSchema<any, any, any, any>
  label: string

  constructor({ session, schema, label }: DaoArgs) {
    this.session = session
    this.schema = schema
    this.label = label
    this.queryHelper = new QueryHelper(session)
  }

  get loadAllQuery(): string {
    return `
    MATCH (allNodes:$label)
    RETURN (allNodes{.*, id: ID(allNodes)})
    `
  }

  get loadByIdQuery(): string {
    return `
    MATCH (node:$label)
    WHERE ID(node) = $id
    RETURN (node{.*, id: ID(node)})
    `
  }

  get loadByIdsQuery(): string {
    return `
    MATCH (nodes:$label)
    WHERE ID(nodes) IN [$ids]
    RETURN (nodes{.*, id: ID(nodes)})
    `
  }

  get createQuery(): string {
    return `
    CREATE (newNode:$label)
    SET newNode = $data
    SET newNode.created = datetime()
    RETURN newNode{ .*, id: ID(newNode) };
    `
  }

  get updateQuery(): string {
    return `
    MATCH (node:$label)
    WHERE ID(node) = $id
    SET node += $data
    SET node.updated = datetime()
    RETURN (node{.*, id: ID(node)})
    `
  }

  async create(data: Partial<EntityType>): Promise<EntityType> {
    const query = this.createQuery.replace('$label', this.label)
    this.schema.validateSync(data, { abortEarly: false })
    return this.queryHelper.executeQueryAndReturnFirst({
      query,
      mapBy: 'newNode',
      options: { data },
    })
  }

  async update(id: number, data: Partial<EntityType>): Promise<EntityType> {
    const query = this.updateQuery.replace('$label', this.label).replace('$id', `${id}`)
    return this.queryHelper.executeQueryAndReturnFirst({
      query,
      mapBy: 'node',
      options: { data },
    })
  }

  async loadById({ id }: LoadByIdArgs): Promise<EntityType | undefined> {
    const query = this.loadByIdQuery.replace('$label', this.label).replace('$id', `${id}`)
    return this.queryHelper.executeQueryAndReturnFirst({ query: query, mapBy: 'node' })
  }

  async loadByIds({ ids, orderBy }: LoadByIdsArgs): Promise<EntityType[]> {
    let query = this.loadByIdsQuery.replace('$label', this.label).replace('$ids', ids.join(','))
    if (orderBy) {
      query = `
      ${query}
      ORDER BY nodes.${orderBy}
      `
    }
    return this.queryHelper.executeQuery({ query: query, mapBy: 'nodes' })
  }

  async loadAll(args?: LoadAllArgs): Promise<EntityType[]> {
    const orderBy = args ? args.orderBy : 'id'
    let query = this.loadAllQuery.replace('$label', this.label)
    if (orderBy) {
      query = `
      ${query}
      ORDER BY allNodes.${orderBy}
      `
    }
    return this.queryHelper.executeQuery({ query: query, mapBy: 'allNodes' })
  }
}
