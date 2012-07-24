mongoose = require('mongoose')
class QRefDatabase
	connection: null
	url: 'mongodb://localhost/qref'
	Users: null
	AuthTokens: null
	Schema: mongoose.Schema
	constructor: () ->
		@connection = mongoose.createConnection(@url)
		@.initialize()
	initialize: () ->
		UserSchema = require('../schema/UserSchema')
		@Users = @connection.model('users', UserSchema)
		AuthTokenSchema = require('../schema/AuthTokenSchema')
		@AuthTokens = @connection.model('authTokens', AuthTokenSchema)
	getConnection: () -> @connection
	getUrl: () -> @url
module.exports = QRefDatabase
		