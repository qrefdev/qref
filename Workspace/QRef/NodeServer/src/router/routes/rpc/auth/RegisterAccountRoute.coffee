RpcRoute = require('../../../RpcRoute')
RpcResponse = require('../../../../serialization/RpcResponse')
UserAuth = require('../../../../security/UserAuth')
###
Service route that is used to create a new user account.
@example Service Methods (see {RegisterAccountRpcRequest})
  Request Format: application/json
  Response Format: application/json
  
  POST /services/rpc/auth/registerAccount
    @BODY - (Required) RegisterAccountRpcRequest
    
  Creates a new user account with the specified email address and password.
@author Nathan Klick
@copyright QRef 2012
###
class RegisterAccountRoute extends RpcRoute
	constructor: () ->
		super [{ method: 'POST', path: '/registerAccount' }, { method: 'GET', path: '/registerAccount' }]
	post: (req, res) =>
		if not @.isValidRequest(req)
			resp = new RpcResponse(null)
			resp.failure('Bad Request', 400)
			res.json(resp, 200)
			return
			
		UserAuth.createAccount(req.body.userName, req.body.password, (err, success, statusCode) ->
			resp = null
			if err? or not statusCode == 0 
				resp = new RpcResponse(statusCode)
				resp.failure(err, 500)
				res.json(resp, 200)
			else if not success
				resp = new RpcResponse(statusCode)
				resp.failure('Forbidden', 403)
				res.json(resp, 200)
			else 
				resp = new RpcResponse(statusCode) 
				res.json(resp, 200)
		)
	isValidRequest: (req) ->
		if req.body? and req.body?.mode? and req.body.mode == 'rpc' and req.body?.userName? and req.body?.password?
			true
		else
			false 
	
module.exports = new RegisterAccountRoute()