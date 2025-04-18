import { bodyEmail, bodyPassword } from '@src/validators/commonValidators'

const loginValidators = [
  bodyEmail(),
  bodyPassword(),
]

export default loginValidators
