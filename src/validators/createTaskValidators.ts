import { bodyStringOptional, bodyStringRequired, bodyStatus, bodyDateRequired } from '@src/validators/commonValidators'

const createTaskValidators = [
  bodyStringRequired('title'),
  bodyStringOptional('description'),
  bodyStatus(),
  bodyDateRequired('dueDate'),
]

export default createTaskValidators
