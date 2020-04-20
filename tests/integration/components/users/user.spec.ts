import { expect } from 'chai'

import { testsSetup } from '../../tests.util'
import { UserModel } from '../../../../src/components/users/user'

describe('User Model', () => {
  beforeEach((done: any) => {
    void testsSetup(done)
  })

  it('should not save a user that has an already existing email', async () => {
    const user = new UserModel({
      firstname: 'Jose',
      email: 'juan@gmail.com',
      password: 'test-password',
    })
    try {
      await user.save()
    } catch (error) {
      expect(error.message).to.equal('User validation failed: email: Email already in use')
    }
  })

  it('should not save a user if an invalid email is provided', async () => {
    const user = new UserModel({
      firstname: 'Jose',
      email: 'josegmail',
      password: 'test-password',
    })
    try {
      await user.save()
    } catch (error) {
      expect(error.message).to.equal(
        'User validation failed: email: josegmail is not a valid email',
      )
    }
  })

  it('should not save a user if no email is provided', async () => {
    const user = new UserModel({
      firstname: 'Jose',
      password: 'test-password',
    })
    try {
      await user.save()
    } catch (error) {
      expect(error.message).to.equal('User validation failed: email: Email is required')
    }
  })

  it('should not save a user if no first name is provided', async () => {
    const user = new UserModel({
      email: 'juan2@gmail.com',
      password: 'test-password',
    })
    try {
      await user.save()
    } catch (error) {
      expect(error.message).to.equal('User validation failed: firstname: First name is required')
    }
  })
})
