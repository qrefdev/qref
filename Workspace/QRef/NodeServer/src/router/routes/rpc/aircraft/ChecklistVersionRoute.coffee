RpcRoute = require('../../../RpcRoute')
QRefDatabase = require('../../../../db/QRefDatabase')
RpcResponse = require('../../../../serialization/RpcResponse')
UserAuth = require('../../../../security/UserAuth')
https = require('https')
async = require('async')
###
Service route that returns the next available version of a given checklist.
@example Service Methods (see {ChecklistVersionRpcRequest})
  Request Format: application/json
  Response Format: application/json
  
  POST /services/rpc/aircraft/checklist/version
    @BODY - (Required) ChecklistVersionRpcRequest
    
	Returns the next available version number in the returnValue field of the response object.
@author Nathan Klick
@copyright QRef 2012
###
class ChecklistVersionRoute extends RpcRoute
	constructor: () ->
		super [{ method: 'POST', path: '/checklist/version' }, { method: 'GET', path: '/checklist/version' }]
	post: (req, res) =>
		if not @.isValidRequest(req)
			resp = new RpcResponse(null)
			resp.failure('Bad Request', 400)
			res.json(resp, 200)
			return
		
		manufacturerId = req.body.manufacturer
		modelId = req.body.model
		
		db = QRefDatabase.instance()
		
		db.AircraftManufacturer.findById(manufacturerId, (err, mfr) -> 
			if err?
				resp = new RpcResponse(null)
				resp.failure('Internal Error', 500)
				res.json(resp, 200)
				return
			
			if not mfr?
				resp = new RpcResponse(null)
				resp.failure('Manufacturer Not Found', 404)
				res.json(resp, 200)
				return
				
			db.AircraftModel.findOne()
				.where('_id')
				.equals(modelId)
				.where('manufacturer')
				.equals(mfr._id)
				.exec((err, mdl) -> 
					if err?
						resp = new RpcResponse(null)
						resp.failure('Internal Error', 500)
						res.json(resp, 200)
						return
					
					if not mdl?
						resp = new RpcResponse(null)
						resp.failure('Model Not Found', 404)
						res.json(resp, 200)
						return
						
					db.AircraftChecklist.findOne()
						.where('model')
						.equals(mdl._id)
						.where('manufacturer')
						.equals(mfr._id)
						.where('user')
						.equals(null)
						.sort('-version')
						.exec((err, record) ->
							if err?
								resp = new RpcResponse(null)
								resp.failure('Internal Error', 500)
								res.json(resp, 200)
								return
								
							if not record?
								resp = new RpcResponse(1)
								res.json(resp, 200)
								return
							
							resp = new RpcResponse(record.version + 1)
							res.json(resp, 200)
					)
				)
		)
	
	isValidRequest: (req) ->
		if req.body? and req.body?.mode? and req.body.mode == 'rpc' and req.body?.manufacturer? and req.body?.model?
			true
		else
			false
module.exports = new ChecklistVersionRoute()