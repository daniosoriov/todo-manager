import { headerAuthorization, paramTaskId } from '@src/validators/commonValidators'

const deleteTaskValidators = [
  headerAuthorization(),
  paramTaskId(),
]

export default deleteTaskValidators
