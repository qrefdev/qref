class RpcResponse
	success: true
	mode: 'rpc'
	message: null
	errorCode: 0
	returnValue: null
	constructor: (returnValue) -> 
		@.reset()
		@returnValue = returnValue
	setMessage: (msg) -> @message = msg
	reset: () ->
		@message = null
		@success = true
		@returnValue = null
		@mode = 'rpc'
		@errorCode = 0
	failure: (reason, errorCode) -> 
		@success = false
		@errorCode = errorCode
		@message = reason
module.exports = RpcResponse