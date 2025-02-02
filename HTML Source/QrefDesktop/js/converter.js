function Converter() {
	var self = this;
	
	this.currentOption = undefined;
	this.selection = undefined;
	
	this.init = function() {
		this.selection = $("#convertMethod");
		this.currentOption = $(this.selection.children()[0]);
		this.selection.change(function(e) {
			self.currentOption = self.selection.find("option:selected");
			self.updateConversionTypes();
			self.convertTopToBottom();
			self.convertBottomToTop();
		});
		this.updateConversionTypes();
		$("#convertTop").keyup(function() {
			self.convertTopToBottom();
		});
		$("#convertBottom").keyup(function() {
			self.convertBottomToTop();
		});
		$("#convertTop").blur(function() {
			self.convertTopToBottom();
		});
		$("#convertBottom").blur(function() {
			self.convertBottomToTop();
		});
	};
	
	this.updateConversionTypes = function() {
		if(this.currentOption)
		{
			$(".topConversionType").html(this.currentOption.attr("data-top"));
			$(".bottomConversionType").html(this.currentOption.attr("data-bottom"));
		}
	};
	
	this.convertTopToBottom = function() {
		if(this.currentOption) {
			if(parseInt(this.currentOption.val()) != 6)
			{
				var multiplier = parseFloat(this.currentOption.attr("data-multiplier"));
				var currentValue = parseFloat($("#convertTop").val()) * multiplier;
				
				if(currentValue != "NaN")
				{
					$("#convertBottom").val(currentValue);
				}
			}
			else //Convert Time
			{
				var splitText = $("#convertTop").val().split(":");
				
				if(splitText.length == 3)
				{
					var hours = parseInt(splitText[0]);
					var minutes = parseInt(splitText[1]);
					var seconds = parseInt(splitText[2]);
					
					if(hours != "NaN" && minutes != "NaN" && seconds != "NaN")
					{
						if(minutes < 60 && seconds < 60)
						{
							seconds += minutes * 60;
							
							var decimal = seconds / 60 / 60
							var decimalString = ("" + parseInt(("" + decimal).split(".")[1]));
							
							$("#convertBottom").val(hours + "." + decimalString);	
						}
					}
				}
			}
		}
	};
	
	this.convertBottomToTop = function() {
		if(this.currentOption) {
			if(parseInt(this.currentOption.val()) != 6)
			{
				var multiplier = parseFloat(this.currentOption.attr("data-inverse"));
				var currentValue = parseFloat($("#convertBottom").val()) * multiplier;
				
				if(currentValue != "NaN")
				{
					$("#convertTop").val(currentValue);
				}
			}
			else //Convert Time
			{
				var splitNumber = parseFloat($("#convertBottom").val());
				
				if(splitNumber != "NaN")
				{
					var splitText = $("#convertBottom").val().split(".");
					
					if(splitText.length == 2)
					{
						var hours = parseInt(splitText[0]);
						var decimal = parseFloat("0." + splitText[1]);
						
						var minutes = decimal * 60;
						var seconds = minutes - parseInt(minutes);
						seconds = seconds * 60;
						
						$("#convertTop").val(hours + ":" + Math.round(minutes) + ":" + Math.round(seconds));
					}
				}
			}
		}
	};
}