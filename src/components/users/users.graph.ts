import { validateUserAuth } from '../../shared'
import { AppContext, User } from '../../types'

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
  loadAuthUser: async (
    root: unknown,
    args: unknown,
    { session, token }: AppContext,
  ): Promise<User> => {
    const currentUser = await validateUserAuth(session, token)
    return currentUser
  },
}
