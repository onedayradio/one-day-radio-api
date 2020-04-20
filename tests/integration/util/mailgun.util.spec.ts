import { expect } from 'chai'
import sinon from 'sinon'
import { get } from 'lodash'
import Mailgun from 'mailgun-js'

import * as MailgunUtil from '../../../src/shared/util/mailgun'

const sandbox = sinon.createSandbox()
const mailgunTestValues = {
  apiKey: 'foo',
  domain: 'bar',
}

describe('Mailgun Util', () => {
  beforeEach(() => {
    const MailgunClass = get(Mailgun(mailgunTestValues), 'Mailgun')
    const MailgunClassPrototype = get(MailgunClass, 'prototype')
    sandbox.stub(MailgunClassPrototype, 'messages').returns({
      send: (data: any, cb: any) => cb(undefined, true),
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should send welcome emails', async () => {
    const result = await MailgunUtil.sendWelcomeEmail({
      firstname: 'Juan',
      lastname: 'Morales',
      email: 'test@gmail.com',
    })

    expect(result).to.equal(true)
  })
})
