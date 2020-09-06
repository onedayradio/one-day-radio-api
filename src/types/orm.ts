import { Session } from 'neo4j-driver'
import { ObjectSchema } from 'yup'

export interface DaoArgs {
  session: Session
  schema: ObjectSchema
  label: string
}

export interface LoadAllArgs {
  orderBy?: string
}

export interface LoadByIdArgs {
  id: number
}

export interface LoadByIdsArgs extends LoadAllArgs {
  ids: number[]
}
