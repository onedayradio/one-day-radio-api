import { expect } from 'chai'
import {
  expectedGetByEmailOrCrateNewUser,
  expectedGetByEmailOrCreateExistingUser,
  expectedSanUser,
  expectedUpdatedUser2,
  expectedUpdatedUser3,
  expectedUpdatedUser4,
  expectedUpdateUser1,
} from '../../snapshots/users'

import { UsersService } from '../../../../src/components'
import { TestsUtil } from '../../tests.util2'
import { expectedAllUsersQueryResult } from 'tests/integration/snapshots/queryHelper'

const testsUtil = new TestsUtil()

const testSpotifyData = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
}

describe('UsersService', () => {
  beforeEach((done: any) => {
    testsUtil.setupData().then(() => done())
  })

  afterEach((done: any) => {
    testsUtil.closeSession().then(() => {
      done()
    })
  })

  after((done) => {
    testsUtil.closeDriverAndSession().then(() => done())
  })

  it('should not save a user if an invalid email is provided', async () => {
    try {
      const usersService = new UsersService(testsUtil.session)
      await usersService.create({ email: 'somebademail', spotifyData: testSpotifyData })
    } catch (error) {
      expect(error.message).to.equal('email must be a valid email')
    }
  })

  it('Should throw exception if creating a user with an already existing email', async () => {
    const usersService = new UsersService(testsUtil.session)
    try {
      await usersService.create({
        firstname: 'Juanca',
        lastname: 'Morales',
        email: 'juan@gmail.com',
        spotifyData: {
          accessToken: 'access',
          refreshToken: 'refresh',
        },
      })
    } catch (error) {
      expect(error.message).to.equal('User with email juan@gmail.com already exists!')
    }
  })

  it('should create an user', async () => {
    const usersService = new UsersService(testsUtil.session)
    const user = await usersService.create({
      firstname: 'Juan2',
      lastname: 'Morales2',
      email: 'juan2@gmail.com',
      spotifyData: {
        accessToken: 'access2',
        refreshToken: 'refresh2',
      },
    })
    expect(user.id).not.to.be.undefined
    expect(user.firstname).to.equal('Juan2')
    expect(user.email).to.equal('juan2@gmail.com')
    expect(user.spotifyData).to.containSubset({ accessToken: 'access2', refreshToken: 'refresh2' })
  })

  it('Should load user details by email', async () => {
    const usersService = new UsersService(testsUtil.session)
    const user = await usersService.loadByEmail('sandra.aguilar@gmail.com')
    expect(user).to.containSubset(expectedSanUser)
  })

  it('Should load user details by id', async () => {
    const usersService = new UsersService(testsUtil.session)
    const userByEmail = await usersService.loadByEmail('sandra.aguilar@gmail.com')
    const userById = await usersService.loadById({ id: userByEmail.id })
    expect(userById).to.containSubset(expectedSanUser)
  })

  it('Should load user details by ids', async () => {
    const usersService = new UsersService(testsUtil.session)
    const userByEmail = await usersService.loadByEmail('sandra.aguilar@gmail.com')
    const userById = await usersService.loadByIds({ ids: [userByEmail.id] })
    expect(userById).to.containSubset([expectedSanUser])
  })

  it('Should load all users', async () => {
    const usersService = new UsersService(testsUtil.session)
    const users = await usersService.loadAll()
    expect(users).to.containSubset(expectedAllUsersQueryResult)
  })

  it('Should throw exception if loadByEmail didnt find anything', async () => {
    const usersService = new UsersService(testsUtil.session)
    try {
      await usersService.loadByEmail('some@gmail.com')
    } catch (error) {
      expect(error.message).to.equal('User with email some@gmail.com not found in the database')
    }
  })

  it('should update users', async () => {
    const usersService = new UsersService(testsUtil.session)

    // updates email of user with spotifyData
    let userByEmail = await usersService.loadByEmail('sandra.aguilar@gmail.com')
    let updatedUser = await usersService.update(userByEmail.id, { email: 'sansan@gmail.com' })
    expect(updatedUser).to.containSubset(expectedUpdateUser1)

    // updates email of user that has no spotifyData
    userByEmail = await usersService.loadByEmail('juan@gmail.com')
    updatedUser = await usersService.update(userByEmail.id, { email: 'juanjuan@gmail.com' })
    expect(updatedUser).to.containSubset(expectedUpdatedUser2)

    // updates spotifyData for user that had spotifyData
    userByEmail = await usersService.loadByEmail('sansan@gmail.com')
    updatedUser = await usersService.update(userByEmail.id, {
      email: 'sansan@gmail.com',
      spotifyData: {
        accessToken: 'new access token',
        refreshToken: 'new refresh token',
      },
    })
    expect(updatedUser).to.containSubset(expectedUpdatedUser3)

    // updates spotifyData of user that had no spotifyData
    userByEmail = await usersService.loadByEmail('juanjuan@gmail.com')
    updatedUser = await usersService.update(userByEmail.id, {
      email: 'juan@gmail.com',
      spotifyData: { accessToken: 'juan-access-token', refreshToken: 'juan-refresh-token' },
    })
    expect(updatedUser).to.containSubset(expectedUpdatedUser4)
  })

  it('should throw error if trying to update an unexisting user', async () => {
    const usersService = new UsersService(testsUtil.session)
    try {
      await usersService.update(1133, { email: 'someEmail', firstname: 'some' })
    } catch (error) {
      expect(error.message).to.equal(`User with id ${1133} not found in the database`)
    }
  })

  it('should update existing user and return it when calling getByEmailOrCreate', async () => {
    const usersService = new UsersService(testsUtil.session)
    const response = await usersService.getByEmailOrCreate('juan@gmail.com', {
      email: 'juanjuan@gmail.com',
    })
    expect(response).to.containSubset(expectedGetByEmailOrCreateExistingUser)
  })

  it('should create a new user when calling getByEmailOrCreate', async () => {
    const usersService = new UsersService(testsUtil.session)
    const response = await usersService.getByEmailOrCreate('juannew@gmail.com', {
      email: 'juannew@gmail.com',
      spotifyData: {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      },
    })
    expect(response).to.containSubset(expectedGetByEmailOrCrateNewUser)
  })
})
