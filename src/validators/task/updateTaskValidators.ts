import {
  bodyStatusOptional,
  bodyStringOptional,
  bodyDateOptional,
  paramTaskId,
} from '@src/validators/commonValidators'

const updateTaskValidators = [
  paramTaskId(),
  bodyStringOptional('title'),
  bodyStatusOptional(),
  bodyStringOptional('description'),
  bodyDateOptional('dueDate'),
]

export default updateTaskValidators
