export const extractMessageFromError = (error: Error): string => {
  if (error.name === 'ValidationError') {
    const message = error.message.substring(
      error.message.lastIndexOf(':') + 2,
      error.message.length,
    )
    return message
  }
  return error.message
}
