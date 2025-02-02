var host = "/";
var loader = undefined;
var Navigation = new NavigationHandler();
var Authentication = new AuthenticationHandler();
var token = "";

//Default Settings 
var NightTimeModeTime = "00:00";
var NightTimeModeTimeOff = "00:00";
var AutoSwitch = false;
var NightMode = false;
var NightTheme = "theme-dark";
var DayTheme = "theme-light";

$.querystring = function(key) {
	var currentUrl = window.location.href;
	
	var sections = currentUrl.split("?");
	
	if(sections.length == 2)
	{
		var queryString = sections[1];
		
		var pairs = queryString.split("&");
		
		if(pairs.length > 0)
		{
			for(var i = 0; i < pairs.length; i++)
			{
				var keypair = pairs[i].split("=");
				
				if(keypair.length == 2)
				{
					if(keypair[0].toLowerCase() == key.toLowerCase())
					{
						return keypair[1];
					}
				}
			}
		}
	}
	
	return undefined;
};


$(window).load(function() {
	

    loader = new Loader("#loader");
});

function AuthenticationHandler() {
	
	this.signOut = function() {
		token = "";
		$.cookie.deleteCookie("QrefAuth");
		this.verify();
	};
	
	this.refreshServer = function() {
		if(token != "")
		{	
			$.ajax({
				type: "GET",
				dataType: 'json',
				url: host + 'api/node/recycle?token=' + token,
				success: function(data) {
					if(data.status == "ok")
					{
						var dialog = new Dialog("#infobox", "Server has been restarted. You may refresh your browser.");
						dialog.show();
					}
					else
					{
						var dialog = new Dialog("#infobox", "Failed to restart server instance");
						dialog.show();
					}
				},
				error: function() {
					var dialog = new Dialog("#infobox", "Failed to restart server instance");
						dialog.show();
				}
			});
		}
	};
	
	this.syncSlave = function() {
		if(token != "")
		{	
			var payload = { mode: 'rpc', token: token };
			
			$.ajax({
				type: "POST",
				dataType: 'json',
				data: payload,
				url: host + 'services/rpc/admin/syncSlaveDb',
				success: function(data) {
					if(data.success)
					{
						var dialog = new Dialog("#infobox", "Synchronization completed successfully!");
						dialog.show();
					}
					else
					{
						var dialog = new Dialog("#infobox", "Synchronization failed!");
						dialog.show();
					}
				},
				error: function() {
					var dialog = new Dialog("#infobox", "Synchronization failed!");
						dialog.show();
				}
			});
		}
	};
	
	this.verify = function() {
		if(token == null || token  == "")
		{
			token = $.cookie.getCookie("QrefAuth");
		}
	
		if(token == undefined || token == "") 
		{
			token = "";
			
			$("#signin-menu").show();
			$("#signout-menu").hide();
			$("#register-menu").show();
			$("#parser-menu").hide();
			$("#product-editor-menu").hide();
			$("#changepassword-menu").hide();
		}
		else
		{
			GetUserRoles(function(roles) {
				if(HasRole("Administrators", roles))
				{
					$("#parser-menu").show();
					$("#product-editor-menu").show();
					$("#refresh-server-menu").show();
					$("#manufacturer-editor-menu").show();
					$("#model-editor-menu").show();
					$("#sync-sportys-menu").show();
				}
				else
				{
					$("#parser-menu").hide();
					$("#product-editor-menu").hide();
					$("#refresh-server-menu").hide();
					$("#manufacturer-editor-menu").hide();
					$("#model-editor-menu").hide();
					$("#sync-sportys-menu").hide();
				}
			});
		
			$("#signin-menu").hide();
			$("#signout-menu").show();
			$("#register-menu").hide();
			$("#changepassword-menu").show();
		
		}
	};
}

function HasRole(role, roles) {
	for(var i = 0; i < roles.length; i++)
	{
		if(roles[i] == role)
			return true;
	}
}

function GetUserRoles(callback) {
	$.ajax({
		type: "POST",
		dataType: "json",
		url: host + "services/rpc/auth/userRoles",
		data: "token=" + token + "&mode=rpc",
		success: function(data) {
			if(data.success == true)
			{
				var roles = data.returnValue;
				
				if(callback)
					callback(roles);
			}
		}
	});
}