function Signin() {
	var signin = { "mode":"rpc", "userName": $("#email").val(), "password": $("#password").val() };
	
	AppObserver.set('loading', true);
	
    window.location.href = "qref://clearCache";
    
    if(reachability) {
        $.ajax({
            type: "post",
            data: signin,
            dataType: "json",
            url: host + "services/rpc/auth/login",
            success: function(data) {
                var response = data;
                
                if(response.success == true)
                {
                    AppObserver.set('token', response.returnValue);
                    AppObserver.set('email', $("#email").val());

               window.location.href = "qref://setUser=" + $("#email").val() + "&setToken=" + response.returnValue;
               
                    AppObserver.set('loading', true);
                    setTimeout(function() {
                        window.location.href = "qref://hasChecklists";
                               
                       setTimeout(function() {
                            window.location.href = "qref://setLogin=" + $("#email").val() + "(QREFUPS)" + Whirlpool($("#password").val());
                       }, 1000);
                    }, 1000);
                }
                else
                {
                    AppObserver.set('loading', false);
                    var dialog = new Dialog("#infobox", "Invalid email or password");
                    dialog.show();
                }	
            },
            error: function() {
                AppObserver.set('loading', false);
                var dialog = new Dialog("#infobox", "Cannot connect to server");
                dialog.show();
            }
        });
    }
    else {
        window.location.href = "qref://localLogin=" + $("#email").val() + "(QREFUPS)" + Whirlpool($("#password").val());
    }
}

function InvalidSignin() {
    AppObserver.set('loading', false);
    var dialog = new Dialog("#infobox", "Invalid email or password");
    dialog.show();
}

function signinLoadChecklists() {
    $("#email").val("");
    $("#password").val("");
    
    if(AppObserver.cachePack != '' && AppObserver.cachePack != undefined && checklists == undefined) {
        AppObserver.getChecklists(function(success, items) {
            if(success) {
                DashboardDataSource.data(items);
                DashboardObserver.set('dataSource', DashboardDataSource);
            }

            AppObserver.set('loading', false);
        });
    }
    else {
        AppObserver.set('loading', false);
        Sync.sync();
    }
    Navigation.go("dashboard");
}

function changePassword() {
	var changingRequest = { "mode":"rpc", "oldPassword":$("#oldPassword").val(), "newPassword":$("#newPassword").val(), "token": AppObserver.token };
	
    if(reachability) {
        if($("#newPassword").val() != $("#newPasswordConfirm").val()) 
        {
            var dialog = new Dialog("#infobox", "New Password and Confirm Password must match");
            dialog.show();
        }
        else
        {
            AppObserver.set('loading', true);
            
            window.location.href = "qref://clearCache";
            
            $.ajax({
                type: "post",
                data: changingRequest,
                dataType: "json",
                url: host + "services/rpc/auth/changePassword",
                success: function(data) {
                    var response = data;
                    
                    AppObserver.set('loading', false);
                    
                    if(response.success == true)
                    {
                        var dialog = new Dialog("#infobox", "Password changed successfully");
                        dialog.show();
                        
                        $("#oldPassword").val("");
                        $("#newPassword").val("");
                        $("#newPasswordConfirm").val("");
                        
                        Navigation.go("dashboard");		
                    }
                    else
                    {
                        var dialog = new Dialog("#infobox", response.message);
                        dialog.show();
                    }
                },
                error: function() {
                    AppObserver.set('loading', false);
                    var dialog = new Dialog("#infobox", "Cannot connect to server");
                    dialog.show();
                }
            });
        }
    }
    else {
        AppObserver.set('loading', false);
        var dialog = new Dialog("#infobox", "No Connection Available");
        dialog.show();
    }
}

function passwordRecovery() {
	var recovery = { "mode":"rpc", "userName": $("#recoveryEmail").val() };
	
	AppObserver.set('loading', true);
	
	window.location.href = "qref://clearCache";
	
    if(reachability) {
        $.ajax({
            type: "post",
            data: recovery,
            dataType: "json",
            url: host + "services/rpc/auth/passwordRecoveryRequest",
            success: function(data) {
                var response = data;
                
                AppObserver.set('loading', false);
                
                if(response.success == true)
                {
                    var dialog = new Dialog("#infobox", "An email has been sent with instruction on how to finish the recovery process.");
                    
                    $("#recoveryEmail").val("");
                    
                    dialog.show();		
                }
                else
                {
                    var dialog = new Dialog("#infobox", "Invalid E-mail");
                    dialog.show();
                }
            },
            error: function() {
                AppObserver.set('loading', false);
                
                var dialog = new Dialog("#infobox", "Cannot connect to server");
                dialog.show();
            }
        });
    }
    else {
        AppObserver.set('loading', false);
        var dialog = new Dialog("#infobox", "No Connection Available");
        dialog.show();
    }
}
