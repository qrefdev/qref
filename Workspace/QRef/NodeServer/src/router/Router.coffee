Route = require('./Route')
fs = require('fs')

###
Provides core request handling functionality and permits the auto-loading of routes at runtime.
@note Internal Usage Only - Not required outside the express bootstrap script.
@todo Remove dependency on relative and hard-coded paths.
@author Nathan Klick
@copyright QRef 2012
###
class Router
	###
	@property [Express] A reference to the current express object instance.
	###
	express: null
	###
	@property [Array<Route>] The list of routes associated with and loaded by this router instance.
	###
	routes: []
	###
	Creates a new Router object instance attached to the specific express object instance.
	@param express [Express] A reference to the current express object instance.
	###
	constructor: (express) ->
		@express = express
	###
	Accessor method for retrieving the current express object instance.
	@return [Express] The express object instance.
	###
	getExpress: () -> @express
	###
	Adds a new {Route} to the list of routes associated with this {Router}.
	@param route [Route] The route to be associated with this Router.
	@return [Boolean] True on success, false otherwise.
	###
	registerRoute: (route) ->
		if route? and not (route in @routes)
			@routes.push route
		true
	###
	Installs the {Route} objects associated with this router into the express runtime.
	###
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
	###
	Dynamically loads the {Route} objects into the router from the 'routes' sub-directory.
	###
	load: () ->
		@.internalLoadDirectory('./lib/router/routes', './routes', '/services')
	###
	@private
	###
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
	###
	@private
	###
	combinePath: (path1, path2) ->
		if not (path1.lastIndexOf('/') == path1.length - 1)
			path1 = path1 + '/'
		
		if path2.indexOf('/') == 0
			path2 = path2.slice(1, path2.length) 
		
		path1 + path2		
module.exports = Router