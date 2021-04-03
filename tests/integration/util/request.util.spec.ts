import { expect } from 'chai'
import sinon from 'sinon'
import request from 'request'

import '../tests.util'
import { doRequest } from '../../../src/shared'

describe('Request Util', () => {
  afterEach(() => {
    ;(request.get as any).restore()
  })

  it('should do a successful request', async () => {
    sinon.stub(request, 'get').yields(null, { statusCode: 200 }, 'this is google')
    const result = await doRequest('https://www.google.com/')
    expect(result).to.equal('this is google')
  })

  it('should return a resource not found error', async () => {
    sinon.stub(request, 'get').yields(null, { statusCode: 404 }, null)
    try {
      await doRequest('https://www.google.com/')
    } catch (error) {
      expect(error.message).to.equal('Resource not found')
    }
  })

  it('should return generic request error', async () => {
    sinon.stub(request, 'get').yields(new Error('Bad request'), { statusCode: 400 }, null)
    try {
      await doRequest('https://www.google.com/')
    } catch (error) {
      expect(error.message).to.equal('Bad request')
    }
  })
})
