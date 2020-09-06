import { Session, isInt } from 'neo4j-driver'
import { isPlainObject } from 'lodash'

interface QueryArgs {
  query: string
  mapBy?: string
  options?: any
}

export class QueryHelper {
  session: Session

  constructor(session: Session) {
    this.session = session
  }

  async executeQuery<T>({ query, mapBy, options }: QueryArgs): Promise<T[]> {
    const response = await this.session.run(query, options)
    const records = response.records || []
    return records.map((record) => this.groomObject(record.toObject(), mapBy))
  }

  groomObject(obj: { [key: string]: any }, mapBy?: string): any {
    const newObj: any = {}
    const keys = Object.keys(mapBy ? obj[mapBy] : obj)
    keys.forEach((key) => {
      const value = mapBy ? obj[mapBy][key] : obj[key]
      if (this.isDate(value)) {
        newObj[key] = this.toJSDate(value)
      } else if (isPlainObject(value)) {
        newObj[key] = this.groomObject(value)
      } else {
        newObj[key] = isInt(value) ? value.toInt() : value
      }
    })
    if ('properties' in newObj) {
      return newObj['properties']
    }
    return newObj
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  isDate(value: any): boolean {
    if (value && value.timeZoneId !== undefined) {
      return true
    }
    return false
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  toJSDate(value: any): Date {
    return new Date(value.year.toInt(), value.month.toInt(), value.day.toInt())
  }

  async executeQueryAndReturnFirst<T>(options: QueryArgs): Promise<T> {
    const records = await this.executeQuery<T>(options)
    return records[0]
  }
}
