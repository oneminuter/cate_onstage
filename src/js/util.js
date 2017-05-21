var util = {
	//去掉空格
	trim: function(str){
		return null==str?"":(str+"").replace("\s","")
	},

	//toast弹层
	toast:function(text){
		var toast = document.createElement("p");
		toast.style.cssText = 'background-color: rgba(0, 0, 0, 0.4);width: 200px;position: absolute;top: 20%;z-index: 11;left: 50%;margin-left: -100px;color: rgba(255, 255, 255, 0.65);padding: 8px;border-radius: 8px;text-align: center;';
		toast.innerHTML = text;
		document.body.appendChild(toast);
		var timeer = setTimeout(function(){
			document.body.removeChild(toast);
			clearTimeout(timeer);
		}, 3000);
	},

	//判断类型
	typeOf: function(o) {
	    return /^\[object (.*)\]$/.exec(Object.prototype.toString.call(o).toLowerCase())[1];
	},

	//设置cookie
	setCookie: function(name, value){
		var days = 0.25;
		var exp = new Date();
		exp.setTime(exp.getTime() + days*24*60*60*1000);
		document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
	},
	//获取cookie
	getCookie: function(name){
		var arr,
			reg = new RegExp("(^|)" + name + "=([^;]*)(;|$)");
		if( arr = document.cookie.match(reg) ) {
			return unescape(arr[2]);
		} else {
			return null;
		}
	},
	//删除cookie
	removeCookie: function (name){
		var exp = new Date();
		exp.setTime( exp.getTime() - 1 );
		var cval = util.getCookie(name);
		if(cval != null){
			document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
		}
	},

	//设置sessionStorage
	setSessionStorage: function(name, value){
		if(window.sessionStorage){
			sessionStorage.setItem(name, value);
		}else{
			return false;
		}
	},
	//获取取sessionStorage
	getSessionStorage: function(name){
		if(window.sessionStorage){
			return sessionStorage.getItem(name);
		}else{
			return false;
		}
	},
	//删除sessionStorage
	removeSessionStorage: function(name){
		if(window.sessionStorage){
			sessionStorage.removeItem(name);
		}else{
			return false;
		}
	},
	//清楚sessionStorage
	clearSessionStorage: function(){
		if(window.sessionStorage){
			sessionStorage.clear();
		}else{
			return false;
		}
	},

	//设置localStorage
	setLocalStorage: function(name, value){
		if(window.localStorage){
			localStorage.setItem(name, value);
		}else{
			return false;
		}
	},
	//获取取localStorage
	getLocalStorage: function(name){
		if(window.localStorage){
			return localStorage.getItem(name);
		}else{
			return false;
		}
	},
	//删除localStorage
	removeLocalStorage: function(name){
		if(window.localStorage){
			localStorage.removeItem(name);
		}else{
			return false;
		}
	},
	//清楚localStorage
	clearLocalStorage: function(){
		if(window.localStorage){
			localStorage.clear();
		}else{
			return false;
		}
	}


}