import { headerAuthorization, paramTaskId } from '@src/validators/commonValidators'

const getTaskValidators = [
  headerAuthorization(),
  paramTaskId(),
]

export default getTaskValidators
