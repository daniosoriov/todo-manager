import { paramStringRequired } from '@src/validators/commonValidators'

const getTaskValidators = [
  paramStringRequired('taskId'),
]

export default getTaskValidators
