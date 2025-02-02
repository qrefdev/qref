mongoose = require('mongoose')
Schema = mongoose.Schema
ObjectId = Schema.ObjectId

###
Schema representing a system-wide role used to control access levels of individual users.
@example MongoDB Collection
  db.user.roles
@example MongoDB Indexes
  db.user.roles.ensureIndex({ roleName: 1 }, { unique: true })
@author Nathan Klick
@copyright QRef 2012
@abstract
###
class RoleSchemaInternal 
	###
	@property [String] (Required) A unique name for the specific role.
	###
	roleName:
		type: String
		required: true
		unique: true
	###
	@property [String] (Optional) A detailed description of this role.
	###
	description:
		type: String
		required: false

RoleSchema = new Schema(new RoleSchemaInternal())
module.exports = RoleSchema