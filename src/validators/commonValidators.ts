import { body, param } from 'express-validator'
import { taskStatus } from '@src/types/types'

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

const bodyStatus = () =>
    body('status')
        .default('pending')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('\'status\' is required')
        .isIn(taskStatus)
        .withMessage('\'status\' must be one of: ' + taskStatus.join(', '))

const bodyDateRequired = (field: string) =>
    body(field)
        .notEmpty()
        .withMessage(`'${field}' is required.`)
        .isISO8601()
        .withMessage(`'${field}' must be a valid ISO8601 date.`)

const paramStringRequired = (field: string) =>
    param(field)
        .notEmpty()
        .withMessage(`'${field}' is required.`)
        .trim()
        .isString()
        .withMessage(`'${field}' must be a string.`)
        .isLength({ min: 24, max: 24 })
        .withMessage(`'${field}' must be a 24 character hex string.`)
        .isHexadecimal()
        .withMessage(`'${field}' must be a hexadecimal string.`)
        .escape()

export
{
  bodyStringOptional,
  bodyStringRequired,
  bodyStatus,
  bodyDateRequired,
  paramStringRequired,
}
