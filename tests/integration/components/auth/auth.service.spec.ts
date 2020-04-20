import sinon from 'sinon'
import { expect } from 'chai'

import { testsSetup } from '../../tests.util'
import { AuthService } from '../../../../src/components/auth/auth.service'
import { expectedSignUpSocialNewUser, expectedSignUpSocialExistingUser } from '../../snapshots/auth'
import { ids } from '../../fixtures-ids'
import { MailgunUtil } from '../../../../src/shared'

const sandbox = sinon.createSandbox()
const authService = new AuthService()

describe('AuthService', () => {
  beforeEach((done: any) => {
    sandbox.stub(MailgunUtil, 'sendWelcomeEmail').returns(Promise.resolve(true))
    void testsSetup(done)
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should sign up a new user using a social account', async () => {
    const response = await authService.authSocial({
      firstname: 'new firstname',
      lastname: 'new lastname',
      email: 'new@gmail.com',
    })
    expect(response).to.containSubset(expectedSignUpSocialNewUser)
    expect(response.token).not.to.be.undefined
  })

  it('should sign up an existing user using a social account', async () => {
    const response = await authService.authSocial({
      firstname: 'Juan',
      lastname: 'Morales',
      email: 'juan@gmail.com',
    })
    expect(response).to.containSubset(expectedSignUpSocialExistingUser)
    expect(response.token).not.to.be.undefined
  })

  it('should refresh a token', async () => {
    const response = await authService.refreshToken({
      userId: ids.users.juanId,
    })
    expect(response.user._id + '').to.equal(ids.users.juanId + '')
    expect(response.token).not.to.be.undefined
  })
})
