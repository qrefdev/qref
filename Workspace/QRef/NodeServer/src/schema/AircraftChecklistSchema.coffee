mongoose = require('mongoose')
Schema = mongoose.Schema
Mixed = Schema.Types.Mixed
ObjectId = Schema.ObjectId
AircraftChecklistSectionSchema = require('./AircraftChecklistSectionSchema')
AircraftChecklistCategorySchema = require('./AircraftChecklistCategorySchema');

###
Schema representing a manufacturer/model specific checklist. 
@example MongoDB Collection
  db.aircraft.checklists
@example MongoDB Indexes
  db.aircraft.checklists.ensureIndex({ manufacturer: 1, model: 1, version: 1, tailNumber: 1 }, { unique: true })
@author Nathan Klick
@copyright QRef 2012
@abstract
###
class AircraftChecklistSchemaInternal  
	###
	@property [ObjectId] (Required) The manufacturer that this checklist is built against.
	@see AircraftManufacturerSchemaInternal
	###
	manufacturer: 
		type: ObjectId
		ref: 'aircraft.manufacturers'
		required: true
	###
	@property [ObjectId] (Required) The model that this checklist is built against.
	@see AircraftModelSchemaInternal
	###
	model: 
		type: ObjectId
		ref: 'aircraft.models'
		required: true
	###
	@property [Number] (Optional) The order in which this checklist should appear relative to the other checklists.
	###
	index: 
		type: Number
		required: false
		default: null
	###
	@property [String] (Optional) The tail number for a list which has been customized to a specific plane.
	###
	tailNumber:
		type: String
		required: false
		default: null
	###
	@property [ObjectId] (Optional) The user which owns this customized version of the checklist.
	@see UserSchemaInternal
	###
	user:
		type: ObjectId
		ref: 'users'
		required: false
		default: null
	###
	@property [Number] (Required) The version number of this checklist. 
	###
	version:
		type: Number
		required: true
		default: 1
	###
	@property [String] (Optional) A server-based relative path to the product icon. This path should be relative to the server root.
	###
	productIcon:
		type: String
		required: false
	###
	@property [Array<AircraftChecklistSectionSchemaInternal>] (Optional) The array of preflight sections.
	###
	preflight:
		type: [AircraftChecklistSectionSchema]
		required: false
	###
	@property [Array<AircraftChecklistSectionSchemaInternal>] (Optional) The array of takeoff sections.
	###
	takeoff:
		type: [AircraftChecklistSectionSchema]
		required: false
	###
	@property [Array<AircraftChecklistSectionSchemaInternal>] (Optional) The array of landing sections.
	###
	landing: 
		type: [AircraftChecklistSectionSchema]
		required: false
	###
	@property [Array<AircraftChecklistSectionSchemaInternal>] (Optional) The array of emergency sections.
	###
	emergencies:
		type: [AircraftChecklistCategorySchema]
		required: false
	###
	@property [Boolean] (Required) A true/false value indicating whether this record has been deleted. Required for soft-delete support.
	###
	isDeleted:
		type: Boolean
		required: true
		default: false
	timestamp:
		type: Date
		required: false
		default: new Date()
	currentSerialNumber:
		type: Number
		required: true
	knownSerialNumbers:
		type: [Mixed]
		required: false
		default: []
	lastCheckpointSerialNumber:
		type: Number
		required: true

AircraftChecklistSchema = new Schema(new AircraftChecklistSchemaInternal())
AircraftChecklistSchema.index({ manufacturer: 1, model: 1, version: 1, tailNumber: 1, user: 1 }, { unique: true })
AircraftChecklistSchema.index({ manufacturer: 1, model: 1, user: 1 })
AircraftChecklistSchema.index({ manufacturer: 1, model: 1, user: 1, version: 1 })
module.exports = AircraftChecklistSchema