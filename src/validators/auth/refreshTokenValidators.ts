import { bodyStringRequired, headerAuthorization } from '@src/validators/commonValidators'

const refreshTokenValidators = [
  headerAuthorization(),
  bodyStringRequired('token'),
]

export default refreshTokenValidators
