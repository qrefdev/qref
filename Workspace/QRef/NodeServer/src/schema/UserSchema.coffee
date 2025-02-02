mongoose = require('mongoose')
Schema = mongoose.Schema
ObjectId = Schema.ObjectId

###
Schema representing an individual user object including their associated credentials, email address, and password recovery information. 
@example MongoDB Collection
  db.users
@example MongoDB Indexes
  db.users.ensureIndex({ userName: 1 }, { unique: true })
@author Nathan Klick
@copyright QRef 2012
@abstract
###
class UserSchemaInternal 
	###
	@property [String] (Required) The username used to perform authentication. This should always be the user's email address.
	###
	userName: 
		type: String
		required: true
		unique: true
	###
	@property [String] (Required) A SHA-512 HMAC representing the user's password.
	###
	passwordHash: 
		type: String
		required: true
	###
	@property [String] (Required) A random SHA-512 hash used as a salt value in the password HMAC. 
	###
	passwordSalt: 
		type: String
		required: true
	###
	@property [String] (Optional) The first name of the user.
	###
	firstName: 
		type: String
		required: false
	###
	@property [String] (Optional) The last name (surname) of the user.
	###
	lastName:
		type: String
		required: false
	###
	@property [String] (Required) The user's email address.
	###
	emailAddress:
		type: String
		required: true
	###
	@property [Array<ObjectId>] (Optional) The list of roles possessed by this user.
	###
	roles: [
		type: ObjectId,
		ref: 'user.roles'
	]
	###
	@property [ObjectId] (Optional) The chosen recovery question for this user.
	###
	recoveryQuestion:
		type: ObjectId
		ref: 'user.recovery.questions'
		required: false
	###
	@property [String] (Optional) An SHA-512 HMAC represting the user's answer to their recovery question.
	###
	recoveryAnswer:
		type: String
		required: false
	timestamp:
		type: Date
		required: false
		default: new Date()

UserSchema = new Schema(new UserSchemaInternal())
module.exports = UserSchema
	