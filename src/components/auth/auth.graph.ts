import { AuthenticationError } from 'apollo-server-lambda'

import { AppContext, AuthResponse, AuthSocialArgs } from '../../types'

export const authType = `
  type AuthResponse {
    user: User!
    token: String!
  }
`

export const authMutationTypes = `
  authSocial(user: UserInput): AuthResponse
  refreshToken: AuthResponse
`

export const authMutationsResolvers = {
  authSocial: (
    root: {},
    { user }: AuthSocialArgs,
    { authService }: AppContext,
  ): Promise<AuthResponse> => authService.authSocial(user),
  refreshToken: (
    root: {},
    args: {},
    { currentUser, tokenData, authService }: AppContext,
  ): Promise<AuthResponse> => {
    if (!currentUser || !tokenData) {
      throw new AuthenticationError('Unauthorized!!')
    }
    return authService.refreshToken(tokenData)
  },
}
