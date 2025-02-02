###
The response object returned for all RESTful requests. 
This response object supports pagination and returning the total available records using the {#setTotal} method.

@example Reporting a Failure
  response = new RestfulResponse()
  response.failure('Some failure reason', 500)
	
@example Returning Data [Single Object]
  response = new RestfulResponse()
  response.addRecord(someObj)
  response.setTotal(1)

@example Returning Data [Array of Objects]
  response = new RestfulResponse()
  response.addRecords(someArray)
  response.setTotal(someCount)

@example Reset to Default
  response = new RestfulResponse()
  response.addRecords(someArray)
  response.reset()
	
@example Count Objects in Response
  response = new RestfulResponse()
  response.addRecords(someArray)
  myCount = response.getLength()

  
@author Nathan Klick
@copyright QRef 2012
###
class RestfulResponse
	###
	@property [Number] (Required) The total number of records available.
	###
	total: 0
	###
	@property [Array<Object>] (Required) The records returned from the server.
	###
	records: []
	###
	@property [Boolean] (Required) A boolean value indicating whether the request was successful. True if the request succeeded, false otherwise.
	###
	success: true
	###
	@property [String] (Required) The type of request being responded to by the server. Will always be "rest".
	###
	mode: 'rest'
	###
	@property [Mixed] (Required) A string or object containing an error message from a server side failure.
	###
	message: null
	###
	@property [Number] (Required) An error code returned from the server indicating failure. Will always be a standard HTTP error code (4xx, 5xx). 
	###
	errorCode: 0
	###
	Contructs a new RestfulResponse object and calls the {#reset} method. 
	###
	constructor: () -> 
		@.reset()
	###
	Sets the total number of available records when using pagination on a request. 
	@param value [Number] The total number of available records. 
	###
	setTotal: (value) -> @total = value
	###
	Add a single object to the records associated with this response.
	@param r [Object] The record to add to the response.
	###
	addRecord: (r) -> 
		@records.push(r)
		@records.length
	###
	Appends an array of objects to the response.
	@param arr [Array<Object>] The array of objects to append to this response.
	###
	addRecords: (arr) ->
		@records = @records.concat(arr)
		@records.length
	###
	Resets the AjaxResponse object to its default state.
	###
	reset: () ->
		@records = []
		@message = null
		@success = true
		@mode = 'rest'
		@total = 0
		@errorCode = 0
		@records.length
	###
	Returns the total number of objects contained in this response.
	@return [Number] The total number of objects in this response.
	###
	getLength: () -> @records.length
	###
	Sets this response to a failed state by setting the success property to false and assigning the message and errorCode properties.
	@param reason [Mixed] The string or object to be set as the message property. 
	@param errorCode [Number] The standard HTTP error code to return in the errorCode property.
	###
	failure: (reason, errorCode) -> 
		@message = reason
		@success = false
		@errorCode = errorCode
module.exports = RestfulResponse