(function(){
	var index = {
		controller: function(){
			//处事话轮播
			index.initSlide();
			// index.getFoodList();  //两个同时请求会导致resultSet关闭异常
			index.bind();
		},
		
		//轮播初始化
		initSlide:function(){
			mui.ajax(urlUtil.getRequestUrl("initSlid"), {
				dataType: "json",
				type:"post",
				success:function(data){
					if(data.header.success){
						index.renderSlide(data.body);
						index.getFoodList(); //解决：两个同时请求会导致resultSet关闭异常
					}else{
						util.toast(data.header.errorInfo);
					}
				},
				error:function(xhr,type,errorThrown){
					util.toast(type + "错误，初始化banner错误，请稍后重试");
				}
			});
		},
		
		//渲染轮播
		renderSlide:function(data){
			var html = "";
			for(var i = 0; i < data.length; i++){
				var htmlTemplate = ['<div class="mui-slider-item">',
								    	'<a href="' + data[i].linkUrl + '">',
								    		'<img src="' + urlUtil.path + data[i].imgUrl + '" />',
								    	'</a>',
								    '</div>'].join("");
				html += htmlTemplate;

				//添加点指示器
				var div = document.createElement("div");
				div.className = (i == 0) ? "mui-indicator mui-active" : "mui-indicator";
				document.querySelector(".mui-slider-indicator").appendChild(div);
			}
			if(data.length > 1){
				var firstSlide = ['<div class="mui-slider-item">',
								    	'<a href="' + data[data.length-1].linkUrl + '">',
								    		'<img src="' + urlUtil.path + data[data.length-1].imgUrl + '" />',
								    	'</a>',
								    '</div>'].join("");
				var lastSlide = ['<div class="mui-slider-item">',
								    	'<a href="' + data[0].linkUrl + '">',
								    		'<img src="' + urlUtil.path + data[0].imgUrl + '" />',
								    	'</a>',
								    '</div>'].join("");

				html = firstSlide + html +lastSlide;
			}	
			document.querySelector("#slideGroup").innerHTML = html;

			//获得slider插件对象
			var gallery = mui('.mui-slider.banner');
			gallery.slider({
			  interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
			});
		},

		//事件绑定
		bind: function(){
			//分类
			var classItems = mui(".classify_title_item");
		 	for(var i = 0; i < classItems.length; i++){
		 		classItems[i].addEventListener("tap", function(){
		 			index.selectClassify(this);
		 		}, false);
		 	}

		 	//排序方式
		 	var cells = mui("#orderMethor .mui-table-view-cell");
		 	for(var i = 0; i < cells.length; i++){
		 		cells[i].addEventListener("tap", function(){
		 			document.querySelector(".order_methor > a").innerHTML = this.querySelector("a").innerHTML;
		 			mui.trigger(document.querySelector(".mui-backdrop"), 'tap');
		 		}, false);
		 	}

		 	//添加收货地址-选择性别
		 	var lis = mui("#receiverGender li");
		 	for(var i = 0; i < lis.length; i++){
		 		lis[i].addEventListener("tap", function(){
		 			address.selectGender(this);
		 		}, false);
		 	}

		 	//选择支付方式
		 	var methods = mui(".selectPayMethod > ul li");
		 	for(var i = 0; i < methods.length; i++){
		 		methods[i].addEventListener("tap", function(){
		 			selectPayMethod.select(this);
		 		}, false);
		 	}

		 	//用餐人数
		 	var peopelNumbers = mui(".people_number ul li");
		 	for(var i = 0; i < peopelNumbers.length; i++){
		 		peopelNumbers[i].addEventListener("tap", function(){
		 			peopleNumber.select(this);
		 		}, false);
		 	}

		 	//口味偏好备注
		 	var remarks = mui(".remark ul li");
		 	for(var i = 0; i < remarks.length; i++){
		 		remarks[i].addEventListener("tap", function(){
		 			remark.select(this);
		 		}, false);
		 	}

		},

		//选中分类
		selectClassify: function(ele){
			var classifys = mui(".classify_title_item");
			for(var i = 0; i < classifys.length; i++){
				classifys[i].className = "classify_title_item";
			}
			ele.className = "classify_title_item active";
			index.getFoodList(ele.getAttribute("data-classify"));
		},

		//获取分类列表
		getFoodList: function(classify){
			classify = classify || "meishi";
			mui.ajax(urlUtil.getRequestUrl("getFoodList"), {
				data: {
					classify: classify
				},
				dataType: "json",
				type:"post",
				success:function(data){
					if(data.header.success){
						mui(".list_item_ul")[0].innerHTML = "";
						index.renderFoodList(data.body);
					}else{
						util.toast(data.header.errorInfo);
					}
				},
				error:function(xhr,type,errorThrown){
					util.toast(type + "错误，获取食物列表，请稍后重试");
				}
			});
		},

		//渲染美食列表
		renderFoodList: function(data){
			var html = "";
			for(var i = 0; i < data.length; i++){
				var htmlTemplate = "";
				var li = document.createElement("li");

				li.id = data[i].id;
				li.setAttribute("data-classify", data[i].classify);

				if(data[i].classify == "meishi"){
					htmlTemplate = ['<div class="thumbnail">',
										'<img src="'+ urlUtil.path + data[i].imgUrl +'" alt="">',
									'</div>',
									'<div class="introduce">',
										'<h2>'+ data[i].name +'</h2>',
										'<p>'+ data[i].detailAddress +'</p>',
										'<h3>￥<span>'+ data[i].price +'</span></h3>',
										'<h4>满'+ data[i].reachPrice +'减'+ data[i].favorablePrice +'</h4>',
										// '<span class="score">'+ data[i].score +'分</span>',
									'</div>'].join("");
				}else{
					htmlTemplate = ['<div class="thumbnail">',
										'<img src="'+ urlUtil.path + data[i].imgUrl +'" alt="">',
									'</div>',
									'<div class="introduce">',
										'<h2 style="line-height: 80px;font-size: 22px;">'+ data[i].name +'</h2>',
										// '<span class="score">'+ data[i].score +'分</span>',
									'</div>'].join("");
				}

				li.innerHTML = htmlTemplate;
				li.addEventListener("tap", function(){
					if(this.getAttribute("data-classify") != "meishi"){
						console.log("教程");
					}else{
						//获取详情
						detailFunc.getDetail(this.id);
					}
				}, false);
					
				mui(".list_item_ul")[0].appendChild(li);
			}
		}
	};
	index.controller();
})()


