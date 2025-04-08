import { paramTaskId } from '@src/validators/commonValidators'

const deleteTaskValidators = [
  paramTaskId(),
]

export default deleteTaskValidators
