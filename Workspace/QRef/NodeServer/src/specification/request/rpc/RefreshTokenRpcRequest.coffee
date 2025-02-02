RpcRequest = require('../../../serialization/RpcRequest')
###
Object sent as the body of an HTTP POST request to renew an existing authentication token.
@note The token property is not required when using this method.
@author Nathan Klick
@copyright QRef 2012
###
class RefreshTokenRpcRequest extends RpcRequest
module.exports = RefreshTokenRpcRequest