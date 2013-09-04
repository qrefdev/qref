(function() {
 	zimoko.heightOfElements = function(elements) {
 		var height = 0;
 		
 		elements.each(function() {
 			height += $(this).outerHeight();
 		});
 		
 		return height;
 	};
 	
 	zimoko.applyVirtualCoords = function(elements, scrollTop, parent) {
 		zimoko.Async.each(elements, function() {
 			var $this = $(this);
 			
 			var offset = $this.position();
                          
 			if(offset.top - scrollTop < 0 - $this.height()) {
				$this.css({visibility: 'hidden'});
				//console.log("Item " + i + ": Hidden");
			}
			else if(offset.top - scrollTop > parent.height() + $this.height()) {
				$this.css({visibility: 'hidden'});
				//console.log("Item " + i + ": Hidden");
			}
			else {
				$this.css({visbility: 'visible'});
				//console.log("Item " + i + ": Shown");
			}
 		});
 	};
 	
	zimoko.createGuid = function() {
		var d = new Date().getTime();
		var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x7|0x8)).toString(16);
		});
		return uuid;
	};
	
	/** Property Based Helpers for Objects **/
	zimoko.parsePropertyString = function(object, propertyString) {
		var property = undefined;
		var propertyTree = propertyString.split(".");
		
		for(var i = 0; i < propertyTree.length; i++)
		{
			if(property == undefined)
			{
				property = object[propertyTree[i]];
			}
			else
			{
				property = property[propertyTree[i]];
			}
		}
		
		return property;
	};
	
	zimoko.getPropertyValue = function(object, property) {	
		if(property != undefined) {
			if(property instanceof Date)
			{
				return property.valueOf();
			}
			else if(typeof(property) == 'function') {
				return property.call(object);
			}
			else if(typeof(property) == 'number') {
				return parseFloat(property);
			}
			else
			{
				return property
			}
		}
		
		return undefined;
	};
	
	/** Execution Helper for simple javascript expressions **/
	zimoko.execute = function(expression) {
		return (new Function('return (' + expression + ');')).apply(this);
	};
	
	/** Check to see if each object truly equals each other **/
	zimoko.objectEquals = function(object1, object2) {
		for(var name in object1) {
			if(object2[name] != object1[name])
				return false;
		}
		
		return true;
	};
	
	/** Returns a boolean value from a string expression of (true && false) etc. **/
	zimoko.isFiltered = function(expression) {
		return (new Function('return (' + expression + ');'))();	
	}
	
	/** Input selection range helpers **/
	zimoko.select = function(input, start, end) {
		if(input.selectionStart != undefined) {
			input.selectionStart = start;
			input.selectionEnd = end;
		}
		else {
			input.focus();
			input.select();
			var range = document.selection.createRange();
			range.collapse(true);
			range.moveEnd('character', end);
			range.moveStart('character', start);
			range.select();
		}
	};
	
	zimoko.cursorPosition = function(input, position) {
		if(position) {
			zimoko.select(input, position, position);
		}
		else {
			return zimoko.selection(input, 'start');
		}
	};
	
	zimoko.selection = function(input, type) {
		type = type.toLowerCase();
		
		$this = $(input);
		
		if(type == 'start' || type == 'end') {
			if(input.selectionStart != undefined) {
				if(type == 'start')
					return input.selectionStart;
				else
					return input.selectionEnd;
			} else {
				var range = document.selection.createRange();
				start = $this.val().indexOf(range.text);
				
				if(type == 'start')
					return start;
				else 
					return start + range.text.length;
			}
		}
		
		return 0;
	};
	
	/** Complex object value execution from object and property **/
	/** Used in binding handlers **/
	zimoko.ValueAccessor = function(object, property) {
		this.owner = object;
		this.property = property;
		
		var keys = Object.keys(object);
		
		for(var name in object.constructor.prototype) {
			keys.push(name);
		}
		
		var values = [];
		
		for(var i = 0; i < keys.length; i++)
		{
			values.push(object[keys[i]]);
		}
	
         try {
            this.value = new Function(keys,'return ' + property.value + ';').apply(object, values);
         } catch (e) {
            this.value = undefined;
         }
 
		this.get = function() {
			if(typeof(this.value) == 'function') {
				return this.value.call(this.owner);
			}
			else {
				return this.value;
			}
		};
		
		this.set = function(value) {
			if(typeof(this.value) != 'function') {
				this.owner.set(this.property.name, value);
			}
		};
		
		this.trigger = function(element, event, data) {
			var self = this;
			if(typeof(this.value) == 'function') {
				self.value.call(self.owner, element, event, data);
			}
		};
	};
	
	/** Numeric Helpers **/
	zimoko.isNumber = function(value) {
		if(zimoko.culture.country.toLowerCase() != 'us' && zimoko.culture.country.toLowerCase() != 'uk') {
			value = value + "";
			
			value = value.replace(/\./g,'').replace(/\,/g,'.');
		}
		
		return !isNaN(parseFloat(value)) && isFinite(value);
	};
	
	if(!document.documentMode) {
		window.addEventListener('message', function(event) {	
			if(event.data == 'queue') {
				zimoko.queue.dequeue();
			}
		}, false);
	}
	else if(document.documentMode < 9) {
		window.attachEvent('message', function(event) {
			if(event.data == 'queue') {
				zimoko.queue.dequeue();
			}
		});
	}
	
	zimoko.queue = {
		_timer: null,
		_queue: [],
		add: function(fn, context) {
			if(!document.documentMode) {
				zimoko.queue._queue.push({fn: fn, context: context});
				window.postMessage('queue', window.location.href);
			}
			else {
				zimoko.queue._queue.push({fn: fn, context: context});
				setTimeout(function() {
					zimoko.queue.dequeue();
				}, 1);
			}
		},
		dequeue: function() {
			if(zimoko.queue._queue.length > 0) {
				var item = zimoko.queue._queue.splice(0,1);
				
				if(item && item.length > 0)
					item[0].fn.call(item[0].context || window);
			}
		},
		clear: function() {
			zimoko.queue._queue = [];
		}
	};
})();