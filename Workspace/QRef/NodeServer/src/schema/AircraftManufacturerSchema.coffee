mongoose = require('mongoose')
Schema = mongoose.Schema
ObjectId = Schema.ObjectId

###
Schema representing a specific aircraft manufacturer. 
@example MongoDB Collection
  db.aircraft.manufacturers
@example MongoDB Indexes
  db.aircraft.manufacturers.ensureIndex({ name: 1 }, { unique: true })
@author Nathan Klick
@copyright QRef 2012
@abstract
###
class AircraftManufacturerSchemaInternal 
	###
	@property [String] (Required) The name of the manufacturer.
	###
	name:
		type: String
		required: true
		unique: true
	###
	@property [String] (Optional) A detailed description of this manufacturer.
	###
	description:
		type: String
		required: false
	###
	@property [Array<ObjectId>] (Optional) A list of models associated with this manufacturer.
	@see AircraftModelSchemaInternal
	###
	models: [
		type: ObjectId
		ref: 'aircraft.models'
	]

AircraftManufacturerSchema = new Schema(new AircraftManufacturerSchemaInternal())
module.exports = AircraftManufacturerSchema