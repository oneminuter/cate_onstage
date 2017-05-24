// order start
var order = {
	getOrderList: function(){
		publicFunc.show("order");
		mui("#orderList")[0].innerHTML = '<div class="loading_box">\
												<i class="loading1"></i>\
												<i class="loading2"></i>\
												<i class="loading3"></i>\
											</div>';
		var userId = util.getSessionStorage("uid");
		if(userId == "undefined"){
			console.log("请先登录");
		}
		mui.ajax(urlUtil.getRequestUrl("getOrderList"),{
			data: {
				userId: 0
			},
			type: "post",
			dataType: "json",
			success: function(data){
				if(data.header.success){
					order.renderOrderList(data.body);
				}else{
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