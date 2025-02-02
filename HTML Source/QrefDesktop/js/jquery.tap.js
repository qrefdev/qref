(function( $ ){	
  var methods = {

    init : function( options ) { 
    	return this.each(function(index, item) {
    		var $this = $(item);

			//Check we havent already initialised the plugin
			var plugin = $this.data("jquery.tap");
			
			if (!plugin) {
				plugin = new Tap(item, options);
				$this.data("jquery.tap", plugin);
			}
			else if(plugin && !options)
			{
				plugin.triggerTap();
			}
    	});
    }
  };
  
  function Tap(element, options) {
  	  var $element = undefined;

	  var startTime = 0, endTime = 0;
	
	  var duration = 0;
	  var threshold = 200;
	  
	  var TapHandler = undefined;	
  		
  	  TapHandler = options;
      
      $element = $(element);
      
      if(typeof TouchEvent == 'undefined' || typeof Touch == "undefined")
      {
      	$element.mouseup(touchEnd);
      	$element.mousedown(touchStart);
      }
      else
      {
      	$element.bind("touchstart", touchStart);
      	$element.bind("touchend", touchEnd);
  	  }
  	  
	  function touchStart(event) {
			startTime = endTime = Date.now();
			
			duration = 0;
	  }
	  
	  this.triggerTap = function() {
			trigger();
	  };
	  
	  function touchEnd(event) {
			endTime = Date.now();
			
			duration = getDuration();
			
			if(duration < threshold) {
				triggerHandler(event);
			}
	  }
	  
	  function trigger() {
	  		if(typeof TouchEvent == 'undefined' || typeof Touch == "undefined")
	  		{
				$element.mousedown();
				$element.mouseup();
			}
			else
			{
				$element.trigger("touchstart");
				$element.trigger("touchend");
			}
	  }
	  
	  function triggerHandler(event) {
		if(TapHandler)
			TapHandler.call($element, event);
	  }
	  
	  function getDuration() {
			return endTime - startTime;
	  }
  }

  $.fn.tap = function( method ) {
    
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || typeof method == "function" || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tap' );
    }    
  
  };

})( jQuery );