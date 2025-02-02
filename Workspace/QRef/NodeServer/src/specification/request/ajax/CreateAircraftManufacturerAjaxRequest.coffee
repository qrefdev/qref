AjaxRequest = require('../../../serialization/AjaxRequest')
###
Object sent as the body of an HTTP POST request to create a manufacturer.
@author Nathan Klick
@copyright QRef 2012
###
class CreateAircraftManufacturerAjaxRequest extends AjaxRequest
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
module.exports = CreateAircraftManufacturerAjaxRequest