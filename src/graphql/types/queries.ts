import {
  usersQueryTypes,
  genresQueryTypes,
  playlistQueryTypes,
  devicesQueryTypes,
} from '../../components'

export const queryTypes = `
  type Query {
    ${usersQueryTypes}
    ${genresQueryTypes}
    ${playlistQueryTypes}
    ${devicesQueryTypes}
  }
`
