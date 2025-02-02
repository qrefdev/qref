
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("ios7-switch/index.js", Function("exports, require, module",
"module.exports = Switch;\n\nfunction Switch(input) {\n  if ('checkbox' !== input.type) throw new Error('You can\\'t make Switch out of non-checkbox input');\n\n  this.input = input;\n  this.input.style.display = 'none';\n\n  this.el = document.createElement('div');\n  this.el.className = 'ios-switch';\n  this._prepareDOM();\n\n  this.input.parentElement.insertBefore(this.el, this.input);\n}\n\nSwitch.prototype.toggle = function() {\n  if(this.el.classList.contains('on')){\n    this.turnOff();\n  } else {\n    this.turnOn();\n  }\n\n  this.triggerChange();\n};\n\nSwitch.prototype.turnOn = function() {\n  this.el.classList.add('on');\n  this.el.classList.remove('off');\n  this.input.checked = true;\n};\n\nSwitch.prototype.turnOff = function() {\n  this.el.classList.remove('on');\n  this.el.classList.add('off');\n  this.input.checked = false;\n}\n\nSwitch.prototype._prepareDOM = function() {\n\n  var onBackground = document.createElement('div');\n  onBackground.className = 'on-background background-fill';\n\n  var stateBackground = document.createElement('div');\n  stateBackground.className = 'state-background background-fill';\n  \n  var handle = document.createElement('div');\n  handle.className = 'handle';\n    \n  this.el.appendChild(onBackground);\n  this.el.appendChild(stateBackground);\n  this.el.appendChild(handle);\n\n};\n\nSwitch.prototype.triggerChange = function() {\n  if (\"fireEvent\" in this.input){\n    this.input.fireEvent(\"onchange\");\n  } else {\n    var evt = document.createEvent(\"HTMLEvents\");\n    evt.initEvent(\"change\", false, true);\n    this.input.dispatchEvent(evt);\n  }\n};\n//@ sourceURL=ios7-switch/index.js"
));
require.register("ios7-switch/template.js", Function("exports, require, module",
"module.exports = '<div class=\\'ios-switch\\'>\\n    <div class=\\'on-background background-fill\\'></div>\\n    <div class=\\'state-background background-fill\\'></div>\\n    <div class=\\'handle\\'></div>\\n</div>\\n';//@ sourceURL=ios7-switch/template.js"
));
require.alias("ios7-switch/index.js", "ios7-switch/index.js");

