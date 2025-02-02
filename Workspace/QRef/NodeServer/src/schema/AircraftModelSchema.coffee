mongoose = require('mongoose')
Schema = mongoose.Schema
ObjectId = Schema.ObjectId

###
Schema representing a specific aircraft make and model. 
@example MongoDB Collection
  db.aircraft.models
@example MongoDB Indexes
  db.aircraft.models.ensureIndex({ name: 1, modelYear: 1 }, { unique: true })
@author Nathan Klick
@copyright QRef 2012
@abstract
###
class AircraftModelSchemaInternal
	###
	@property [String] (Required) The name of the model.
	### 
	name:
		type: String
		required: true
	###
	@property [String] (Optional) A detailed description of the model.
	###
	description:
		type: String
		required: false
	###
	@property [ObjectId] (Required) The associated manufacturer of this model.
	@see AircraftManufacturerSchemaInternal
	###
	manufacturer: 
		type: ObjectId
		required: true
		ref: 'aircraft.manufacturers'
	###
	@property [String] (Required) A string representing the specific year of this model.
	###
	modelYear:
		type: String
		required: true

AircraftModelSchema = new Schema(new AircraftModelSchemaInternal())
AircraftModelSchema.index({ name: 1, modelYear: 1})
module.exports = AircraftModelSchema