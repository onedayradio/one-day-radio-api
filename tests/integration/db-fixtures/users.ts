import { ids } from '../fixtures-ids'

module.exports = [
  {
    _id: ids.users.juanId,
    firstname: 'Juan',
    lastname: 'Morales',
    email: 'juan@gmail.com',
  },
  {
    _id: ids.users.pabloId,
    firstname: 'Pablo',
    lastname: 'Gonzalez',
    email: 'pablo.gonzalez@gmail.com',
  },
  {
    _id: ids.users.sanId,
    firstname: 'Sandra',
    lastname: 'Aguilar',
    email: 'sandra.aguilar@gmail.com',
    spotifyData: {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    },
  },
  {
    _id: ids.users.joseId,
    firstname: 'Jose',
    lastname: 'Morales',
    email: 'jose.morales@gmail.com',
    spotifyData: {
      accessToken: 'jose-access-token',
      refreshToken: 'jose-refresh-token',
    },
  },
]
