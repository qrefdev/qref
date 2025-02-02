RpcRoute = require('../../../RpcRoute')
QRefDatabase = require('../../../../db/QRefDatabase')
RpcResponse = require('../../../../serialization/RpcResponse')
UserAuth = require('../../../../security/UserAuth')
https = require('https')
async = require('async')
###
Service route that performs authentication of Apple IAP Requests.
@example Service Methods (see {AuthorizeAppleProductRequest})
  Request Format: application/json
  Response Format: application/json
  
  POST /services/rpc/aircraft/product/authorize/apple
    @BODY - (Required) AuthorizeAppleProductRpcRequest
    
  Performs apple IAP authorization and returns the handle to the user specific checklist if successful.
@author Nathan Klick
@copyright QRef 2012
###
class AuthorizeAppleAircraftProductRoute extends RpcRoute
	constructor: () ->
		super [{ method: 'POST', path: '/product/authorize/apple' }, { method: 'GET', path: '/product/authorize/apple' }]
	post: (req, res) =>
		if not @.isValidRequest(req)
			resp = new RpcResponse(null)
			resp.failure('Bad Request', 400)
			res.json(resp, 200)
			return
		
		console.log('INFO: AppleRoute.post() - New request received. Going to validate the token.')
		token = req.param('token')
		productId = req.body.product
		db = QRefDatabase.instance()
		receiptData = req.body.receipt
		
		tailNumber = null
		
		if req.body?.tailNumber?
			tailNumber = req.body.tailNumber
		
		console.log('INFO: AppleRoute.post() - Body Parsed. { productId: "' + productId + '", token: "' + token + '", receiptData: "' + receiptData + '" }')
		
		UserAuth.validateToken(token, (err, isTokenValid) =>
			if err? or not isTokenValid == true
				console.log('INFO: AppleRoute.post() - Invalid token. Rejecting the request.')
				resp = new RpcResponse(null)
				resp.failure('Not Authorized', 403)
				res.json(resp, 200)
				return
				
			console.log('INFO: AppleRoute.post() - Token is valid. Going to get the user from the token.')
			UserAuth.userFromToken(token, (err, user) => 
				if err? or not user?
					console.log('INFO: AppleRoute.post() - Could not get the User from the token. Rejecting the request.')
					resp = new RpcResponse(null)
					resp.failure('Not Authorized', 403)
					res.json(resp, 200)
					return
					
				console.log('INFO: AppleRoute.post() - Got a valid user. Going to get the product.')
				db.Product.findOne({ _id: productId })
						.populate('aircraftChecklist')
						.exec((err, product) =>
					if err?
						console.log('INFO: AppleRoute.post() - Product lookup failed with an error. Rejecting the request.')
						console.log('INFO: AppleRoute.post() - ' + err.toString())
						resp = new RpcResponse(null)
						resp.failure('Internal Error', 500)
						res.json(resp, 200)
						return
					
					if not product?
						console.log('INFO: AppleRoute.post() - Product not found. Rejecting the request.')
						resp = new RpcResponse(null)
						resp.failure('Product Not Found', 404)
						res.json(resp, 200)
						return
						
					#console.log('INFO: AppleRoute.post() - Product is valid. Going to record an authorization attempt. { product: ' + JSON.stringify(product) + ' }')
					console.log('INFO: AppleRoute.post() - { product._id: ' + product._id.toString() + ' }')
					attempt = new db.AircraftProductAuthorizationAttempt()
					attempt.user = user._id
					attempt.product = product._id
					attempt.attemptType = 'apple'
					attempt.appleReceiptHash = receiptData
					
					attempt.save((err) => 
						
						if err?
							console.log('INFO: AppleRoute.post() - Attempt save failed due to error. Rejecting the request.')
							console.log('INFO: AppleRoute.post() - ' + err.toString())
							resp = new RpcResponse(null)
							resp.failure('Internal Error', 500)
							res.json(resp, 200)
							return
						
						console.log('INFO: AppleRoute.post() - Attempt saved initially. Going to validate the receipt with apple.')
						@.validateReceipt(token, receiptData, (err, receipt) =>
							if err?
								console.log('INFO: AppleRoute.post() - Receipt validation failed due to error. Rejecting the request.')
								console.log('INFO: AppleRoute.post() - ' + err.toString())
								resp = new RpcResponse(null)
								resp.failure('Internal Error', 500)
								res.json(resp, 200)
								return
								
							if not receipt?
								console.log('INFO: AppleRoute.post() - Failed to validate the receipt with apple. Rejecting the request.')
								resp = new RpcResponse(null)
								resp.failure('Internal Error', 500)
								res.json(resp, 200)
								return
							
							console.log('INFO: AppleRoute.post() - Receipt validation response received. { status: ' + receipt.status + ' }')
							attempt.appleReceipt = receipt
								
							if receipt.status == 0 and receipt.receipt.product_id == product.appleProductIdentifier
								attempt.isReceiptValid = true
								
								console.log('INFO: AppleRoute.post() - Receipt is valid per apple\'s response. Going to update the attempt.')
								attempt.save((err) =>
									if err?
										console.log('INFO: AppleRoute.post() - Failed to update the attempt due to errors. Rejecting the request.')
										console.log('INFO: AppleRoute.post() - ' + err.toString())
										resp.failure('Internal Error', 500)
										res.json(resp, 200)
										return
									
									console.log('INFO: AppleRoute.post() - Attempt updated successfully. Going to install the UserProduct record.')
									uProduct = new db.UserProduct()
									uProduct.user = user._id
									uProduct.product = product._id
									
									uProduct.save((err) => 
										if err? and not err.code == 11000
											console.log('INFO: AppleRoute.post() - Failed to install the UserProduct record due to errors. Rejecting the request.')
											console.log('INFO: AppleRoute.post() - ' + err.toString())
											console.log('INFO: AppleRoute.post() - ' + JSON.stringify(err))
											resp = new RpcResponse(null)
											resp.failure('Internal Error', 500)
											res.json(resp, 200)
											return
											
										console.log('INFO: AppleRoute.post() - UserProduct record installed. Going to clone the checklist.')
										@.cloneChecklist(product.aircraftChecklist, product, user, tailNumber, (err, checklistId) =>
											if err?
												console.log('INFO: AppleRoute.post() - Failed to clone the checklist due to errors. Rejecting the request.')
												console.log('INFO: AppleRoute.post() - ' + err.toString())
												resp = new RpcResponse(null)
												resp.failure('Internal Error', 500)
												res.json(resp, 200)
												return
											
											console.log('INFO: AppleRoute.post() - Checklist was cloned. Going to update the attempt.')
											attempt.isComplete = true
											attempt.checklist = checklistId
											
											attempt.save((err) =>
												if err?
													console.log('INFO: AppleRoute.post() - Failed to update the attempt due to errors. Rejecting the request.')
													console.log('INFO: AppleRoute.post() - ' + err.toString())
													resp = new RpcResponse(null)
													resp.failure('Internal Error', 500)
													res.json(resp, 200)
													return	
												
												console.log('INFO: AppleRoute.post() - Attempt updated successfully. Request is complete. Returning success.')
												resp = new RpcResponse(checklistId)
												res.json(resp, 200)
												return
											)
										)
									)
									
								)
							else
								console.log('INFO: AppleRoute.post() - Receipt is invalid per apple\'s response. Going to update the attempt.')
								attempt.isReceiptValid = false
								
								attempt.save((err) =>
									if err?
										console.log('INFO: AppleRoute.post() - Failed to update the attempt record. Rejecting the request.')
										console.log('INFO: AppleRoute.post() - ' + err.toString())
										resp = new RpcResponse(null)
										resp.failure('Internal Error', 500)
										res.json(resp, 200)
										return

									console.log('INFO: AppleRoute.post() - Attempt updated successfully. Rejecting the request per apple\'s response.')										
									resp = new RpcResponse(null)
									resp.failure('Invalid Receipt', 403)
									res.json(resp, 200)
									return
								)
							
						)
					)
					
				)
			)
		)
	cloneChecklist: (oChecklist, product, user, tailNumber, callback) ->
		db = QRefDatabase.instance()
		nChecklist = new db.AircraftChecklist()
		
		if not oChecklist?
			callback(new Error('Product does not have an associated checklist.'), null)
			return
		
		nChecklist.model = oChecklist.model
		nChecklist.manufacturer = oChecklist.manufacturer
		nChecklist.index = null
		
		if tailNumber?
			nChecklist.tailNumber = tailNumber
		else
			nChecklist.tailNumber = null
		
		nChecklist.user = user._id
		nChecklist.version = 1
		nChecklist.productIcon = product.productIcon
		nChecklist.preflight = oChecklist.preflight
		nChecklist.takeoff = oChecklist.takeoff
		nChecklist.landing = oChecklist.landing
		nChecklist.emergencies = oChecklist.emergencies
		nChecklist.isDeleted = false
		nChecklist.currentSerialNumber = oChecklist.currentSerialNumber
		nChecklist.knownSerialNumbers = oChecklist.knownSerialNumbers
		nChecklist.lastCheckpointSerialNumber = oChecklist.lastCheckpointSerialNumber
		
		nChecklist.save((err) -> 
			if err?
				callback(err, null)
				return
			callback(null, nChecklist._id)
		)
	validateReceipt: (token, receiptData, callback) ->
	
		options =
			hostname: "buy.itunes.apple.com"
			port: 443
			path: "/verifyReceipt"
			method: "POST"
	
			
		request =
			"receipt-data": receiptData
		
		requestData = JSON.stringify(request)
		
		data = ""
		
		req = https.request(options, (res) -> 
			res.setEncoding('ascii')
			
			res.on('data', (buff) ->
				data += buff
			)
			
			res.on('end', () ->
				if data? 
					response = JSON.parse(data)
					
					if not response?
						callback(new Error('Invalid JSON data received from server.'), null)
					else
						if response.status == 21007
							options = 
								hostname: "sandbox.itunes.apple.com"
								port: 443
								path: "/verifyReceipt"
								method: "POST"
								
							data = ""
							
							req = https.request(options, (res) ->
								res.setEncoding('ascii')
								
								res.on('data', (buff) ->
									data += buff
								)
								
								res.on('end', () ->
									if data?
										response = JSON.parse(data)
										
										if not response?
											callback(new Error('Invalid JSON data received from server.'), null)
										else
											callback(null, response)
								)
							)
								
							req.on('error', (err) ->
								callback(err, null)
							)
							
							req.write(requestData)
							req.end()
						else
							callback(null, response)
			)
		)
			
		req.on('error', (err) ->
			callback(err, null)
		)
		
		req.write(requestData)
		req.end()
		
		
	isValidRequest: (req) ->
		if req.body? and req.body?.mode? and req.body.mode == 'rpc' and req.body?.product? and req.body?.receipt?
			true
		else
			false
module.exports = new AuthorizeAppleAircraftProductRoute()