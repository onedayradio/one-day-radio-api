import mongodb from 'mongodb'
import { expect } from 'chai'

import { testsSetup } from '../../tests.util'
import { UsersService } from '../../../../src/components/users/users.service'
import { ids } from '../../fixtures-ids'
import { expectedJuanUser } from '../../snapshots/users'

const usersService = new UsersService()

describe('UsersService', () => {
  beforeEach((done: any) => {
    void testsSetup(done)
  })

  it('should load users by ids', async () => {
    const { users } = ids
    const songsLoaded = await usersService.loadByIds([users.juanId, users.pabloId])
    expect(songsLoaded.length).to.equal(2)
  })

  it('should create an user', async () => {
    const user = await usersService.create({
      firstname: 'Juanca',
      lastname: 'Morales',
      email: 'juan2@gmail.com',
    })
    expect(user._id).not.to.be.undefined
    expect(user.firstname).to.equal('Juanca')
    expect(user.email).to.equal('juan2@gmail.com')
  })

  it('Should load user details by email', async () => {
    const { users } = ids
    const user = await usersService.getDetailByEmail('juan@gmail.com')
    expect(user._id + '').to.deep.equal(users.juanId + '')
    expect(user.firstname).to.equal('Juan')
  })

  it('should load user details', async () => {
    const { users } = ids
    const user = await usersService.getDetailById(users.juanId)
    expect(user).to.containSubset(expectedJuanUser)
  })

  it('should throw error if trying to find a user with an invalid id', async () => {
    const badId = new mongodb.ObjectID() + ''
    try {
      await usersService.getDetailById(badId)
    } catch (error) {
      expect(error.message).to.equal(`User with id ${badId} not found in the database`)
    }
  })

  it('should throw error if trying to update an unexisting user', async () => {
    const badId = new mongodb.ObjectID() + ''
    try {
      await usersService.updateUser(badId, { email: 'someEmail', firstname: 'some' })
    } catch (error) {
      expect(error.message).to.equal(`User with id ${badId} not found in the database`)
    }
  })
})
