(function () {
	var page = {
		controller: function(){
			page.init();
			page.getCommunityList();
			page.bind();
		},
		init: function(){
			var clientHeight = document.documentElement.clientHeight;
			var footerHeight = mui("#footer_menu")[0].offsetHeight;

			mui(".articleList")[0].style.height = (clientHeight-footerHeight) + "px";
			mui(".main")[0].style.height = (clientHeight - 30) + "px";
		},

		bind: function(){
			//话题列表的悬浮发表话题按钮
			mui(".publish")[0].addEventListener("tap", function(){
				if(util.getSessionStorage("uid") == null){
					util.toast("您还没有登录，请先登录");
					window.location.href = "login";
					return false;
				}
				publicFunc.show("publish_topic");
			}, false);

			//发表话题-发表按钮
			mui(".publish_btn")[0].addEventListener("tap", function(){
				publish.addTopic();
			}, false);

			//发表话题-选择分类
			var classifys = mui(".classify ul li");
			for(var i = 0; i <  classifys.length; i++){
				classifys[i].addEventListener("tap", function(){
					publish.selectedClassify(this);
				}, false);
			}
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
									<p class="from">来自话题:' + data[i].classify + '</p>\
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

var publish = {
	addTopic: function(){
		var title = util.trim( mui(".publish_title input")[0].value );
		var content = util.trim( mui(".publish_content textarea")[0].value );

		if(title == ""){
			util.toast("请输入标题");
			return false;
		}
		if(content == ""){
			util.toast("请说点什么吧");
			return false;
		}

		var userId = util.getSessionStorage("uid");
		var classify = util.trim( mui(".classify input")[0].value );

		mui.ajax(urlUtil.getRequestUrl("addTopic"), {
			data: {
				userId: userId,
				classify: classify,
				title: title,
				content: content
			},
			type: "post",
			dataType: "json",
			success: function(data){
				if(data.header.success){
					publish.addTopicToCommunityList(data.body);
				}else{
					util.toast(data.header.errorInfo);
				}
			},
			error: function(xhr, type, errorThrown){
				util.toast(type + "错误，添加话题错误，请稍后重试");
			}
		})
	},

	//选择发布话题的分类
	selectedClassify: function(ele){
		var classifys = mui(".classify ul li");
		for(var i = 0; i < classifys.length; i++){
			classifys[i].className = "";
		}
		ele.className = "selected";
		mui(".classify input")[0].value = ele.innerHTML;
	},

	//发表话题成功之后，将发布的话题显示到话题列表的前面
	addTopicToCommunityList: function(data){
		var li = document.createElement("li");
		li.setAttribute("data-id", data.id);
		var htmlTemplate = '<div class="user_icon">\
								<img src="' + data.authorIcon + '" alt="">\
							</div>\
							<p class="from">来自话题:' + data.classify + '</p>\
							<h1>' + data.title + '</h1>\
							<p class="desc">' + data.introduce + '</p>\
							<span class="data_analysis">' + data.view + '浏览.' + data.commentNum + '评论</span>';
		li.innerHTML = htmlTemplate;
		li.addEventListener("tap", function(){
			page.getTopicContent(this.getAttribute("data-id"));
		}, false);
		mui(".articleList ul")[0].insertBefore(li, mui(".articleList ul li")[0]);

		//清空输入 > 关闭发表按钮
		mui(".classify input")[0].value = "美食";
		mui(".publish_title input")[0].value = "";
		mui(".publish_content textarea")[0].value = "";
		publicFunc.hidden("publish_topic");
	}
}