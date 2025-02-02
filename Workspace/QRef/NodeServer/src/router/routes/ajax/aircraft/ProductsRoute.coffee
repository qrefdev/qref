AjaxRoute = require('../../../AjaxRoute')
AjaxResponse = require('../../../../serialization/AjaxResponse')
UserAuth = require('../../../../security/UserAuth')
QRefDatabase = require('../../../../db/QRefDatabase')
ProductManager = require('../../../../db/manager/ProductManager')
###
Service route that allows the retrieval of all checklists and the creation of new checklists.
@example Service Methods (see {CreateAircraftProductAjaxRequest})
  Request Format: application/json
  Response Format: application/json
  
  
  GET /services/ajax/aircraft/products?token=:token
    :token - (Required) A valid authentication token.
    
  Retrieves all products.
  
  POST /services/ajax/aircraft/products
  	@BODY - (Required) CreateAircraftProductAjaxRequest
  	
  Creates a new product.
@author Nathan Klick
@copyright QRef 2012
###
class ProductsRoute extends AjaxRoute
	constructor: () ->
		super [{ method: 'POST', path: '/products' }, { method: 'GET', path: '/products' }]
	get: (req, res) =>
		if not @.isValidRequest(req)
			resp = new AjaxResponse()
			resp.failure('Bad Request', 400)
			res.json(resp, 200)
			return
		
		db = QRefDatabase.instance()
		token = req.param('token')
		mgr = new ProductManager()
		
		UserAuth.validateToken(token, (err, isTokenValid) ->
			if err? or not isTokenValid == true
				resp = new AjaxResponse()
				resp.failure('Not Authorized', 403)
				res.json(resp, 200)
				return
			
			query = db.Product.find()
			query = query.where('productCategory').equals('aviation')
			
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
					
				db.Product.where('productCategory')
							.equals('aviation')
							.count((err, count) ->
					if err?
						resp = new AjaxResponse()
						resp.failure('Internal Error', 500)
						res.json(resp, 200)
						return
					
					mgr.expandAll(arrObjs, (err, arrProducts) ->
						if err?
							resp = new AjaxResponse()
							resp.failure('Internal Error', 500)
							res.json(resp, 200)
							return
						resp = new AjaxResponse()
						resp.addRecords(arrProducts)
						resp.setTotal(count)
						res.json(resp, 200)
					)
					
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
			
			newObj = new db.Product()
			newObj.name = req.body.name
			newObj.productType = req.body.productType
			newObj.manufacturer = req.body.manufacturer
			newObj.model = req.body.model
			
			if req.body?.productCategory?
				newObj.productCategory = req.body.productCategory
			else
				newObj.productCategory = 'aviation'
			
			if req.body?.isPublished?
				newObj.isPublished = req.body.isPublished
			
			if req.body?.appleProductIdentifier?
				newObj.appleProductIdentifier = req.body.appleProductIdentifier
			
			if req.body?.androidProductIdentifier?
				newObj.androidProductIdentifier = req.body.androidProductIdentifier
				
			if req.body?.isAppleEnabled?
				newObj.isAppleEnabled = req.body.isAppleEnabled
			
			if req.body?.isAndroidEnabled?
				newObj.isAndroidEnabled = req.body.isAndroidEnabled
			
			if req.body?.suggestedRetailPrice?
				newObj.suggestedRetailPrice = req.body.suggestedRetailPrice
			
			if req.body?.aircraftChecklist?
				newObj.aircraftChecklist = req.body.aircraftChecklist
			
			if req.body?.serialNumber?
				newObj.serialNumber = req.body.serialNumber
			
			if req.body?.coverImage?
				newObj.coverImage = req.body.coverImage
				
			if req.body?.productIcon?
				newObj.productIcon = req.body.productIcon
			
			if req.body?.isSampleProduct?
				newObj.isSampleProduct = req.body.isSampleProduct
			else 
				newObj.isSampleProduct = false
			
			if req.body?.description?
				newObj.description = req.body.description
			
			newObj.save((err) ->
				if err?
					resp = new AjaxResponse()
					resp.failure(err, 500)
					res.json(resp, 200)
					return
					
				resp = new AjaxResponse()
				resp.addRecord(newObj)
				resp.setTotal(1)
				res.json(resp, 200)
			)
		
			
		)
		

	isValidRequest: (req) ->
		if (req.query? and req.query?.token?) or
			 (req.body? and req.body?.token? and req.body?.name? and 
			 req.body?.productType? and req.body?.mode? and
			 req.body?.manufacturer? and req.body?.model? and
			 req.body.mode == 'ajax')
			true
		else
			false 
	
module.exports = new ProductsRoute()