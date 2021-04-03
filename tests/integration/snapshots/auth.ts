import { ids } from '../fixtures-ids'

export const expectedSignUpSocialNewUser = {
  user: {
    firstname: 'new firstname',
    lastname: 'new lastname',
    email: 'new@gmail.com',
    spotifyData: {
      accessToken: 'accesstoken',
      refreshToken: 'refreshtoken',
    },
  },
}

export const expectedSignUpSocialExistingUser = {
  user: {
    _id: ids.users.juanId,
    firstname: 'Juan',
    lastname: 'Morales',
    email: 'juan@gmail.com',
    spotifyData: {
      accessToken: 'accesstoken',
      refreshToken: 'refreshtoken',
    },
  },
}
