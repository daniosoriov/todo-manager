import {
  bodyStatusOptional,
  bodyStringOptional,
  bodyDateOptional,
  paramTaskId, headerAuthorization,
} from '@src/validators/commonValidators'

const updateTaskValidators = [
  headerAuthorization(),
  paramTaskId(),
  bodyStringOptional('title'),
  bodyStatusOptional(),
  bodyStringOptional('description'),
  bodyDateOptional('dueDate'),
]

export default updateTaskValidators
