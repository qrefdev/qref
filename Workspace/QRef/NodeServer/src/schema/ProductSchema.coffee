mongoose = require('mongoose')
Schema = mongoose.Schema
ObjectId = Schema.ObjectId

###
Schema representing a saleable product. The product record is used in conjunction with the In-App Purchase Processes.
@example MongoDB Collection
  db.products
@example MongoDB Indexes
  db.products.ensureIndex({ name: 1 }, { unique: true })
  db.products.ensureIndex({ manufacturer: 1, model: 1 })
@author Nathan Klick
@copyright QRef 2012
@abstract
###
class ProductSchemaInternal 
	###
	@property [String] (Required) A unique internal name for the product. Might possibly be a SKU or PN.
	###
	name:
		type: String
		required: true
	###
	@property [String] (Optional) A product description which will be visible on the product details screen.
	###
	description: 
		type: String
		required: false
		default: ''
	###
	@property [Boolean] (Required) A true/false value indicating whether the product is published for consumer user.
	###
	isPublished:
		type: Boolean
		required: true
		default: false
	###
	@property [String] (Optional) An apple product code for the corresponding item in the iTunes store.
	###
	appleProductIdentifier:
		type: String
		required: false
	###
	@property [String] (Optional) A google product code for the corresponding item in the google play store.
	###
	androidProductIdentifier:
		type: String
		required: false
	###
	@property [Boolean] (Required) A true/false value indicating whether this product is available for apple devices.
	###
	isAppleEnabled:
		type: Boolean
		required: true
		default: false
	###
	@property [Boolean] (Required) A true/false value indicating whether this product is available for android devices.
	###
	isAndroidEnabled:
		type: Boolean
		required: true
		default: false
	###
	@property [Number] (Required) The suggested retail price for this product. Price may vary in iTunes and Google Play stores.
	###
	suggestedRetailPrice:
		type: Number
		required: true
		default: 0
		min: 0
		max: 100.00
	###
	@property [String] (Required) An enumeration indicating general product category. Valid values are ['aviation', 'marine', 'navigation'].
	###
	productCategory:
		type: String
		required: true
		enum: ['aviation', 'marine', 'navigation']
	###
	@property [String] (Required) An enumeration indicating the type of product. Valid values are ['checklist', 'manual', 'guide'].
	###
	productType:
		type: String
		required: true
		enum: ['checklist', 'manual', 'guide']
	###
	@property [ObjectId] (Optional) An associated base checklist for aircraft products. This category represents the stock checklist that the user receives when purchasing the product.
	###
	aircraftChecklist:
		type: ObjectId
		ref: 'aircraft.checklists'
		required: false
		default: null
	###
	@property [Boolean] (Required) A true/false value indicating whether this product is a sample product which is included with the application at no charge.
	###
	isSampleProduct:
		type: Boolean
		required: true
		default: false
	###
	@property [String] (Optional) An string indicating which aircraft, marine, or navigation serial numbers are supported by this product.
	###
	serialNumber: 
		type: String
		required: false
		default: null
	###
	@property [ObjectId] (Required) The manufacturer associated with this product.
	@see AircraftManufacturerSchemaInternal
	###
	manufacturer: 
		type: ObjectId
		ref: 'aircraft.manufacturers'
		required: true
	###
	@property [ObjectId] (Required) The model associated with this product.
	@see AircraftModelSchemaInternal
	###
	model: 
		type: ObjectId
		ref: 'aircraft.models'
		required: true
	###
	@property [String] (Optional) A server-based relative path to the cover artwork for this product. This path should be relative to the server root. 
	###
	coverImage:
		type: String
		required: false
	###
	@property [String] (Optional) A server-based relative path to the icon for this product. This path should be relative to the server root.
	###
	productIcon:
		type: String
		required: false
	###
	@property [Boolean] For performing soft deletes
	###
	isDeleted:
		type: Boolean
		required: true
		default: false
	
ProductSchema = new Schema(new ProductSchemaInternal())
ProductSchema.index({ manufacturer: 1, model: 1 })
ProductSchema.index({ name: 1, }, { unique: true })
module.exports = ProductSchema