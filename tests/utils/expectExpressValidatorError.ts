import { expect } from 'vitest'

type Location = 'body' | 'params' | 'query' | 'headers'

interface CustomError {
  path: string
  location: Location
}

/**
 * Check if the response contains an error from express-validator for a specific field
 * @param response - The response object from the request
 * @param field - The field to check for errors
 * @param location - The location of the field (default is 'body')
 */
const expectExpressValidatorError = (response: any, field: string, location: Location = 'body') => {
  expect(response).toHaveProperty('body')
  expect(response.body).not.toBeNull()
  expect(response.body).toHaveProperty('errors')
  const found = response.body.errors.some((error: CustomError) => error.path === field && error.location === location)
  expect(found).toBe(true)
}

export default expectExpressValidatorError
