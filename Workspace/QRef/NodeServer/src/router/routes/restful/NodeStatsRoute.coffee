Route = require('../../Route')
mongoose = require('mongoose')
UserSchema = require('../../../schema/UserSchema')
os = require('os')
class NodeStatsRoute extends Route
	constructor: () ->
		super [{method: 'GET', path: '/node/stats'}]
	get: (req, res) ->
		console.log("Express server rendering runtime report.");
		
		response = 
			tempDir: os.tmpDir(),
			hostName: os.hostname(),
			osType: os.type(),
			osArch: os.arch(),
			osRelease: os.release(),
			osUptime: os.uptime(),
			osLoadAvg: os.loadavg(),
			totalMem: os.totalmem(),
			freeMem: os.freemem(),
			cpus: os.cpus(),
			processMem: process.memoryUsage(),
			processUptime: process.uptime(),
			networkInterfaces: os.networkInterfaces()
		
		res.json(response, 200)
module.exports = new NodeStatsRoute()