//公共方法
var publicFunc = {
	//显示面板
	show: function(targetElement){
		mui("."+targetElement)[0].style.display = "block";
	},

	//隐藏面板
	hidden: function(targetElement){
		mui("."+targetElement)[0].style.display = "none";
	}
}


//详情页
var detailFunc = {
	//获取详情
	getDetail: function(id){
		mui(".detail")[0].style.display = "block";
		mui(".detail")[0].innerHTML = '<a href="publicFunc.hidden(\'detail\')" class="closeDetailPannel">\
											<svg class="icon icon_left" aria-hidden="true">\
												<use xlink:href="#icon-left"></use>\
											</svg>\
										</a>\
										<a href="javascript:;" class="share">\
											<svg class="icon icon_share" aria-hidden="true">\
												<use xlink:href="#icon-share"></use>\
											</svg>\
										</a>\
										<div class="loading_box">\
											<i class="loading1"></i>\
											<i class="loading2"></i>\
											<i class="loading3"></i>\
										</div>';
		mui.ajax(urlUtil.getRequestUrl("getDetail"), {
			data: {
				id: id
			},
			dataType: "json",
			type:"post",
			success:function(data){
				if(data.header.success){
					detailFunc.renderdetail(data.body);
				}else{
					util.toast(data.header.errorInfo);
				}
			},
			error:function(xhr,type,errorThrown){
				util.toast(type + "错误，获取食物列表，请稍后重试");
			}
		});
	},

	//渲染详情页
	renderdetail: function(data){
		var html = ['<a href="javascript:publicFunc.hidden(\'detail\')" class="closeDetailPannel">',
						'<svg class="icon icon_left" aria-hidden="true">',
							'<use xlink:href="#icon-left"></use>',
						'</svg>',
					'</a>',
					'<a href="javascript:;" class="share">',
						'<svg class="icon icon_share" aria-hidden="true">',
							'<use xlink:href="#icon-share"></use>',
						'</svg>',
					'</a>',
					'<div class="foodImg">',
						'<img src="' + data.imgUrl + '" alt="">',
					'</div>',
					'<div class="detail_content">',
						'<h2>' + data.name + '</h2>',
						'<span class="price">￥<span>' + data.price + '</span></span>',
						'<h3>购买份数</h3>',
						'<div class="mui-numbox" data-numbox-min="0">',
							'<button class="mui-btn mui-btn-numbox-minus" type="button" onclick="detailFunc.countPrice(0)">-</button>',
							'<input id="buyNumber" class="mui-input-numbox" type="number" value="0">',
							'<button class="mui-btn mui-btn-numbox-plus" type="button" onclick="detailFunc.countPrice(1)">+</button>',
						'</div>',
						'<h5>商品详情</h5>',
						'<p>' + data.content + '</p>',
						'<div class="cart">',
							'<svg class="icon icon_cart" aria-hidden="true">',
							   '<use xlink:href="#icon-cart"></use>',
							'</svg>',
							'<h4>￥<span>0</span></h4>',
							'<a href="javascript:detailFunc.addTocart(' + data.id + ')" id="addToCartBtn">加入购物车</a>',
						'</div>',
					'</div>'].join("");
		mui(".detail")[0].innerHTML = html;
	},

	//计算总价格:
	countPrice: function(operate){
		operate = ( typeof operate == "undefined" ? -1 : operate);
		var number = parseInt( mui(".mui-input-numbox")[0].value );
		var unitPrice = mui(".price span")[0].innerHTML;
		if(operate == 0){
			number = (number == 0 ? 0 : number - 1);
		}else if(operate == 1){
			number += 1;
		}else{
			number = number;
		}
		var totalPrice = number * unitPrice;
		mui("#buyNumber")[0].value = number;
		mui(".cart h4 span")[0].innerHTML = totalPrice;

		if(number > 0){
			mui(".cart")[0].className = "cart settlement";
			mui(".cart a")[0].innerHTML = "去结算"
		}else{
			mui(".cart")[0].className = "cart";
			mui(".cart a")[0].innerHTML = "加入购物车"
		}
	},

	//加入购物车 / 去结算
	addTocart: function(id){
		var number = mui(".mui-input-numbox")[0].value;
		if(number == 0){
			detailFunc.countPrice(1);
			mui(".mui-input-numbox")[0].value = 1;
		}else{
			checkFunc.getCheckInfo(id, number);
		}
	}
} 
//detailFunc end

