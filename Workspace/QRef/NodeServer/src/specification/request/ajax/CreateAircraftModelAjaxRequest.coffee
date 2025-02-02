AjaxRequest = require('../../../serialization/AjaxRequest')
###
Object sent as the body of an HTTP POST request to create a model.
@author Nathan Klick
@copyright QRef 2012
###
class CreateAircraftModelAjaxRequest extends AjaxRequest
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
module.exports = CreateAircraftModelAjaxRequest