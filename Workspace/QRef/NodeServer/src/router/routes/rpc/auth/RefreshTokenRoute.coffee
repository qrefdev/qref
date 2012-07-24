RpcRoute = require('../../../RpcRoute')
RpcResponse = require('../../../../serialization/RpcResponse')
UserAuth = require('../../../../security/UserAuth')
class RefreshTokenRoute extends RpcRoute
	constructor: () ->
		super [{ method: 'POST', path: '/refreshToken' }, { method: 'GET', path: '/refreshToken' }]
	post: (req, res) =>
		if not @.isValidRequest(req)
			resp = new RpcResponse(null)
			resp.failure('Bad Request', 400)
			res.json(resp, 200)
			return
			
		UserAuth.refreshToken(req.body.token, (err, success) ->
			resp = null
			if err? 
				resp = new RpcResponse(null)
				resp.failure(err, 500)
				res.json(resp, 200)
			else if not success
				resp = new RpcResponse(null)
				resp.failure('Forbidden', 403)
				res.json(resp, 200)
			else 
				resp = new RpcResponse(req.body.token) 
				res.json(resp, 200)
		)
	isValidRequest: (req) ->
		if req.body? and req.body?.mode? and req.body.mode == 'rpc' and req.body?.token?
			true
		else
			false 
	
module.exports = new RefreshTokenRoute()