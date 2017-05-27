
var loginAndRegister = {
	doRegister: function(){
		var phone = util.trim(mui("#phone")[0].value);
		var password = util.trim(mui("#password")[0].value);
		var confirmPassword = util.trim(mui("#confirmPassword")[0].value);

		var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
		if( !reg.test(phone) ){
			util.toast("请输入正确的手机号");
			return false;
		}

		if(password == ""){
			util.trim("密码不能为空");
			return false;
		}

		if(password != confirmPassword){
			util.toast("两次密码输入不一致");
			return false;
		}

		password = MD5(password);
		mui.ajax(urlUtil.getRequestUrl("register"),{
			data:{
				phone: phone,
				password: password,
			},
			type: "post",
			dataType: "json",
			success: function(data){
				if(data.header.success){
					util.toast("注册成功");
					var timer = setTimeout(function(){
						loginAndRegister.showLogin();
						clearTimeout(timer);
					}, 1000);
				}else{
					util.toast(data.header.errorInfo);
				}
			},
			error: function(xhr, type, errorThrown){
				util.toast(type + "错误，注册错误，请稍后重试");
			}
		});

	},
	doLogin: function(){
		var phone = util.trim(mui("#phone")[0].value);
		var password = util.trim(mui("#password")[0].value);

		var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
		if( !reg.test(phone) ){
			util.toast("请输入正确的手机号");
			return false;
		}

		if(password == ""){
			util.trim("密码不能为空");
			return false;
		}

		password = MD5(password);
		mui.ajax(urlUtil.getRequestUrl("login"),{
			data: {
				phone: phone,
				password: password
			},
			type: "post",
			dataType: "json",
			success: function(data){
				if(data.header.success){
					loginAndRegister.setUserInfo(data.body);
				}else{
					util.toast(data.header.errorInfo);
				}
			},
			error: function(xhr, type, errorThrown){
				util.toast(type + "错误，注册错误，请稍后重试");
			}
		})
	},

	showLogin: function(){
		mui(".content")[0].innerHTML = '<h3>登录</h3>\
										<div class="login_row">\
											<label>手机号</label>\
											<input type="number" id="phone" onfocus="loginAndRegister.focus(this)" onblur="loginAndRegister.blur(this)">\
										</div>\
										<div class="login_row">\
											<label>密码</label>\
											<input type="password" id="password" onfocus="loginAndRegister.focus(this)" onblur="loginAndRegister.blur(this)">\
										</div>\
										<a class="submit" href="javascript:loginAndRegister.doLogin();">Login</a>\
										<a class="changePanel" href="javascript:javascript:loginAndRegister.changePanel(\'register\');">没有账号，去注册</a>';
	},

	showRegister: function(){
		mui(".content")[0].innerHTML = '<h3>注册</h3>\
										<div class="login_row">\
											<label>手机号</label>\
											<input type="number" id="phone" onfocus="loginAndRegister.focus(this)" onblur="loginAndRegister.blur(this)">\
										</div>\
										<div class="login_row">\
											<label>密码</label>\
											<input type="password" id="password" onfocus="loginAndRegister.focus(this)" onblur="loginAndRegister.blur(this)">\
										</div>\
										<div class="login_row">\
											<label>确认密码</label>\
											<input type="password" id="confirmPassword" onfocus="loginAndRegister.focus(this)" onblur="loginAndRegister.blur(this)">\
										</div>\
										<a class="submit" href="javascript:loginAndRegister.doRegister();">Register</a>\
										<a class="changePanel" href="javascript:javascript:loginAndRegister.changePanel(\'login\');">已有账号，去登录</a>';
	},

	changePanel: function(name){
		switch(name){
			case "login":
			 	loginAndRegister.showLogin();
			 	break;
			case "register":
				loginAndRegister.showRegister();
				break;
			default :
				break;
		}
	},

	focus: function(element){
		if( typeof element.parentNode.querySelector("label") != "undefined" ){
			element.parentNode.querySelector("label").style.cssText = 'margin-top: -32.5px;\
																    background-color: rgb(255, 100, 100);\
																    color: rgb(255, 255, 255);\
																    padding: 1px 9px;\
																    border-radius: 10px;';
		}
	},

	blur: function(element){
		if(util.trim(element.value) == ""){
			if( typeof element.parentNode.querySelector("label") != "undefined" ){
				element.parentNode.querySelector("label").style.cssText = "";
			}
		}
	},

	//登录成功后，设置用户信息
	setUserInfo: function(data){
		util.setSessionStorage("uid",data.id);
		util.setSessionStorage("phone", data.phone);
		window.location.href = "index";
	}

}