// checkFunc start
var checkFunc = {
	getCheckInfo: function(id, number){
		mui(".check")[0].style.display = "block";
		mui(".check")[0].innerHTML = '<header>\
											<a href="javascript:publicFunc.hidden(\'check\');" class="closeCheckPannel">\
												<svg class="icon icon_left" aria-hidden="true">\
													<use xlink:href="#icon-left"></use>\
												</svg>\
											</a>\
											<h3>提交订单</h3>\
										</header>\
										<div class="loading_box">\
											<i class="loading1"></i>\
											<i class="loading2"></i>\
											<i class="loading3"></i>\
										</div>';
		mui.ajax(urlUtil.getRequestUrl("getCheckInfo"), {
			data: {
				id: id,
				number: number
			},
			type: "post",
			dataType: "json",
			success: function(data){
				if(data.header.success){				
					checkFunc.renderCheck(data.body);
				}else{
					util.toast(data.header.errorInfo);
				}
			},
			error: function(xhr,type,errorThrown){
				util.toast(type + "错误，获取订单错误，请稍后重试");
			}
		});
	},

	//渲染订单
	renderCheck: function(data){
		var html = '<header>\
						<a href="javascript:publicFunc.hidden(\'check\');" class="closeCheckPannel">\
							<svg class="icon icon_left" aria-hidden="true">\
								<use xlink:href="#icon-left"></use>\
							</svg>\
						</a>\
						<h3>提交订单</h3>\
					</header>\
					<div class="addressContainer" onclick="address.getAddressList()">'
					+ ( util.getSessionStorage("address") == null ? "<span class='l_text'>选择收货地址</span>" : "<span class='selected_address'>" + util.getSessionStorage("address").replace("\n","<br/>") + "</span>" ) +
						'<span class="r_text ' + ( util.getSessionStorage("address") != null ? "vertical_center" : "" ) + '">\
							<svg class="icon icon_right" aria-hidden="true">\
								<use xlink:href="#icon-right"></use>\
							</svg>\
						</span>\
					</div>\
					<div class="check_row" onclick="publicFunc.show(\'selectPayMethod\')">\
						<span class="l_text">支付方式</span>\
						<span class="r_text" id="paymethod">\
							在线支付\
							<svg class="icon icon_right" aria-hidden="true">\
								<use xlink:href="#icon-right"></use>\
							</svg>\
						</span>\
					</div>\
					<div class="check_row">\
						<span class="l_text">代金券</span>\
						<span class="r_text">￥' + data.cash + '</span>\
					</div>\
					<div class="check_row border_top">\
						<span class="l_text">' + data.storeName + '</span>\
						<span class="r_text">由商家配送</span>\
					</div>\
					<div class="check_row">\
						<span class="l_text">' + data.foodName + '</span>\
						<span class="c_text">x' + data.buyNumber + '</span>\
						<span class="r_text">￥'+ data.foodCost +'</span>\
					</div>\
					<div class="check_row">\
						<span class="l_text">餐盒费</span>\
						<span class="r_text">￥' + data.packFee + '</span>\
					</div>\
					<div class="check_row">\
						<span class="l_text">配送费</span>\
						<span class="r_text">￥' + data.freight + '</span>\
					</div>\
					<div class="check_row">\
						<span class="l_text">满减优惠</span>\
						<span class="r_text">-￥'+ data.favorablePrice +'</span>\
					</div>\
					<div class="check_row">\
						<span class="l_text">总计￥'+ data.totalCost +' （已优惠￥' + data.favorablePrice + '，代金券￥' + data.cash + '）</span>\
						<span class="r_text">待支付￥' + data.payment + '</span>\
					</div>\
					<div class="check_row border_top" id="peopleNumber" onclick="publicFunc.show(\'people_number\')">\
						<span class="l-text">用餐人数: ' + data.peopleNumber + '</span>\
						<span class="r_text">\
							以便商家给您带够餐具\
							<svg class="icon icon_right" aria-hidden="true">\
								<use xlink:href="#icon-right"></use>\
							</svg>\
						</span>\
					</div>\
					<div class="check_row" onclick="publicFunc.show(\'remark\')">\
						<span class="l_text">备注</span>\
						<span class="r_text">\
							口味，偏好要求等\
							<svg class="icon icon_right" aria-hidden="true">\
								<use xlink:href="#icon-right"></use>\
							</svg>\
						</span>\
					</div>\
					<div class="payment">\
						￥' + data.payment + ' <span>(已优惠￥' + data.favorablePrice + ')</span>\
						<a href="javascript:;">提交订单</a>\
					</div>';
		mui(".check")[0].innerHTML = html;
	}
}
// checkFunc end

