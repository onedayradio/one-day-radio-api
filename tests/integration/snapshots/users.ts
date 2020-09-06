export const expectedSanUser = {
  spotifyData: { accessToken: 'access-token', refreshToken: 'refresh-token' },
  email: 'sandra.aguilar@gmail.com',
  firstname: 'Sandra',
  lastname: 'Aguilar',
}

export const expectedAllUsers = [
  {
    spotifyData: null,
    lastname: 'Morales',
    firstname: 'Juan',
    email: 'juan@gmail.com',
  },
  {
    spotifyData: null,
    email: 'pablo.gonzalez@gmail.com',
    firstname: 'Pablo',
    lastname: 'Gonzalez',
  },
  {
    spotifyData: { accessToken: 'access-token', refreshToken: 'refresh-token' },
    email: 'sandra.aguilar@gmail.com',
    firstname: 'Sandra',
    lastname: 'Aguilar',
  },
  {
    spotifyData: {
      refreshToken: 'jose-refresh-token',
      accessToken: 'jose-access-token',
    },
    lastname: 'Morales',
    firstname: 'Jose',
    email: 'jose.morales@gmail.com',
  },
]

export const expectedUpdateUser1 = {
  spotifyData: { accessToken: 'access-token', refreshToken: 'refresh-token' },
  email: 'sansan@gmail.com',
  firstname: 'Sandra',
  lastname: 'Aguilar',
}

export const expectedUpdatedUser2 = {
  spotifyData: {},
  email: 'juanjuan@gmail.com',
  lastname: 'Morales',
  firstname: 'Juan',
}

export const expectedUpdatedUser3 = {
  spotifyData: {
    accessToken: 'new access token',
    refreshToken: 'new refresh token',
  },
  email: 'sansan@gmail.com',
  firstname: 'Sandra',
  lastname: 'Aguilar',
}

export const expectedUpdatedUser4 = {
  spotifyData: {
    accessToken: 'juan-access-token',
    refreshToken: 'juan-refresh-token',
  },
  lastname: 'Morales',
  firstname: 'Juan',
  email: 'juan@gmail.com',
}

export const expectedGetByEmailOrCreateExistingUser = {
  isNewUser: false,
  dbUser: {
    spotifyData: {},
    email: 'juanjuan@gmail.com',
    lastname: 'Morales',
    firstname: 'Juan',
  },
}

export const expectedGetByEmailOrCrateNewUser = {
  isNewUser: true,
  dbUser: {
    spotifyData: { accessToken: 'accessToken', refreshToken: 'refreshToken' },
    email: 'juannew@gmail.com',
  },
}
