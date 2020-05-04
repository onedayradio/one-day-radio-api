import { AuthenticationError } from 'apollo-server-lambda'
import { DBUser, AppContext } from '../../types'

export const userType = `
  type User {
    id: String!
    firstname: String
    lastname: String
    email: String
    displayName: String
    countryCode: String
    profileImageUrl: String
  }

  input UserInput {
    firstname: String
    lastname: String
    email: String
  }
`

export const usersQueryTypes = `
  loadAuthUser: User
`

export const userQueriesResolvers = {
  loadAuthUser: (
    root: {},
    args: {},
    { usersService, currentUser }: AppContext,
  ): Promise<DBUser> => {
    if (!currentUser) {
      throw new AuthenticationError('Unauthorized!!')
    }
    return usersService.getDetailById(currentUser._id)
  },
}
