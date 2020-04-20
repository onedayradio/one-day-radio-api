import { ids } from '../fixtures-ids'

export const expectedSignUpSocialNewUser = {
  user: {
    firstname: 'new firstname',
    lastname: 'new lastname',
    email: 'new@gmail.com',
  },
}

export const expectedSignUpSocialExistingUser = {
  user: {
    _id: ids.users.juanId,
    firstname: 'Juan',
    lastname: 'Morales',
    email: 'juan@gmail.com',
  },
}
