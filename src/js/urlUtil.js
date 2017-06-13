var urlUtil = {
	// 请求地址:http://127.0.0.1:8080
	path: window.document.location.href.substring(0, window.document.location.href.indexOf(window.document.location.pathname)),
	//请求基地址:http://127.0.0.1:8080/cate
	baseRequestPath: window.document.location.href.substring(0, window.document.location.href.indexOf(window.document.location.pathname)) + "/" +  window.document.location.pathname.substring(1).substring(0, window.document.location.pathname.substring(1).indexOf("/")),
	
	//接口地址
	requestPath: {
		//首页轮播
		initSlid: "/index/getSlides",
		//添加banner-提交
		addBannerSubmit: "/admin/banner/submitBanner",
		//添加美食
		addFoodSubmit: "/admin/food/addFoodSubmit",
		//添加食材、食谱、其他品类
		addFoodShicaiOrShipuOrOtherSubmit: "/admin/food/addFoodShicaiOrShipuOrOtherSubmit",
		//按分类获取美食列表
		getFoodListByClassify: "/index/food/getFoodListByClassify",
		//获取详情
		getDetail: "/index/food/getDetail",
		//获取订单详情
		getCheckInfo: "/index/food/getCheckInfo",
		//添加收货地址
		addReceiveAddress: "/index/food/addReceiveAddress",
		//获取收货地址列表
		getAddressList: "/index/food/getAddressList",
		//提交订单
		submitCheck: "/index/food/submitCheck",
		//确认支付
		confirmPay: "/index/food/confirmPay",
		//获取订单列表
		getOrderList: "/user/order/getOrderList",
		// 注册
		register: "/user/doregister",
		//登录
		login: "/user/dologin",
		//获取用户信息
		getUserInfo: "/user/getUserInfo",
		//获取推荐列表
		getRecommentList: "/recomment/getRecommentList",
		//获取社区话题
		getCommunityList: "/community/getCommunityList",
		//获取话题详情
		getTopicDetail: "/community/getTopicDetail",
		//发布话题
		addTopic: "/community/addTopic",
		//添加评论
		addComment: "/community/detail/addComment",
		//获取话题的评论列表
		getTopicCommentList: "/community/getTopicCommentList",
		//收藏推荐食物
		addFoodCollect: "/recomment/addCollect",
		//收藏话题
		addTopicCollect: "/community/addTopicCollect",
		//获取我的收藏列表
		getCollectionList: "/user/getCollectionList",
		//获取幻灯banner列表
		getSlideList: "/admin/slide/getSlideList",
		//修改banner的链接地址
		editBannerLinkUrl: "/admin/slide/editUrlLink",
		//删除banner
		deleteBanner: "/admin/slide/delete",
		//删除美食
		deleteFood: "/admin/food/deleteFood",
		//修改美食信息
		modifyFoodInfo: "/admin/food/modifyFoodInfo",
		//获取食物列表
		getAllFoodList: "/admin/food/getAllFoodList",
		//删除话题
		deleteTopic: "/admin/community/deleteTopic",
		//获取所有订单列表
		getAllOrderList: "/admin/order/getAllOrderList",
		//修改订单状态
		modifyOrderState: "/admin/order/modifyOrderState",
		//获取用户信息列表
		getUserList: "/admin/user/getUserList",
		//保存修改的用户信息
		saveEditUserInfo: "/admin/user/saveEditUserInfo",
		//删除用户
		deleteUser: "/admin/user/deleteUser",
		//上传头像
		uploadUserIcon: "/admin/user/uploadUserIcon"
	},
	
	//根据操作名，返回需要请求的路径
	getRequestUrl: function(opt){
		var _url = "";
		for(var item in this.requestPath){
			if(item == opt){
				_url = this.baseRequestPath + this.requestPath[item];
				break;
			}
		}
		return _url;
	}
}