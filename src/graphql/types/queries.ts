import { usersQueryTypes, genresQueryTypes, searchQueryTypes } from '../../components'

export const queryTypes = `
  type Query {
    ${usersQueryTypes}
    ${genresQueryTypes}
    ${searchQueryTypes}
  }
`
