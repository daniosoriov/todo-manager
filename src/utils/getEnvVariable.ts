import dotenv from 'dotenv'

dotenv.config()

/**
 * Get the environment variable from the process.env
 * @param key - The key of the environment variable
 */
const getEnvVariable = (key: string): string => {
  const value = process.env[key]
  if (!value) {
    console.error(`${key} is not defined in the environment variables`)
    throw new Error(`${key} is not defined in the environment variables`)
  }
  return value
}

export default getEnvVariable
