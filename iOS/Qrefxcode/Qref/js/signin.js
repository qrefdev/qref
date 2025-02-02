function Signin() {
	var signin = { "mode":"rpc", "userName": $("#email").val(), "password": $("#password").val() };

	AppObserver.set('loading', true);

    CallObjectiveC("qref://clearCache");
    //window.location.href = "qref://clearChecklistCache";


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
                    AppObserver.set('token', response.returnValue.token);
                    AppObserver.set('email', $("#email").val());

               CallObjectiveC("qref://setUser=" + signin.userName + "&setToken=" + response.returnValue.token + '&setUserId=' + response.returnValue.user);

                    AppObserver.set('loading', true);
                    setTimeout(function() {
                          CallObjectiveC("qref://setLogin=" + signin.userName + "(QREFUPS)" + response.returnValue.user + "(QREFUPS)" + Whirlpool(signin.password));
                            setTimeout(function() {
                                CallObjectiveC("qref://hasChecklists");
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
        CallObjectiveC("qref://localLogin=" + signin.userName + "(QREFUPS)" + Whirlpool(signin.password));
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

            Sync.sync();
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

            CallObjectiveC("qref://clearCache");

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

	CallObjectiveC("qref://clearCache");

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

                    Navigation.go('#passwordAuthCode');
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

function passwordAuthCode() {
	var data = {"mode":"rpc", "code":$('#authCode').val()};

	if(reachability) {
		if($('#authCode').val() != '' && $('#authPassword').val() != '' && $('#authPasswordConfirm').val() != '') {
			if($('#authPassword').val() == $('#authPasswordConfirm').val()) {
				AppObserver.set('loading', true);

				CallObjectiveC("qref://clearCache");

				data.password = $('#authPassword').val();

				 $.ajax({
					type: "post",
					data: data,
					dataType: "json",
					url: host + "services/rpc/auth/passwordRecovery",
					success: function(response) {
						if(response.success) {
							$('#authCode').val('');
							$('#authPassword').val('');
							$('#authPasswordConfirm').val('');

							var dialog = new Dialog("#infobox", "Password successfully updated!");
            				dialog.show();

            				Navigation.go('#dashboard');
						}
						else {
							var dialog = new Dialog("#infobox", "Invalid Auth Code!");
            				dialog.show();
						}

						AppObserver.set('loading', false);
					},
					error: function() {
						var dialog = new Dialog("#infobox", "No internet connection!");
            			dialog.show();

            			AppObserver.set('loading', false);
					}
				});
			}
			else {
				var dialog = new Dialog("#infobox", "New Password and Confirm Password must match");
            	dialog.show();
			}
		}
		else {
			var dialog = new Dialog("#infobox", "All fields are required!");
            dialog.show();
		}
	}
	else {
		var dialog = new Dialog("#infobox", "No internet connection!");
		dialog.show();
	}
}
