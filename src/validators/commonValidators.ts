import { body, header, param } from 'express-validator'
import { taskStatus } from '@src/types/types'

const headerAuthorization = () =>
    header('authorization')
        .notEmpty()
        .withMessage(`'authorization' is required.`)
        .trim()
        .isString()
        .withMessage(`'authorization' must be a string.`)
        .custom((value) => {
          return value.split(' ')[0] === 'Bearer'
        })
        .escape()

const bodyEmail = () =>
    body('email')
        .notEmpty()
        .withMessage(`'email' is required.`)
        .trim()
        .isEmail()
        .withMessage(`'email' must be a valid email address.`)
        .normalizeEmail()
        .escape()

const bodyPassword = () =>
    body('password')
        .notEmpty()
        .withMessage(`'password' is required.`)
        .trim()
        .isString()
        .withMessage(`'password' must be a string.`)
        .isLength({ min: 8 })
        .withMessage(`'password' must be at least 8 characters long.`)
        .escape()

const bodyStringOptional = (field: string) =>
    body(field)
        .optional()
        .trim()
        .isString()
        .withMessage(`'${field}' must be a string.`)
        .escape()

const bodyStringRequired = (field: string) =>
    body(field)
        .notEmpty()
        .withMessage(`'${field}' is required.`)
        .trim()
        .isString()
        .withMessage(`'${field}' must be a string.`)
        .escape()

const bodyStatusOptional = () =>
    body('status')
        .optional()
        .isString()
        .trim()
        .isIn(taskStatus)
        .withMessage('\'status\' must be one of: ' + taskStatus.join(', '))
        .escape()

const bodyStatus = () =>
    body('status')
        .default('pending')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('\'status\' is required')
        .isIn(taskStatus)
        .withMessage('\'status\' must be one of: ' + taskStatus.join(', '))

const bodyDateOptional = (field: string) =>
    body(field)
        .optional()
        .isISO8601()
        .withMessage(`'${field}' must be a valid ISO8601 date.`)
        .custom((value) => {
          return new Date(value) > new Date()
        })
        .withMessage(`'${field}' must be in the future.`)

const bodyDateRequired = (field: string) =>
    body(field)
        .notEmpty()
        .withMessage(`'${field}' is required.`)
        .isISO8601()
        .withMessage(`'${field}' must be a valid ISO8601 date.`)
        .custom((value) => {
          return new Date(value) > new Date()
        })
        .withMessage(`'${field}' must be in the future.`)

const paramTaskId = () =>
    param('taskId')
        .notEmpty()
        .withMessage(`'taskId' is required.`)
        .trim()
        .isString()
        .withMessage(`'taskId' must be a string.`)
        .isLength({ min: 24, max: 24 })
        .withMessage(`'taskId' must be a 24 character hex string.`)
        .isHexadecimal()
        .withMessage(`'taskId' must be a hexadecimal string.`)
        .escape()

export
{
  headerAuthorization,
  bodyEmail,
  bodyPassword,
  bodyStringOptional,
  bodyStringRequired,
  bodyStatusOptional,
  bodyStatus,
  bodyDateOptional,
  bodyDateRequired,
  paramTaskId,
}
