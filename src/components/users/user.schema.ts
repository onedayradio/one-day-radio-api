import { object, string } from 'yup'

export const UserSchema = object().shape({
  email: string().email().required(),
  firstname: string(),
  lastname: string(),
  displayName: string(),
  countryCode: string(),
  profileImageUrl: string(),
  spotifyData: object()
    .shape({
      accessToken: string().required(),
      refreshToken: string().required(),
      spotifyUserId: string(),
    })
    .required(),
})