var address = {
	//添加收货地址 - 保存收货地址
	save: function(){
		// var userId = util.setSessionStorage("userId"); //*****************************************需要完善*/
		var userId = 1;
		var receiverName = mui("#receiverName")[0].value;
		var receiverGender = mui("#receiverGender")[0].getAttribute("data-receiverGender");
		var phone = mui("#receiverPhone")[0].value;
		var province = mui("#province")[0].value;
		var detailAddress = mui("#detailAdress")[0].value;

		if( util.trim(province) == "" ){
			util.toast("请输入地址");
			return false;
		} else if ( util.trim(detailAddress) == "" ){
			util.toast("请输入楼号");
			return false;
		} else if ( util.trim(phone) == "" ){
			util.toast("请输入收货人手机号，方便配送员联系你");
			return false;
		} else {
			mui.ajax(urlUtil.getRequestUrl("addReceiveAddress"), {
				data: {
					userId: userId,
					province: province,
					detailAddress: detailAddress,
					receiverName: receiverName,
					receiverGender: receiverGender,
					phone: phone
				},
				type: "post",
				dataType: "json",
				success: function(data){
					if(data.header.success){
						util.toast("保存成功");

						var inputs = mui(".add_address input");
						for(var i = 0; i < inputs.length; i++){
							inputs[i].value = "";
						}

						address.getAddressList();
					}else{
						util.toast(data.header.errorInfo);
					}
				},
				error: function(xhr,type,errorThrown ){
					util.toast(type + "错误，保存地址错误，请稍后重试");
				}
			});
		}
	},

	//选择收货地址 - 获取收货地址
	getAddressList: function(){
		mui(".add_address")[0].style.display = "none";
		mui(".selectAdress")[0].style.display = "block";
		mui(".selectAdress")[0].innerHTML = '<header>\
												<a href="javascript:publicFunc.hidden(\'selectAdress\');" class="closeSelectAdress">\
													<svg class="icon icon_left" aria-hidden="true">\
														<use xlink:href="#icon-left"></use>\
													</svg>\
												</a>\
												<h3>选择收货地址</h3>\
											</header>\
											<div class="loading_box">\
												<i class="loading1"></i>\
												<i class="loading2"></i>\
												<i class="loading3"></i>\
											</div>';
		mui.ajax(urlUtil.getRequestUrl("getAddressList"), {
			data: {
				// userId: util.setSessionStorage("userid")
				userId: 1
			},
			type: "post",
			dataType: "json",
			success: function(data){
				if(data.header.success){
					address.renderSelectAdress(data.body);
				}else{
					util.toast(data.header.success);
				}
			},
			error: function(xhr, type, errorThrown){
				util.toast(type + "错误，获取地址列表错误，请稍后重试");
			}
		})
	},

	//渲染选择地址列表面板
	renderSelectAdress: function(data){
		var html = '<header>\
						<a href="javascript:publicFunc.hidden(\'selectAdress\');" class="closeSelectAdress">\
							<svg class="icon icon_left" aria-hidden="true">\
								<use xlink:href="#icon-left"></use>\
							</svg>\
						</a>\
						<h3>选择收货地址</h3>\
					</header>\
					<div class="addAdress" onclick="publicFunc.show(\'add_address\')">\
						<span class="l_text">新增收货地址</span>\
					</div>';
		mui(".selectAdress")[0].innerHTML = html;
		var ul = document.createElement("ul");
		ul.className = "address_list";
		for(var i = 0; i < data.length; i++){
			var li = document.createElement("li");
			// i == 0 ? li.className = "selected" : "";
			li.innerHTML = '<span></span>\
							<div class="addressDetail">\
								<p>\
									<span>' + data[i].province + '</span>\
									<span>' + data[i].detailAddress + '</span>\
								</p>\
								<p>\
									<span>' + data[i].receiverName + '</span>\
								 	<span>' + ( data[i].receiverGender == 1 ? "先生" : "女士" )+ '</span>\
								 	<span>' + data[i].phone + '</span>\
								</p>\
							</div>';
			li.addEventListener("tap", function(){
				address.selectAdresss(this);
			}, false);
			ul.appendChild(li);
		}

		mui(".selectAdress")[0].appendChild(ul);
	},

	//添加收货地址-选择性别
	selectGender: function(target){
		var lis = mui("#receiverGender li");
		for(var i = 0; i < lis.length; i++){
			lis[i].className = "";
		}
		target.className = "selected";
		target.parentNode.setAttribute("data-receiverGender", target.getAttribute("data-gender"));
	},

	//选择地址
	selectAdresss: function(target){
		var  lis = mui(".address_list li");
		for(var i = 0; i < lis.length; i++){
			lis[i].className = "";
		}
		target.className = "selected";
		util.setSessionStorage("address", target.innerText);	
		mui(".addressContainer")[0].innerHTML = '<span>' + target.innerText.replace("\n", "<br/>") + '</span>\
												<span class="r_text vertical_center">\
													<svg class="icon icon_right" aria-hidden="true">\
														<use xlink:href="#icon-right"></use>\
													</svg>\
												</span>';
		var timer = setTimeout(function(){
			publicFunc.hidden("selectAdress");
			clearTimeout(timer);
		}, 500);
	}
}

