import { expect } from 'vitest'

interface CustomError {
  path: string
  location: string
}

/**
 * Check if the response contains an error from express-validator for a specific field
 * @param response - The response object from the request
 * @param field - The field to check for errors
 */
const expectExpressValidatorError = (response: any, field: string) => {
  expect(response).toHaveProperty('body')
  expect(response.body).not.toBeNull()
  expect(response.body).toHaveProperty('errors')
  const found = response.body.errors.some((error: CustomError) => error.path === field && error.location === 'body')
  expect(found).toBe(true)
}

export default expectExpressValidatorError
