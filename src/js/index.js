(function(){
	var index = {
		controller: function(){
			//处事话轮播
			index.initSlide();
			index.getFoodList();
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
					console.log(data.body);					
					// checkFunc.renderCheck(data.body);
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
					<div class="addressContainer" onclick="show(\'selectAdress\')">\
						<span class="l_text">选择收货地址</span>\
						<span class="r_text">\
							<svg class="icon icon_right" aria-hidden="true">\
								<use xlink:href="#icon-right"></use>\
							</svg>\
						</span>\
					</div>\
					<div class="check_row" onclick="show(\'selectPayMethod\')">\
						<span class="l_text">支付方式</span>\
						<span class="r_text">\
							在线支付\
							<svg class="icon icon_right" aria-hidden="true">\
								<use xlink:href="#icon-right"></use>\
							</svg>\
						</span>\
					</div>\
					<div class="check_row">\
						<span class="l_text">代金券</span>\
						<span class="r_text">￥4</span>\
					</div>\
					<div class="check_row border_top">\
						<span class="l_text">吉祥淳（营养套餐，刚翻蒸饺）</span>\
						<span class="r_text">由商家配送</span>\
					</div>\
					<div class="check_row">\
						<span class="l_text">一荤两素套餐</span>\
						<span class="c_text">x1</span>\
						<span class="r_text">￥16</span>\
					</div>\
					<div class="check_row">\
						<span class="l_text">餐盒费</span>\
						<span class="r_text">￥1.5</span>\
					</div>\
					<div class="check_row">\
						<span class="l_text">配送费</span>\
						<span class="r_text">￥4</span>\
					</div>\
					<div class="check_row">\
						<span class="l_text">满减优惠</span>\
						<span class="r_text">-￥3</span>\
					</div>\
					<div class="check_row">\
						<span class="l_text">总计￥17.5 已优惠￥3</span>\
						<span class="r_text">待支付￥14</span>\
					</div>\
					<div class="check_row border_top">\
						<span class="l-text">用餐人数</span>\
						<span class="r_text">\
							以便商家给您带够餐具\
							<svg class="icon icon_right" aria-hidden="true">\
								<use xlink:href="#icon-right"></use>\
							</svg>\
						</span>\
					</div>\
					<div class="check_row">\
						<span class="l_text">备注</span>\
						<span class="r_text">\
							口味，偏好要求等\
							<svg class="icon icon_right" aria-hidden="true">\
								<use xlink:href="#icon-right"></use>\
							</svg>\
						</span>\
					</div>\
					<div class="payment">\
						￥14.5 <span>(已优惠￥3)</span>\
						<a href="javascript:;">提交订单</a>\
					</div>';
	}
}
// checkFunc end