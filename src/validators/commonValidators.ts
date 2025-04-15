import { body, param } from 'express-validator'
import { taskStatus } from '@src/types/types'
import * as console from 'node:console'

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
  bodyStringOptional,
  bodyStringRequired,
  bodyStatusOptional,
  bodyStatus,
  bodyDateOptional,
  bodyDateRequired,
  paramTaskId,
}
