import {
  bodyStringOptional,
  bodyStringRequired,
  bodyStatus,
  bodyDateRequired,
  headerAuthorization,
} from '@src/validators/commonValidators'

const createTaskValidators = [
  headerAuthorization(),
  bodyStringRequired('title'),
  bodyStringOptional('description'),
  bodyStatus(),
  bodyDateRequired('dueDate'),
]

export default createTaskValidators
