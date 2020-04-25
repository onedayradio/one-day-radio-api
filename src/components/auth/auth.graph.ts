import { AppContext, AuthResponse, AuthSocialArgs } from '../../types'

export const authType = `
  type AuthResponse {
    user: User!
    token: String!
  }
`

export const authMutationTypes = `
  authSocial(user: UserInput): AuthResponse
`

export const authMutationsResolvers = {
  authSocial: (
    root: {},
    { user }: AuthSocialArgs,
    { authService }: AppContext,
  ): Promise<AuthResponse> => authService.authSocial(user),
}
