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
					topic.getTopicContent(this.getAttribute("data-id"));
				}, false);
				mui(".articleList ul")[0].appendChild(li);
			}
		}
	}
	page.controller();
})()

var topic = {
	//获取话题内容
	getTopicContent: function(id){
		mui("#collection_topic")[0].setAttribute("href", "javascript:topic.addCollection(" + id + ");");
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
					topic.renderTopicDetail(data.body);
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
		comment.getTopicCommentList(data.id);
	},

	//收藏话题
	addCollection: function(topicId){
		var userId = util.getSessionStorage("uid");
		if(userId == null){
			util.toast("您还没有登录，登录之后就可以轻松收藏啦啦");
			window.location.href = "user";
		}

		mui.ajax(urlUtil.getRequestUrl("addTopicCollect"),{
			data: {
				userId: userId,
				topicId: topicId
			},
			type: "post",
			dataType: "json",
			success: function(data){
				if(data.header.success){
					util.toast("收藏成功，可以在个人中心 > 我的收藏中查看了");
				}else{
					util.toast(data.header.errorInfo);
				}
			},
			error: function(xhr, type, errorThrown){
				util.toast(type + "错误，收藏错误，请稍后重试");
			}
		});
	}
}

var publish = {
	testt: function(){
		console.log("test");
	},
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
			topic.getTopicContent(this.getAttribute("data-id"));
		}, false);
		mui(".articleList ul")[0].insertBefore(li, mui(".articleList ul li")[0]);

		//清空输入 > 关闭发表按钮
		mui(".classify input")[0].value = "美食";
		mui(".publish_title input")[0].value = "";
		mui(".publish_content textarea")[0].value = "";
		publicFunc.hidden("publish_topic");
	}
}

//评论留言
var comment = {
	addComment: function(topicId){
		var content = util.trim( mui(".input_container textarea")[0].value );
		if( content == "" ){
			util.toast("请输入点什么吧");
			return false;
		}
		var userId = util.getSessionStorage("uid");
		mui.ajax(urlUtil.getRequestUrl("addComment"), {
			data: {
				topicId: topicId,
				userId: userId,
				content: content
			},
			type: "post",
			dataType: "json",
			success: function(data){
				if(data.header.success){
					mui(".input_container textarea")[0].value = "";
					comment.insertComment(data.body);
				}else{
					util.toast(data.header.errorInfo);
				}
			},
			error: function(xhr, type, errorThrown){
				util.toast(type + "错误，评论错误，请稍后重试");
			}
		})

	},

	//检查登录状态
	checkLogin: function(){
		if( util.getSessionStorage("uid") == null ){
			util.toast("您还没有登录，请先登录");
			window.location.href = "user";
		}
	},

	//评论成功后，插入一条评论
	insertComment: function(data){
		var li = document.createElement("li");
		var htmlTemplate = '<div class="user_icon">\
						<img src="' + data.userIcon + '" alt="">\
					</div>\
					<h4>' + (data.username != "" ? data.username : data.phone)  + '</h4>\
					<p>' + data.content+ '</p>\
					<span>' + data.time + '</span>';
		li.innerHTML = htmlTemplate;
		console.log(mui(".comment_list ul li")[0]);
		mui(".comment_list ul")[0].insertBefore(li, mui(".comment_list ul li")[0]);
	},

	//获取评论列表
	getTopicCommentList: function(topicId){
		var div = document.createElement("div");
		div.className = "comment";
		var htmlTemplate = '<div class="input_container">\
								<textarea onfocus="comment.checkLogin()" placeholder="评论、留言，说点什么吧..."></textarea>\
								<a href="javascript:comment.addComment(' + topicId + ');">发表评论</a>\
							</div>\
							<div class="comment_list">\
								<ul>\
									<li>正在努力加载评论</li>\
								</ul>\
							</div>';
		div.innerHTML = htmlTemplate;
		mui(".main")[0].appendChild(div);

		mui.ajax(urlUtil.getRequestUrl("getTopicCommentList"), {
			data: {
				topicId: topicId
			},
			type: "post",
			dataType: "json",
			success: function(data){
				mui(".comment_list ul")[0].innerHTML = "";
				if(data.header.success){
					for(var i = 0; i < data.body.length; i++){
						comment.insertComment(data.body[i]);	
					}
				}
			},
			error: function(xhr, type, errorThrown){
				util.toast(type + "错误，获取评论列表错误，请稍后重试");
			}
		});
	}
}