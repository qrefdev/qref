class RestfulResponse
	total: 0
	records: []
	success: true
	mode: 'rest'
	message: null
	errorCode: 0
	constructor: () -> 
		@.reset()
	setTotal: (value) -> @total = value
	addRecord: (r) -> 
		@records.push(r)
		@records.length
	addRecords: (arr) ->
		@records = @records.concat(arr)
		@records.length
	reset: () ->
		@records = []
		@message = null
		@success = true
		@mode = 'rest'
		@total = 0
		@errorCode = 0
		@records.length
	getLength: () -> @records.length
	failure: (reason, errorCode) -> 
		@message = reason
		@success = false
		@errorCode = errorCode
	