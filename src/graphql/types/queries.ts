import {
  usersQueryTypes,
  genresQueryTypes,
  searchQueryTypes,
  playListQueryTypes,
  devicesQueryTypes,
} from '../../components'

export const queryTypes = `
  type Query {
    ${usersQueryTypes}
    ${genresQueryTypes}
    ${searchQueryTypes}
    ${playListQueryTypes}
    ${devicesQueryTypes}
  }
`
