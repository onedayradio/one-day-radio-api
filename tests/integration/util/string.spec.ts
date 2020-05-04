import { expect } from 'chai'
import sinon from 'sinon'
import '../tests.util'
import { generateRandomString } from 'src/shared'

const sandbox = sinon.createSandbox()

describe('String Util', () => {
  afterEach(() => {
    sandbox.restore()
  })

  it('should generate a random string', () => {
    sandbox.stub(Buffer.prototype, 'toString').returns('1234567891234567')
    const randomStr = generateRandomString(16)
    expect(randomStr).to.equal('1234567891234567')
  })
})
