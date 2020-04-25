export const sharedTypes = `
  input PagingParams {
    next: String
    limit: Float
  }
  type PagingMetadata {
    previous: String
    hasPrevious: Boolean
    next: String
    hasNext: Boolean
  }
`