//选择支付方式
var selectPayMethod = {
	//选择
	select: function(target){
		var methods = mui(".selectPayMethod > ul li");
		for(var i = 0; i < methods.length; i++){
			methods[i].className = "";
		}
		target.className = "selected";
		mui("#paymethod")[0].innerHTML = target.innerText +
										'<svg class="icon icon_right" aria-hidden="true">\
											<use xlink:href="#icon-right"></use>\
										</svg>';
		var timer = setTimeout(function(){
			publicFunc.hidden("selectPayMethod");
			clearTimeout(timer);
		}, 500);
	}
}

var peopleNumber = {
	otherNumber: function(){
		var number = mui(".other_number")[0].querySelector("input").value;
		if(util.trim(number) == "" || number < 1){
			return false;
		}else{
			mui("#peopleNumber")[0].innerHTML = '<span class="l-text">用餐人数: ' + number + '</span>\
											<span class="r_text">\
												<svg class="icon icon_right" aria-hidden="true">\
													<use xlink:href="#icon-right"></use>\
												</svg>\
											</span>';
			var timer = setTimeout(function(){
				publicFunc.hidden("people_number");
				console.log(mui(".other_number a")[0]);
				mui(".other_number input")[0].value = "";
			}, 500);
		}
	},

	select: function(target){
		var lis = mui(".people_number ul li");
		for(var i = 0; i < lis.length; i++){
			lis[i].className = "";
		}
		target.className = "selected";
		var timer = setTimeout(function(){
			target.className = "";
			mui("#peopleNumber")[0].innerHTML = '<span class="l-text">用餐人数: ' + util.trim(target.innerHTML).substr(0, util.trim(target.innerHTML).length-1) + '</span>\
											<span class="r_text">\
												<svg class="icon icon_right" aria-hidden="true">\
													<use xlink:href="#icon-right"></use>\
												</svg>\
											</span>';
			publicFunc.hidden("people_number");
		}, 500);
	}
}

var remark = {
	select: function(target){
		var selected = target.className == "selected";
		var mark = util.trim( mui(".otherRemark textarea")[0].value );
		if( !selected ){
			target.className = "selected";
			console.log(mark.indexOf(target.innerHTML));
			if( mark.indexOf(target.innerHTML) == -1 ){
				mui(".otherRemark textarea")[0].value = util.trim( mui(".otherRemark textarea")[0].value ) + " " + target.innerHTML;
			}
		}else{
			target.className = "";
			mui(".otherRemark textarea")[0].value = util.trim( mui(".otherRemark textarea")[0].value.replace(target.innerHTML, "") );
		}
	}
}