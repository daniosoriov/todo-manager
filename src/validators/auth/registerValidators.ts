import { bodyEmail, bodyPassword } from '@src/validators/commonValidators'

const registerValidators = [
  bodyEmail(),
  bodyPassword(),
]

export default registerValidators
