(function(){
	var page = {
		controller: function(){
			//处事话轮播
			page.initSlide();
			page.getFoodList();
			page.bind();
		},
		
		//轮播初始化
		initSlide:function(){
			mui.ajax(urlUtil.getRequestUrl("initSlid"), {
				async: true,
				dataType: "json",
				type:"post",
				success:function(data){
					if(data.header.success){
						page.renderSlide(data.body);
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
		 			page.selectClassify(this);
		 		}, false);
		 	}

		 	//排序方式
		 	var cells = mui("#orderMethor .mui-table-view-cell");
		 	for(var j = 0; j < cells.length; j++){
		 		cells[j].addEventListener("tap", function(){
		 			document.querySelector(".order_methor > a").innerHTML = this.querySelector("a").innerHTML;
		 			mui.trigger(document.querySelector(".mui-backdrop"), 'tap');
		 		}, false);
		 	}

		 	//详情页返回按钮 > 关闭详情页
		 	mui(".closeDetailPannel")[0].addEventListener("tap", function(){
		 		mui(".detail")[0].style.display = "none";
		 	}, false);

		 	//购买份数计算总价
		 	mui(".mui-btn-numbox-minus")[0].addEventListener("tap", function(){
		 		page.countPrice(0); //0 表示减
		 	}, false);
		 	mui(".mui-btn-numbox-plus")[0].addEventListener("tap", function(){
		 		page.countPrice(1); //1 表示加
		 	}, false);
		 	mui(".mui-input-numbox")[0].addEventListener("change", function(){
		 		page.countPrice();
		 	}, false);
		},

		//选中分类
		selectClassify: function(ele){
			var classifys = mui(".classify_title_item");
			for(var i = 0; i < classifys.length; i++){
				classifys[i].className = "classify_title_item";
			}
			ele.className = "classify_title_item active";
			page.getFoodList(ele.getAttribute("data-classify"));
		},

		//获取分类列表
		getFoodList: function(classify){
			classify = classify || "meishi";
			mui.ajax(urlUtil.getRequestUrl("getFoodList"), {
				data:{
					classify: classify
				},
				async: true,
				dataType: "json",
				type:"post",
				success:function(data){
					if(data.header.success){
						page.renderFoodList(data.body);
					}else{
						util.toast(data.header.errorInfo);
					}
				},
				error:function(xhr,type,errorThrown){
					util.toast(type + "错误，初始化banner错误，请稍后重试");
				}
			});
		},

		//渲染美食列表
		renderFoodList: function(data){
			var html = "";
			for(var i = 0; i < data.length; i++){
				var htmlTemplate = "";
				if(data[i].classify == "meishi"){
					htmlTemplate = ['<li id="' + data[i].id + '" data-classify="' + data[i].classify + '">',
										'<div class="thumbnail">',
											'<img src="'+ urlUtil.path + data[i].imgUrl +'" alt="">',
										'</div>',
										'<div class="introduce">',
											'<h2>'+ data[i].name +'</h2>',
											'<p>'+ data[i].detailAddress +'</p>',
											'<h3>￥<span>'+ data[i].price +'</span></h3>',
											'<h4>满'+ data[i].reachPrice +'减'+ data[i].favorablePrice +'</h4>',
											// '<span class="score">'+ data[i].score +'分</span>',
										'</div>',
									'</li>'].join("");
				}else{
					htmlTemplate = ['<li id="' + data[i].id + '" data-classify="' + data[i].classify + '">',
										'<div class="thumbnail">',
											'<img src="'+ urlUtil.path + data[i].imgUrl +'" alt="">',
										'</div>',
										'<div class="introduce">',
											'<h2 style="line-height: 80px;font-size: 22px;">'+ data[i].name +'</h2>',
											// '<span class="score">'+ data[i].score +'分</span>',
										'</div>',
									'</li>'].join("");
				}
				html += htmlTemplate;
			}
			document.querySelector(".list_item_ul").innerHTML = html;
			//添加点击事件
			var lis = document.querySelectorAll(".list_item_ul li");
			for(var j = 0; j < lis.length; i++){
				lis[j].onclick = function(){
					if(this.getAttribute("data-classify") != "meishi"){
						//跳到教程
					}else{
						mui(".detail").style.display = "block";
					}
				}
			}
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
			mui(".cart h4 span")[0].innerHTML = totalPrice;

			if(number > 0){
				mui(".cart")[0].className = "cart settlement";
				mui(".cart a")[0].innerHTML = "去结算"
			}else{
				mui(".cart")[0].className = "cart";
				mui(".cart a")[0].innerHTML = "加入购物车"
			}
		}
	};
	page.controller();
})()
