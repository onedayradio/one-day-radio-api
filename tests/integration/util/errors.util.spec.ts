import { expect } from 'chai'
import { ApolloError } from 'apollo-server-lambda'

import * as ErrorsUtil from '../../../src/shared/util/errors'

describe('Errors util', () => {
  it('should return formatted error messages', () => {
    const graphError = ErrorsUtil.extractMessageFromError(new ApolloError('a new error'))
    expect(graphError).to.equal('a new error')
  })

  it('should return a ValidationError as a formated error message', () => {
    const validationError = new Error(
      'Validation failed: password: Password must be at least 6 characters long',
    )
    validationError.name = 'ValidationError'
    const graphError = ErrorsUtil.extractMessageFromError(validationError)
    expect(graphError).to.equal('Password must be at least 6 characters long')
  })

  it('should just return a normal error as is', () => {
    const graphError = ErrorsUtil.extractMessageFromError(new Error('a new error'))
    expect(graphError).to.equal('a new error')
  })
})
