RecordFilter = require('../RecordFilter')
async = require('async')
class AircraftChecklistFilter extends RecordFilter
	constructor: (token) ->
		super token
	retrieve: (record, callback) ->
		canRetrieve = false
		async.series(
			[
				(cb) =>
					if not @user? or not @roles?
						@.resolve(cb)
					else
						cb(null)
				,(cb) =>
					if @.isInRole('Administrators') and (not record.user? or record.user.toString() == @.getUser()._id.toString())
						canRetrieve = true
					else if @.isInRole('Users') and record.user? and record.user.toString() == @.getUser()._id.toString() and record.isDeleted == false
						canRetrieve = true
					else 
						canRetrieve = false
						
					cb(null)
				
			],
			(err) ->
				callback(err, canRetrieve, record)
		)
	create: (callback) ->
		canCreate = false
		async.series(
			[
				(cb) =>
					if not @user? or not @roles?
						@.resolve(cb)
					else
						cb(null)
				,(cb) =>
					if @.isInRole('Administrators')
						canCreate = true
					else 
						canCreate = false
						
					cb(null)
			],
			(err) ->
				callback(err, canCreate)
		)
	update: (record, callback) ->
		canUpdate = false
		async.series(
			[
				(cb) =>
					if not @user? or not @roles?
						console.log('INFO: filter.update() - User or Role not loaded. Beginning call to filter.resolve()')
						@.resolve(cb)
					else
						console.log('INFO: filter.update() - User and Role are currently loaded. Stepping into next method in series.')
						cb(null)
				,(cb) =>
					if @.isInRole('Administrators')
						console.log('INFO: filter.update() - User is in the Administrators role. Authorizing update request.')
						canUpdate = true
					else if @.isInRole('Users') and record.user.toString() == @.getUser()._id.toString()
						console.log('INFO: filter.update() - User in is limited access group and record is owned by the user. Authorizing update request.')
						canUpdate = true
					else 
						console.log('INFO: filter.update() - User is not authorized. Denying update request.')
						console.log('INFO: filter.update() - Failure - { isUser: ' + @.isInRole('Users') + ', isAdministrator: ' + @.isInRole('Administrators') + ', recordUser: ' + record.user.toString() + ', user: ' + @.getUser()._id.toString() + ', record: ' + record._id.toString() + ', userName: ' + @.getUser().userName + ' }')
						canUpdate = false
				
					cb(null)
			],
			(err) ->
				if err?
					console.log('ERROR: filter.update() - Error occurred in process. Dumping error to console.')
					console.log('ERROR: filter.update() - ' + err.toString())
				callback(err, canUpdate, record)
		)
	delete: (record, callback) ->
		canDelete = false
		async.series(
			[
				(cb) =>
					if not @user? or not @roles?
						@.resolve(cb)
					else
						cb(null)
				,(cb) =>
					if @.isInRole('Administrators')
						canDelete = true
					else if @.isInRole('Users') and record.user? and record.user.toString() == @.getUser()._id.toString()
						canDelete = true
					else 
						canDelete = false
				
					cb(null)
			],
			(err) ->
				callback(err, canDelete, record)
		)
	constrainQuery: (query, callback) ->
		async.series(
			[
				(cb) =>
					if not @user? or not @roles?
						@.resolve(cb)
					else
						cb(null)
				,(cb) =>
					if @.isInRole('Administrators')
						query['$or'] = [{ user: null}, { user: @user._id }]
					else if @.isInRole('Users')
						query['user'] = @user._id
						query['isDeleted'] = false
					else 
						query = null
						
					cb(null)
			],
			(err) ->
				callback(err, query)
		)
module.exports = AircraftChecklistFilter