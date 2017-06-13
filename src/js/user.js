(function(){
	var user = {
		controller: function(){
			user.init();
			user.bind();
		},

		init: function(){
			if(util.getSessionStorage("phone") != null){
				mui(".account")[0].innerHTML = util.getSessionStorage("phone");
				user.getUserInfo();
			}else{
				mui(".user_info a")[0].innerHTML = "登录";
			}
		},

		bind: function(){
			//详细信息-查看个人详细信息
			mui(".user_info a")[0].addEventListener("tap", function(){
				if(util.getSessionStorage("uid") != null){
					util.clearSessionStorage();
				}
				window.location.href = "login";
			}, false);

		},

		//获取余额
		getUserInfo: function(){
			var phone = util.getSessionStorage("phone");
			if(phone == null){
				mui("#balance")[0].innerHTML = "￥0.0";
			}else{
				mui.ajax(urlUtil.getRequestUrl("getUserInfo"),{
					data:{
						phone: phone
					},
					type: "post",
					dataType: "json",
					success: function(data){
						if(data.header.success){
							user.initUserPanel(data.body);
						}else{
							util.toast(data.header.errorInfo);
						}
					},
					error: function(xhr, type, errorThrown){
						util.toast(type + "错误，获取余额错误，请稍后重试");
					}
				});
			}
		},

		initUserPanel: function(data){
			if(data.username != null){
				mui(".account")[0].innerHTML = data.username;
			}
			mui(".user_icon img")[0].src = data.icon;
			mui(".user_info a")[0].innerHTML = "退出";
			mui("#balance")[0].innerHTML = "￥" + data.balance;
		}

	}
	user.controller();
})()

// order start
var order = {
	getOrderList: function(){
		var userId = util.getSessionStorage("uid");
		if(userId == null){
			util.toast("您还没有登录，请先登录");
			return false;
		}
		publicFunc.show("order");
		mui("#orderList")[0].innerHTML = '<div class="loading_box">\
												<i class="loading1"></i>\
												<i class="loading2"></i>\
												<i class="loading3"></i>\
											</div>';
		mui.ajax(urlUtil.getRequestUrl("getOrderList"),{
			data: {
				userId: userId
			},
			type: "post",
			dataType: "json",
			success: function(data){
				if(data.header.success){
					order.renderOrderList(data.body);
				}else{
					mui("#orderList")[0].style.cssText = 'text-align: center;\
													    font-size: 14px;\
													    color: rgba(135, 135, 135, 1);';
					mui("#orderList")[0].innerHTML = "您还没有订单~";
					util.toast(data.header.errorInfo);
				}
			},
			error: function(xhr, type, errorThrown){
				util.toast(type + "错误，获取订单列表错误，请稍后重试");
			}
		})
	},

	renderOrderList: function(data){
		var html = "";
		for(var i = 0; i < data.length; i++){
			var htmlTemplate = '<li>\
									<div class="thumbnail">\
										<img src="' + urlUtil.path + data[i].imgUrl + '" alt="">\
									</div>\
									<div class="order_content">\
										<h3>' + data[i].foodName + '</h3>\
										<p>下单时间: ' + data[i].orderDate + '</p>\
										<p>总价：￥' + data[i].payment + '</p>\
										<span>' + order.getOrderState(data[i].state) + '</span>\
									</div>\
								</li>';
			html += htmlTemplate;
		}
		mui("#orderList")[0].innerHTML = html;
	},

	getOrderState: function(state){
		state = parseInt(state);
		var result = null;
		switch(state){

			case 0:
				result = "未支付";
				break;
			case 1:
				result = "已支付";
				break;
			case -1:
				result = "已取消";
				break;
			default:
				break;
		}

		return result;
	}
}
// order end

// collect start
var collect = {
	getCollectList: function(){
		var userId = util.getSessionStorage("uid");
		if(userId == null){
			util.toast("您还没有登录，请先登录");
			return false;
		}
		mui("#collectionList")[0].innerHTML = '<div class="loading_box">\
												<i class="loading1"></i>\
												<i class="loading2"></i>\
												<i class="loading3"></i>\
											</div>';
		publicFunc.show("collection");

		mui.ajax(urlUtil.getRequestUrl("getCollectionList"), {
			data: {
				userId: userId
			},
			type: "post",
			dataType: "json",
			success: function(data){
				if(data.header.success){
					collect.renderCollectionList(data.body);
				}else{
					util.toast(data.header.errorInfo);
				}
			},
			error: function(xhr, type, errorThrown){
				util.toast(type + "错误，获取我的收藏列表错误，请稍后重试");
			}
		});
	},

	renderCollectionList: function(data){
		mui("#collectionList")[0].innerHTML = '';
		for(var i = 0; i < data.length; i++){
			var li  = document.createElement("li");
			li.setAttribute("data-classify",data[i].classify);
			li.setAttribute("data-id", data[i].id);
			var htmlTemplate = '<span class="classify">' + collect.getCollectClassify(data[i].classify) + '</span>\
								<div class="collect_introduce">\
									<h3>' + data[i].title + '</h3>\
								</div>';
			li.innerHTML = htmlTemplate;
			mui("#collectionList")[0].appendChild(li);
		}
	},

	//收藏类型转换
	getCollectClassify: function(classify){
		var result = "";
		switch(classify){
			case "food":
				result = "美食";
				break;
			case "community":
				result = "话题";
				break;
			case "recomment":
				result = "推荐";
				break;
			default :
				result = "其他";
				break;
		}
		return result;
	}
}