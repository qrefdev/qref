AjaxRoute = require('../../../AjaxRoute')
AjaxResponse = require('../../../../serialization/AjaxResponse')
UserAuth = require('../../../../security/UserAuth')
QRefDatabase = require('../../../../db/QRefDatabase')
###
Service route that allows the retrieval of all models and the creation of new models.
@example Service Methods (see {CreateAircraftModelAjaxRequest})
  Request Format: application/json
  Response Format: application/json
  
  GET /services/ajax/aircraft/manufacturers?token=:token
    :token - (Required) A valid authentication token.
    
  Retrieves all models.
  
  POST /services/ajax/aircraft/manufacturers
  	@BODY - (Required) CreateAircraftManufacturerAjaxRequest
  	
  Creates a new aircraft model.
@author Nathan Klick
@copyright QRef 2012
###
class AircraftModelsRoute extends AjaxRoute
	constructor: () ->
		super [{ method: 'POST', path: '/models' }, { method: 'GET', path: '/models' }]
	get: (req, res) =>
		if not @.isValidRequest(req)
			resp = new AjaxResponse()
			resp.failure('Bad Request', 400)
			res.json(resp, 200)
			return
		
		db = QRefDatabase.instance()
		token = req.param('token')
		
		UserAuth.validateToken(token, (err, isTokenValid) ->
			if err? or not isTokenValid == true
				resp = new AjaxResponse()
				resp.failure('Not Authorized', 403)
				res.json(resp, 200)
				return
			
			query = db.AircraftModel.find()
		
			if req.query?.pageSize? and req.query?.page?
				query = query.skip(req.query.page * req.query.pageSize).limit(req.query.pageSize)
			else if req.query?.pageSize? and not req.query?.page?
				query = query.limit(req.query.pageSize)
			else if not req.query?.pageSize? and req.query?.page?
				query = query.skip(req.query.page * 25).limit(25)
			
			query.exec((err, arrObjs) ->
				if err?
					resp = new AjaxResponse()
					resp.failure('Internal Error', 500)
					res.json(resp, 200)
					return
					
				db.AircraftModel.count((err, count) ->
					if err?
						resp = new AjaxResponse()
						resp.failure('Internal Error', 500)
						res.json(resp, 200)
						return
					
					resp = new AjaxResponse()
					resp.addRecords(arrObjs)
					resp.setTotal(count)
					res.json(resp, 200)
				)
				
			)
		)
	post: (req, res) =>
		if not @.isValidRequest(req)
			resp = new AjaxResponse()
			resp.failure('Bad Request', 400)
			res.json(resp, 200)
			return
		
		db = QRefDatabase.instance()
		token = req.param('token')
		
		UserAuth.validateToken(token, (err, isTokenValid) ->
			if err? or not isTokenValid == true
				resp = new AjaxResponse()
				resp.failure('Not Authorized', 403)
				res.json(resp, 200)
				return
				
			# Validate Permissions Here
			db.AircraftManufacturer.findById(req.body.manufacturer, (err, mfr) ->
			
				if err?
					resp = new AjaxResponse()
					resp.failure(err, 500)
					res.json(resp, 200)
					return
					
				if not mfr?
					resp = new AjaxResponse()
					resp.failure('Not Found', 404)
					res.json(resp, 200)
					return
				
				newObj = new db.AircraftModel()
				newObj.name = req.body.name
				newObj.manufacturer = mfr._id
				newObj.modelYear = req.body.modelYear
				
				if req.body?.description?
					newObj.description = req.body.description
				
				newObj.save((err) ->
					if err?
						resp = new AjaxResponse()
						resp.failure(err, 500)
						res.json(resp, 200)
						return
					
					mfr.models.push(newObj)
					mfr.save((err) ->
						if err?
							resp = new AjaxResponse()
							resp.failure(err, 500)
							res.json(resp, 200)
							return
						
						resp = new AjaxResponse()
						resp.setTotal(1)
						resp.addRecord(newObj)
						res.json(resp, 200)
					)
					
				)
			)
		)
		

	isValidRequest: (req) ->
		if (req.query? and req.query?.token?) or
			 (req.body? and req.body?.token? and req.body?.name? and req.body?.manufacturer? and req.body?.modelYear? and req.body?.mode? and req.body.mode == 'ajax')
			true
		else
			false 
	
module.exports = new AircraftModelsRoute()