import { expect } from 'chai'

import { generateToken, validateToken, getTokenData } from '../../../src/shared'
import { DecodedToken } from '../../../src/types'
import { testsSetup } from '../tests.util'

const testUser = {
  _id: '1',
  firstname: 'Juan Carlos',
  lastname: 'Morales',
  email: 'juan@gmail.com',
}

describe('AuthUtil', () => {
  beforeEach((done: any) => {
    void testsSetup(done)
  })

  it('should decode valid tokens', async () => {
    const token = await generateToken(testUser._id)
    const decodedToken = await validateToken(`bearer ${token}`)
    expect(decodedToken.userId).to.equal(testUser._id)
  })

  it('should decode valid tokens when passing no userRoles', async () => {
    const token = await generateToken(testUser._id)
    expect(token).not.to.be.undefined
  })

  it('should throw error if token is not provided', async () => {
    try {
      await validateToken()
    } catch (error) {
      expect(error.message).to.equal('Unauthorized!!')
    }
  })

  it('should throw error if token is not a bearer token', async () => {
    try {
      await validateToken('not a bearer token')
    } catch (error) {
      expect(error.message).to.equal('Unauthorized!!')
    }
  })

  it('should throw error if an invalid token is provided', async () => {
    try {
      await validateToken('bearer a bad token')
    } catch (error) {
      expect(error.message).to.equal('Unauthorized!!')
    }
  })

  it('should return null if invalid token is provided', async () => {
    const decodedToken = await getTokenData('bearer a bad token')
    expect(decodedToken).to.equal(undefined)
  })

  it('should return tokenData if valid token is provided', async () => {
    const token = await generateToken(testUser._id)
    const decodedToken = (await getTokenData(`bearer ${token}`)) as DecodedToken
    expect(decodedToken.userId).to.equal(testUser._id)
  })
})
