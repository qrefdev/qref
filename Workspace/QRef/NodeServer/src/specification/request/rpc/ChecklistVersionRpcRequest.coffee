RpcRequest = require('../../../serialization/RpcRequest')
###
Object sent as the body of an HTTP POST request to perform user authentication.
@author Nathan Klick
@copyright QRef 2012
###
class ChecklistVersionRpcRequest extends RpcRequest
	###
	@property [ObjectId] Required - The ID of the manufacturer for which for acquire the version information.
	###
	manufacturer: null
	###
	@property [ObjectId] Required - The ID of the model for which to acquire the version information.
	###
	model: null
module.exports = exports = ChecklistVersionRpcRequest
