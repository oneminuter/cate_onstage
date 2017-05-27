(function () {
	var page = {
		controller: function(){
			page.init();
			page.getCommunityList();
		},
		init: function(){
			var clientHeight = document.documentElement.clientHeight;
			var footerHeight = mui("#footer_menu")[0].offsetHeight;

			mui(".articleList")[0].style.height = (clientHeight-footerHeight) + "px";
			mui(".main")[0].style.height = (clientHeight - 30) + "px";
		},

		//获取社区话题
		getCommunityList: function(){
			mui(".articleList ul")[0].innerHTML = '<div class="loading_box">\
													<i class="loading1"></i>\
													<i class="loading2"></i>\
													<i class="loading3"></i>\
												</div>';
			mui.ajax(urlUtil.getRequestUrl("getCommunityList") ,{
				type: "post",
				dataType: "json",
				success: function(data){
					if(data.header.success){
						page.renderCommunity(data.body);
					}else{
						util.toast(data.header.errorInfo);
					}
				},
				error: function(xhr, type, errorThrown){
					util.toast(type + "错误，获取话题列表错误，请稍后重试");
				}
			});
		},

		//获取社区话题列表
		renderCommunity: function(data){
			mui(".articleList ul")[0].innerHTML = "";
			for(var i = 0; i < data.length; i++){
				var li = document.createElement("li");
				li.setAttribute("data-id", data[i].id);
				var htmlTemplate = '<div class="user_icon">\
										<img src="' + data[i].authorIcon + '" alt="">\
									</div>\
									<p class="from">来自话题:' + data[i].topic + '</p>\
									<h1>' + data[i].title + '</h1>\
									<p class="desc">' + data[i].introduce + '</p>\
									<span class="data_analysis">' + data[i].view + '浏览.' + data[i].commentNum + '评论</span>';
				li.innerHTML = htmlTemplate;
				li.addEventListener("tap", function(){
					page.getTopicContent(this.getAttribute("data-id"));
				}, false);
				mui(".articleList ul")[0].appendChild(li);
			}
		},

		//获取话题内容
		getTopicContent: function(id){
			publicFunc.show("topic_detail");
			mui(".topic_detail .main")[0].innerHTML = '<div class="loading_box">\
															<i class="loading1"></i>\
															<i class="loading2"></i>\
															<i class="loading3"></i>\
														</div>';
			mui.ajax(urlUtil.getRequestUrl("getTopicDetail") ,{
				data:{
					topicId: id
				},
				type: "post",
				dataType: "json",
				success: function(data){
					if(data.header.success){
						page.renderTopicDetail(data.body);
					}else{
						util.toast(data.header.errorInfo);
					}
				},
				error: function(xhr, type, errorThrown){
					util.toast(type + "错误，获取话题详情错误，请稍后重试");
				}
			});
		},

		//渲染话题详情
		renderTopicDetail: function(data){
			var htmlTemplate = '<h1>' + data.title + '</h1>\
								<div class="user_icon">\
									<img src="' + data.authorIcon + '" alt="">\
								</div>\
								<span class="author">' + data.author + '</span>\
								<span class="publish_date float_right">' + data.publishDate + '</span>\
								<div class="content">\
									' + data.content + '\
								</div>';
			mui(".topic_detail .main")[0].innerHTML = htmlTemplate;
		}
	}
	page.controller();
})()