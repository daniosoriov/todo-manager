import { bodyStringRequired } from '@src/validators/commonValidators'

const refreshTokenValidators = [
  bodyStringRequired('token'),
]

export default refreshTokenValidators
