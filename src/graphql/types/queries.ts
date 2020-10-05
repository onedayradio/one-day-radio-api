import {
  usersQueryTypes,
  genresQueryTypes,
  playListQueryTypes,
  devicesQueryTypes,
} from '../../components'

export const queryTypes = `
  type Query {
    ${usersQueryTypes}
    ${genresQueryTypes}
    ${playListQueryTypes}
    ${devicesQueryTypes}
  }
`
