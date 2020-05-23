import { usersQueryTypes, genresQueryTypes } from '../../components'

export const queryTypes = `
  type Query {
    ${usersQueryTypes}
    ${genresQueryTypes}
  }
`
