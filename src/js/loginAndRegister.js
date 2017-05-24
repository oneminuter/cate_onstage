
var loginAndRegister = {
	register: function(){
		var phone = util.trim(mui("#phone")[0].value);
		var password = util.trim(mui("#password")[0].value);
		var confirmPassword = util.trim(mui("#confirmPassword")[0].value);

		var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
		if( !reg.test(phone) ){
			util.toast("请输入正确的手机号");
			return false;
		}

		if(password != confirmPassword){
			util.toast("两次密码输入不一致");
			return false;
		}

		mui.ajax(urlUtil.getRequestUrl("register"),{
			data:{
				phone: phone,
				password: password,
			},
			type: "post",
			dataType: "json",
			success: function(data){},
			error: function(xhr, type, errorThrown){
				
			}
		});

	},
	login: function(){
		
	},
	changePanel: function(){
	},

	focus: function(element){
		if( typeof element.parentNode.querySelector("label") != "undefined" ){
			element.parentNode.querySelector("label").style.cssText = 'margin-top: -32.5px;\
																    background-color: rgb(15, 136, 235);\
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
	}

}