import { paramTaskId } from '@src/validators/commonValidators'

const getTaskValidators = [
  paramTaskId(),
]

export default getTaskValidators
