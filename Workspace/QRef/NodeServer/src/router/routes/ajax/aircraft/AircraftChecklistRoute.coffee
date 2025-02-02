AjaxRoute = require('../../../AjaxRoute')
AjaxResponse = require('../../../../serialization/AjaxResponse')
UserAuth = require('../../../../security/UserAuth')
QRefDatabase = require('../../../../db/QRefDatabase')
ChecklistManager = require('../../../../db/manager/ChecklistManager')
AircraftChecklistFilter = require('../../../../security/filters/AircraftChecklistFilter')
###
Service route that allows the retrieval and updation of an individual checklist.
@example Service Methods (see {UpdateAircraftChecklistAjaxRequest})
  Request Format: application/json
  Response Format: application/json

  GET /services/ajax/aircraft/checklist/:checklistId
    :checklistId - (Required) The ID of the checklist you wish to retrieve
    
    This method retrieves an individual checklist.
    
  POST /services/ajax/aircraft/checklist/:checklistId
  	:checklistId - (Required) The ID of the checklist you wish to update
  	@BODY - (Required) UpdateAircraftChecklistAjaxRequest
  	
  	This method performs an update on a single checklist.
@author Nathan Klick
@copyright QRef 2012
###
class AircraftChecklistRoute extends AjaxRoute
	constructor: () ->
		super [{ method: 'POST', path: '/checklist/:checklistId' }, { method: 'GET', path: '/checklist/:checklistId' }]
	get: (req, res) =>
		if not @.isValidRequest(req)
			resp = new AjaxResponse()
			resp.failure('Bad Request', 400)
			res.json(resp, 200)
			return
		
		db = QRefDatabase.instance()
		mgr = new ChecklistManager()
		token = req.param('token')
		checklistId = req.params.checklistId
		filter = new AircraftChecklistFilter(token)
		
		UserAuth.validateToken(token, (err, isTokenValid) ->
			if err? or not isTokenValid == true
				resp = new AjaxResponse()
				resp.failure('Not Authorized', 403)
				res.json(resp, 200)
				return
			
			# Validate Permissions Here
			
			query = db.AircraftChecklist.findById(checklistId) 
		
			query.exec((err, obj) ->
				if err?
					resp = new AjaxResponse()
					resp.failure('Internal Error', 500)
					res.json(resp, 200)
					return
					
				if obj?
					filter.retrieve(obj, (err, isAllowed, record) ->
						if err?
							resp = new AjaxResponse()
							resp.failure('Internal Error', 500)
							res.json(resp, 200)
							return
						
						if not isAllowed
							resp = new AjaxResponse()
							resp.failure('Not Authorized', 403)
							res.json(resp, 200)
							return
							
						mgr.expand(obj, (err1, item) ->
							if err1?
								resp = new AjaxResponse()
								resp.failure('Internal Error', 500)
								res.json(resp, 200)
								return
								
							resp = new AjaxResponse()
							resp.addRecord(item)
							resp.setTotal(1)
							res.json(resp, 200)
							return
						)
					)
					
				else
					resp = new AjaxResponse()
					resp.failure('Not Found', 404)
					res.json(resp, 200)
				
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
		checklistId = req.params.checklistId
		filter = new AircraftChecklistFilter(token)
		mgr = new ChecklistManager()
		
		UserAuth.validateToken(token, (err, isTokenValid) ->
			if err? or not isTokenValid == true
				resp = new AjaxResponse()
				resp.failure('Not Authorized', 403)
				res.json(resp, 200)
				return
				
			# Validate Permissions Here
			
			query = db.AircraftChecklist.findById(checklistId)
			
			query.exec((err, obj) ->
				if err?
					resp = new AjaxResponse()
					resp.failure(err, 500)
					res.json(resp, 200)
					return
				
				if not obj?
					resp = new AjaxResponse()
					resp.failure('Not Found', 404)
					res.json(resp, 200)
					return
					
				filter.update(obj, (err, isAllowed, record) ->
					if err?
						resp = new AjaxResponse()
						resp.failure(err, 500)
						res.json(resp, 200)
						return
						
					if not isAllowed
						resp = new AjaxResponse()
						resp.failure('Not Authorized', 403)
						res.json(resp, 200)
						return
						
					obj.manufacturer = req.body.manufacturer
					obj.model = req.body.model
					obj.preflight = req.body.preflight
					obj.takeoff = req.body.takeoff
					obj.landing = req.body.landing
					obj.emergencies = req.body.emergencies
					#obj.modelYear = req.body.modelYear
					
					if req.body?.tailNumber?
						obj.tailNumber = req.body.tailNumber
					
					if req.body?.version?
						obj.version = req.body.version
						
					if req.body?.index?
						obj.index = req.body.index
					
					if req.body?.productIcon?
						obj.productIcon = req.body.productIcon
	
					
					#if req.body?.coverImage?
					#	obj.coverImage = req.body.coverImage
			
					if req.body?.isDeleted?
						obj.isDeleted = req.body.isDeleted
					
					if req.body.clientTime?
						if req.body.clientTime < obj.currentSerialNumber
							acceptedSerialNumber = null
						else
							acceptedSerialNumber = req.body.clientTime
						
						
						if not acceptedSerialNumber?
							resp = new AjaxResponse()
							resp.failure('Serial Number Out-of-Sync', 403)
							res.json(resp, 200)
							return
						
						if req.body.deviceName?
							deviceName = req.body.deviceName
						else
							deviceName = "UNKNOWN"
						
						mgr.recordUpdatedSerialNumber(obj, acceptedSerialNumber, deviceName)
						
						obj.save((err) ->
							if err?
								resp = new AjaxResponse()
								resp.failure(err, 500)
								res.json(resp, 200)
								return
							
							debugger
							resp = new AjaxResponse()
							#resp.addRecord(obj)
							#resp.setTotal(1)
							res.json(resp, 200)
						)
					else
					
					
						obj.save((err) ->
							if err?
								resp = new AjaxResponse()
								resp.failure(err, 500)
								res.json(resp, 200)
								return
							
							resp = new AjaxResponse()
							#resp.addRecord(obj)
							#resp.setTotal(1)
							res.json(resp, 200)
						)
				) 
				
			)
			
		)
		

	isValidRequest: (req) ->
		if (req.query? and req.query?.token? and req.params? and req.params?.checklistId?) or
			  (req.body? and req.body?.token? and req.params? and req.params?.checklistId? and req.body?.model? and  
			 	req.body?.manufacturer? and req.body?.preflight? and req.body?.takeoff? and
			 	req.body?.landing? and req.body?.emergencies? and
			 	req.body?.mode? and req.body.mode == 'ajax')
			true
		else
			false 
	
module.exports = new AircraftChecklistRoute()