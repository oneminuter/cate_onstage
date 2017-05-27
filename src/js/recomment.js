(function(){
	var page = {
		controller: function(){
			page.getRecommentList();
			page.init();
		},
		init: function(){
			var clientHeight = document.documentElement.clientHeight;
			var headerHeight = mui(".mui-content header")[0].offsetHeight;
			var footerHeight = mui("#footer_menu")[0].offsetHeight;

			mui(".recomment")[0].style.height = (clientHeight - headerHeight - footerHeight) + "px";
			mui(".main")[0].style.height = (clientHeight - 26) + "px";
		},

		getRecommentList: function(){
			mui(".recomment ul")[0].innerHTML = '<div class="loading_box">\
													<i class="loading1"></i>\
													<i class="loading2"></i>\
													<i class="loading3"></i>\
												</div>';
			mui.ajax(urlUtil.getRequestUrl("getRecommentList"), {
				type: "post",
				dataType: "json",
				success: function(data){
					if(data.header.success){
						page.renderRecommentList(data.body);
					}else{
						util.toast(data.header.errorInfo);
					}
				},
				error: function(xhr, type, errorThrown){
					util.toast(type + "错误，获取推荐信息错误，请稍后重试");
				}
			});
		},
		renderRecommentList: function(data){
			mui(".recomment ul")[0].innerHTML = "";

			for(var i = 0; i < data.length; i++){
				var li = document.createElement("li");
				li.style.backgroundImage = "url(" + data[i].imgUrl.replace("\\", "/") + ")";
				var htmlTemplate = '<div class="mask"></div>\
									<label>\
										<span>' + page.getClassifyName(data[i].classify) + '</span>\
									</label>\
									<p>' + data[i].detailAddress + '</p>\
									<h1>' + data[i].name + '</h1>\
									<h2>' + data[i].address + '</h2>\
									<div class="score">\
										<span>' + data[i].score + '</span>\
										<svg class="icon icon_star" aria-hidden="true">\
											<use xlink:href="#icon-collect"></use>\
										</svg>\
									</div>';
				li.innerHTML = htmlTemplate;
				li.setAttribute("data-id", data[i].id);
				li.addEventListener("tap", function(){
					console.log("获取时");
					page.getFoodContent(this.getAttribute("data-id"));
				}, false);
				mui(".recomment ul")[0].appendChild(li);
			}
		},

		//分类名转换 英文 > 中文
		getClassifyName: function(classify){
			var result = "";
			switch(classify){
				case "shicai":
					result = "食材";
					break;
				case "shipu":
					result = "食谱";
					break;
				case "meishi":
					result = "美食";
					break
				default:
					result = "其他";
					break;
			}
			return result;
		},

		//获取食物详情
		getFoodContent: function(id){
			mui(".main")[0].innerHTML = '<div class="loading_box">\
											<i class="loading1"></i>\
											<i class="loading2"></i>\
											<i class="loading3"></i>\
										</div>';
			publicFunc.show("detail");

			mui.ajax(urlUtil.getRequestUrl("getDetail"), {
				data: {
					id: id
				},
				type: "post",
				dataType: "json",
				success: function(data){
					if(data.header.success){
						page.renderDetail(data.body);
					}else{
						util.toast(data.header.errorInfo);
					}
				},
				error: function(xhr, type, errorThrown){
					util.toast(type + "错误，获取详情错误，请稍后重试");
				}
			});
		},

		//渲染食物详情
		renderDetail: function(data){
			mui(".main")[0].innerHTML = '<div class="head">\
											<div class="thumbnail">\
												<img src="' + data.imgUrl + '" alt="">\
											</div>\
											<h1>' + data.name + '</h1>\
										</div>\
										<div class="content">\
											' + data.content + '\
										</div>';
		}
	}
	page.controller();
})()