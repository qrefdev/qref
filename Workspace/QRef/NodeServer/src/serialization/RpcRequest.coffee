###
Base class for all Remote Procedure Call (RPC) requests. The token field is optional by default. 
The token field is required by certain methods and each method will dictate whether or not this field is required.   
@author Nathan Klick
@copyright QRef 2012
@abstract
###
class RpcRequest
	###
	@property [String] (Required) The type of request. Should always be "rpc".
	###
	mode: "rpc"
	###
	@property [String] (Optional) The authentication token to include with the request.
	###
	token: null
	###
	Initializes a new RpcRequest object with the provided authentication token and defaults the mode property to 'rpc'.
	@param token [String] The authentication token to include in the request.
	###
	constructor: (token) -> 
		@mode = "rpc"
		@token = token
	 