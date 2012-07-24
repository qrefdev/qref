Route = require('./Route')
fs = require('fs')
class Router
	express: null
	routes: []
	constructor: (express) ->
		@express = express
	getExpress: () -> @express
	registerRoute: (route) ->
		if route? and not (route in @routes)
			@routes.push route
		true
	setup: () ->
		console.log('Router: Route Count ' + @routes.length)
		for rt in @routes
			for m in rt.getMethods()
				console.log('Setup Route: ' + m.method + ' ' + m.path)
				if m.method == 'GET'
					@express.get(m.path, rt.get)
					console.log('Install Route: GET ' + m.path)
				else if m.method == 'POST'
					@express.post(m.path, rt.post)
					console.log('Install Route: POST ' + m.path)
				else if m.method == 'PUT'
					@express.put(m.path, rt.put)
					console.log('Install Route: PUT ' + m.path)
				else if m.method == 'DELETE'
					@express.del(m.path, rt.del)
					console.log('Install Route: DELETE ' + m.path)
		true
	load: () ->
		this.internalLoadDirectory('./lib/router/routes', './routes', '/services')
	internalLoadDirectory: (path, requirePath, webPath) ->
		entries = fs.readdirSync(path)
		for e in entries
			stats = fs.statSync(this.combinePath(path, e))
			
			if stats.isFile() and not (e.indexOf('.js') == -1)
				route = require(this.combinePath(requirePath, e))
				for m in route.getMethods()
					m.path = this.combinePath(webPath, m.path)
				this.registerRoute(route)
			else if stats.isDirectory()
				this.internalLoadDirectory(this.combinePath(path, e), this.combinePath(requirePath, e), this.combinePath(webPath, e))
		true
	combinePath: (path1, path2) ->
		if not (path1.lastIndexOf('/') == path1.length - 1)
			path1 = path1 + '/'
		
		if path2.indexOf('/') == 0
			path2 = path2.slice(1, path2.length) 
		
		path1 + path2		
module.exports = Router