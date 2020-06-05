import {
  usersQueryTypes,
  genresQueryTypes,
  searchQueryTypes,
  playListQueryTypes,
} from '../../components'

export const queryTypes = `
  type Query {
    ${usersQueryTypes}
    ${genresQueryTypes}
    ${searchQueryTypes}
    ${playListQueryTypes}
  }
`
