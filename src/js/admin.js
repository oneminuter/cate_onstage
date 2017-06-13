/*
	依赖jquery的ajax,
	jquery.area.js
*/
(function () {

	var page = {
		controller: function(){
			page.init();
			page.bind();
		},

		//初始化
		init: function(){
			var clientWidth = document.documentElement.clientWidth;
			var clientHeight = document.documentElement.clientHeight;
			document.querySelector(".content_container").style.height = (clientHeight - 40) + "px";

			//选择地址三级联动
			var defalutOptions = {
	            cityClass: '.city',
	            districtClass: '.district',
	            inputCode: '.code',
	            inputText: '.text'
	        };
	        $('.province').area(defalutOptions);
		},

		//事件绑定
		bind: function(){
			//二级菜单
			var menu_dts = document.querySelectorAll(".menu dl dt");
			menu_dts.forEach(function(val, index, arr){
				arr[index].addEventListener("click", function(){
					if(this.parentNode.className == ""){
						this.parentNode.className = "active";
						var li_len = this.parentNode.querySelectorAll("dd ul li").length;
						this.parentNode.querySelector("dd").style.height = (li_len * 35) + "px";
					}else{
						this.parentNode.className = "";
						this.parentNode.querySelector("dd").style.height = "0px";
					}
				}, false);
			});

			//点击菜单切换对应面板
			var menuLis = document.querySelectorAll(".menu dl dd ul li");
			for(var i = 0; i < menuLis.length; i++){
				menuLis[i].addEventListener("click", function(){
					page.changePanenl(this);
				}, false);
			}

			//添加美食分类切换
			document.querySelector("#addFood_classify").addEventListener("change", function(){
				page.changeAddFoodClassify(this.value);
			}, false);
			//上传预览
			document.querySelector("#uploadSlideImage").addEventListener("change", function(){
				page.setPreview(this);
			}, false);
			document.querySelector("#uploadFoodImage").addEventListener("change", function(){
				page.setPreview(this);
			}, false);
			document.querySelector("#uploadShicaiImage").addEventListener("change", function(){
				page.setPreview(this);
			}, false);
			document.querySelector("#uploadShipuImage").addEventListener("change", function(){
				page.setPreview(this);
			}, false);
			document.querySelector("#uploadOtherImage").addEventListener("change", function(){
				page.setPreview(this);
			}, false);
			//提交
			document.querySelector("#addSlideBtn").addEventListener("click", function(){
				page.addSlideSubmit();
			}, false);
			document.querySelector("#addFoodSubmitBtn").addEventListener("click", function(){
				page.addFoodSubmit();
			}, false);
			document.querySelector("#addShicaiSubmitBtn").addEventListener("click", function(){
				page.addFoodSubmit();
			}, false);
			document.querySelector("#addShipuSubmitBtn").addEventListener("click", function(){
				page.addFoodSubmit();
			}, false);
			document.querySelector("#addOtherSubmitBtn").addEventListener("click", function(){
				page.addFoodSubmit();
			}, false);

		},

		//显示上传图片预览
		setPreview: function(inputFile){
			var previewBox = inputFile.parentNode;
			var inputHidden = inputFile.parentNode.getElementsByTagName("input")[0];
			var file = inputFile.files[0];
			var containerClassName = inputFile.parentNode.parentNode.className;
			var addRuleElement = "." + containerClassName + "::before"; //拼接：如：.addSlide::before
			if(file.size > 1*1024*1024){
				document.styleSheets[0].addRule(addRuleElement, 'content:"上传图片不能超过1M"');
			}else{
				document.styleSheets[0].addRule(addRuleElement,'content:""');
				if(window.FileReader){
					var fr = new FileReader();
					fr.readAsDataURL(file);
					fr.onloadend = function(e){
						var imgBase64 = e.target.result;
						inputHidden.value = imgBase64;
						previewBox.style.backgroundImage = "url(" + imgBase64 + ")";
						document.styleSheets[0].addRule('.preview::before,.preview::after','display:none');
					}
				}
			}				
		},

		//添加banner-提交
		addSlideSubmit: function(){
			var img = document.querySelector("#banner").value;
			var linkUrl = document.querySelector("#linkUrl").value;
			if(util.trim(img) == ""){
				//请上传图片
				util.toast("请上传图片");
				return false;
			}
			if(util.trim(linkUrl) == ""){
				util.toast("请输入banner连接地址");
				return;
			}

			$.ajax({
				url: urlUtil.getRequestUrl("addBannerSubmit"),
				data: {
					img: img,
					linkUrl: linkUrl
				},
				dataType: "json",
				type: "post",
				success: function(data){
					if(data.header.success){
						document.querySelector("#banner").value = "";
						document.querySelector("#linkUrl").value = "";
						document.querySelector(".addSlide .preview").style.backgroundImage = "none";
						document.styleSheets[0].addRule('.preview::before,.preview::after','display:block');
						util.toast("上传成功");
					}else{
						util.toast(data.header.errorInfo);
					}
				},
				error: function(error){
					util.toast("服务器错误，提交失败，请稍后重试");
				}
			});
		},

		//添加food-提交
		addFoodSubmit: function(){
			var classify = document.querySelector("#addFood_classify").value;
			var address = null;
			var detailAddress = null;
			var img = null;
			var name = null;
			var price = null;
			var reachPrice = null;
			var favorablePrice = null;
			var otherFavorable = null;
			var content = null;
			var url = null;
			var data = null;

			switch(classify){
				case "meishi":
					address = document.querySelector("#addFood_address").value;
					detailAddress = document.querySelector("#addFood_detailAddress").value;
					img = document.querySelector("#addFood_foodImage").value;
					name = document.querySelector("#addFood_name").value;
					price = document.querySelector("#addFood_price").value;
					reachPrice = document.querySelector("#addFood_reachPrice").value;
					favorablePrice = document.querySelector("#addFood_favorablePrice").value;
					otherFavorable = document.querySelector("#addFood_otherFavorable").value;

					url = urlUtil.getRequestUrl("addFoodSubmit");
					data = {
						classify: classify,
						address: address,
						detailAddress: detailAddress,
						img: img,
						name: name,
						price: price,
						reachPrice: reachPrice,
						favorablePrice: favorablePrice,
						otherFavorable: otherFavorable
					}
					break;
				case "shicai":
					img = document.querySelector("#addFood_shicaiImage").value;
					name = document.querySelector("#addShicai_name").value;
					content = ue_shicai.getContent();

					url = urlUtil.getRequestUrl("addFoodShicaiOrShipuOrOtherSubmit");
					data = {
						classify: classify,
						img: img,
						name: name,
						content: content
					}
					break;
				case "shipu":
					img = document.querySelector("#addFood_shipuImage").value;
					name = document.querySelector("#addShipu_name").value;
					content = ue_shipu.getContent();

					url = urlUtil.getRequestUrl("addFoodShicaiOrShipuOrOtherSubmit");
					data = {
						classify: classify,
						img: img,
						name: name,
						content: content
					}
					break;
				case "other":
					img = document.querySelector("#addFood_otherImage").value;
					name = document.querySelector("#addOther_name").value;
					content = ue_other.getContent();

					url = urlUtil.getRequestUrl("addFoodShicaiOrShipuOrOtherSubmit");
					data = {
						classify: classify,
						img: img,
						name: name,
						content: content
					}
					break;
				default:
					return;
					break
			}

			$.ajax({
				url: url,
				data: data,
				dataType: "json",
				type: "post",
				success: function(data){
					if(data.header.success){
						switch(classify){
							case "meishi":
								document.querySelector("#addFood_address").value = "";
								document.querySelector("#addFood_detailAddress").value  = "";
								document.querySelector("#addFood_foodImage").value  = "";
								document.querySelector("#addFood_name").value  = "";
								document.querySelector("#addFood_price").value  = "";
								document.querySelector("#addFood_reachPrice").value  = "";
								document.querySelector("#addFood_favorablePrice").value  = "";
								document.querySelector("#addFood_otherFavorable").value  = "";
								break;
							case "shicai":
								document.querySelector("#addFood_shicaiImage").value = "";
								document.querySelector("#addShicai_name").value = "";
								ue_shicai.execCommand('cleardoc');
								break;
							case "shipu":
								document.querySelector("#addFood_shipuImage").value = "";
								document.querySelector("#addShipu_name").value = "";
								ue_shipu.execCommand('cleardoc');
								break;
							case "other":
								document.querySelector("#addFood_otherImage").value = "";
								document.querySelector("#addOther_name").value = "";
								ue_other.execCommand('cleardoc');
								break;
							default:
								break;
						}
						var preview = document.querySelectorAll(".addFood .preview");
						for(var i = 0; i < preview.length; i++){
							preview[i].style.backgroundImage = "none";
						}
						document.styleSheets[0].addRule('.preview::before,.preview::after','display:block');
						util.toast("保存成功");
					}else{
						util.toast(data.header.errorInfo);
					}
				},
				error: function(error){
					util.toast("服务器错误，提交失败，请稍后重试");
				}
			});
		},

		//切换面板
		changePanenl: function(element){
			var parentNodeId = element.parentNode.id;
			var thisId = element.id;

			var pannels = document.querySelectorAll(".content_container > div");
			//隐藏
			for(var i = 0; i < pannels.length; i++){
				if(pannels[i].className != "menu"){
					pannels[i].style.display = "none";
				}
			}

			//查找对应显示
			for(var j = 0; j < pannels.length; j++){
				if(pannels[j].className == parentNodeId){
					pannels[j].style.display = "block";
					page.changeChildPanel(thisId, pannels[j].className);
					break;
				}
			}
		},

		//添加美食分类切换
		changeAddFoodClassify: function(value){
			var sections = document.querySelectorAll(".addFood > section");
			for(var i = 0; i < sections.length; i++){
				sections[i].style.display = "none";
			}
			switch(value){
				case "meishi":
					document.querySelector(".addFood > .addFoodContainer").style.display = "block";
					break;
				case "shicai":
					document.querySelector(".addFood > .addShicaiContainer").style.display = "block";
					break;
				case "shipu":
					document.querySelector(".addFood > .addShipuContainer").style.display = "block";
					break;
				case "other":
					document.querySelector(".addFood > .addOther").style.display = "block";
					break;
				default:
					document.querySelector(".addFood > .addFoodContainer").style.display = "block";
					break;
			}

		},

		//切换子菜单对应的面板
		changeChildPanel: function(childClassName, parentClassName){
			var child_panels = document.querySelectorAll("." + parentClassName + " > div");
			child_panels.forEach(function(val, index, arr){
				val.style.display = "none";
			});

			child_panels.forEach(function(val, index, arr){
				if(val.className == childClassName){
					val.style.display = "block";
					page.initData(childClassName);
				}
			});
		},

		//数据列表请求初始化
		initData: function(className){
			switch(className){
				case "slideList":
					slide.getSlideList();
					break;
				case "foodList":
					food.getFoodList();
					break;
				case "topicList":
					topic.getTopicList();
					break;
				case "orderList":
					order.getOrderList();
					break;
				case "userList":
					user.getUserList();
					break;
				default: break;
			}
		}
	}
	page.controller();
})()

var slide = {
	getSlideList: function(){
		$.ajax({
			url: urlUtil.getRequestUrl("getSlideList"),
			type: "post",
			dataType: "json",
			success: function(data){
				if(data.header.success){
					slide.renderSlideList(data.body);
				}else{
					util.toast(data.header.errorInfo);
				}
			},
			error: function(error){
				util.toast(error);
			}
		});
	},

	renderSlideList: function(data){
		var html = "";
		data.forEach(function(val, index, arr){
			var htmlTemplate = '<tr>\
									<td>' + val.id + '</td>\
									<td>\
										<img src="' + val.imgUrl + '" alt="">\
									</td>\
									<td>\
										<input onchange="slide.editLinkUrl(this, ' + val.id + ')" class="urlLink" type="text" value="' + val.linkUrl + '">\
									</td>\
									<td>' + val.onShelveTime + '</td>\
									<td>\
										<a class="btn_type_2" href="javascript:slide.deleteBanner(' + val.id + ');">删除</a>\
									</td>\
								</tr>';
			html += htmlTemplate;
		});
		document.querySelector(".slideList table tbody").innerHTML = html;
	},

	//修改链接地址
	editLinkUrl: function(ele, id){
		var url = ele.value.trim();
		$.ajax({
			url: urlUtil.getRequestUrl("editBannerLinkUrl"),
			data: {
				a: url,
				id: id
			},
			type:"post",
			dataType: "json",
			success: function(data){
				if(data.header.success){
					slide.getSlideList();
				}else{
					util.toast(data.header.errorInfo);
				}
			},
			error: function(error){
				util.toast(error);
			}
		});
	},

	deleteBanner: function(id, isSure){
		isSure = isSure || false;
		if(isSure != true){
			publicFunc.popup(id, slide.deleteBanner, "delete");
		}else{
			$.ajax({
				url: urlUtil.getRequestUrl("deleteBanner"),
				data: {
					id: id
				},
				type: "post",
				dataType: "json",
				success: function(data){
					if(data.header.success){
						slide.getSlideList();
					}else{
						util.toast(data.header.errorInfo);
					}
				},
				error: function(error){
					util.toast(error);
				}
			});
		}
	},
}

var food = {
	getFoodList: function(){
		$.ajax({
			url: urlUtil.getRequestUrl("getAllFoodList"),
			type: "post",
			dataType: "json",
			success: function(data){
				if(data.header.success){
					food.renderFoodList(data.body);
				}else{
					util.toast(data.header.errorInfo);
				}
			},
			error: function(error){
				util.toast(error);
			}
		});
	},

	renderFoodList: function(data){
		var html = "";
		data.forEach(function(val, index, arr){
			var htmlTemplate = '<tr>\
							<td>' + val.id + '</td>\
							<td>' + food.getClassify(val.classify) + '</td>\
							<td>\
								<input onchange="food.modify(' + val.id + ', \'name\', this)" type="text" value="' + val.name + '">\
							</td>\
							<td>\
								<img class="foodImg" src="' + val.imgUrl + '" alt="">\
							</td>\
							<td>\
								<input onchange="food.modify(' + val.id + ', \'price\', this)" type="text" value="' + val.price + '">\
							</td>\
							<td>\
								<input onchange="food.modify(' + val.id + ', \'reachPrice\', this)" type="text" value="' + val.reachPrice + '">\
							</td>\
							<td>\
								<input onchange="food.modify(' + val.id + ', \'favorablePrice\', this)" type="text" value="' + val.favorablePrice + '">\
							</td>\
							<td>\
								<input onchange="food.modify(' + val.id + ', \'otherFavorable\', this)" type="text" value="' + val.otherFavorable + '">\
							</td>\
							<td>\
								<input onchange="food.modify(' + val.id + ', \'address\', this)" type="text" value="' + val.address + '">\
							</td>\
							<td>\
								<input onchange="food.modify(' + val.id + ', \'detailAddress\', this)" type="text" value="' + val.detailAddress + '">\
							</td>\
							<td>\
								<input onchange="food.modify(' + val.id + ', \'storeName\', this)" type="text" value="' + val.storeName + '">\
							</td>\
							<td>\
								<a class="btn_type_2" href="javascript:food.deleteFood(' + val.id + ');">删除</a>\
							</td>\
						</tr>';
			html += htmlTemplate;
		});
		document.querySelector(".foodList table tbody").innerHTML = html;
	},

	//修改食物信息
	modify: function(id, key, ele){
		$.ajax({
			url: urlUtil.getRequestUrl("modifyFoodInfo"),
			data: {
				id: id,
				key: key,
				val: ele.value
			},
			type: "post",
			dataType: "json",
			success: function(data){
				if(data.header.success){
					food.getFoodList();
				}else{
					util.toast(data.header.errorInfo);
				}
			},
			error: function(error){
				util.toast(error);
			}
		});
	},

	//食物分类转换
	getClassify: function(classify){
		var result = "";
		switch(classify){
			case "meishi":
				result = "美食";
				break;
			case "shicai":
				result = "食材";
				break;
			case "shipu":
				result = "食谱";
				break;
			default :
				result = "其他";
				break;
		}
		return result;
	},

	deleteFood: function(id, isSure){
		isSure = isSure || false;
		if(isSure != true){
			publicFunc.popup(id, food.deleteFood, "delete");
		}else{
			$.ajax({
				url: urlUtil.getRequestUrl("deleteFood"),
				data:{
					id: id
				},
				type: "post",
				dataType: "json",
				success: function(data){
					if(data.header.success){
						food.getFoodList();
					}else{
						util.toast(data.header.errorInfo);
					}
				},
				error: function(error){
					url.toast(error);
				}
			});
		}
	}
}

// 公共代码
var publicFunc = {
	popup: function(id, func, html){
		var div = document.createElement("div");
		div.className = "popup";
		div.innerHTML = publicFunc.getHtml(id, html);
		publicFunc.confirmPanel = div;
		publicFunc.callback = func;
		document.body.appendChild(div);
	},
	sure: function(id){
		publicFunc.callback(id, true);
		publicFunc.cancel();
		publicFunc.init();
	},
	cancel: function(){
		document.body.removeChild(publicFunc.confirmPanel);
		publicFunc.init();
	},
	//初始化，恢复 publicFunc 的 publicFunc.callback 和 publicFunc.confirmPanel
	init: function(){
		publicFunc.callback = publicFunc.confirmPanel = null;
	},

	//删除确认框
	delete: function(id){
		return '<div class="confirm_body">\
					<h1>是否删除？</h1>\
					<div class="comfirm_btn">\
						<a class="btn_type_1" href="javascript:publicFunc.sure(' + id + ');">确定</a>\
						<a class="btn_type_1" href="javascript:publicFunc.cancel();">取消</a>\
					</div>\
				</div>';
	},

	//修改订单状态
	changeOrderState: function (id) {
		return '<div class="stateBody">\
					<h1>修改订单状态</h1>\
					<label>\
						<input onchange="order.selectState(1)" type="radio" name="orderState" value="1">\
						已支付\
					</label>\
					<label>\
						<input onchange="order.selectState(0)" type="radio" name="orderState">\
						未支付\
					</label>\
					<label>\
						<input onchange="order.selectState(-1)" type="radio" name="orderState">\
						取消订单\
					</label>\
					<div class="btn_container">\
						<a class="btn_type_1" href="javascript:publicFunc.sure(' + id + ');">确定</a>\
						<a class="btn_type_1" href="javascript:javascript:publicFunc.cancel(this);">取消</a>\
					</div>\
				</div>';
	},

	getHtml: function(id, key){
		for(var item in publicFunc){
			if(item == key){
				return publicFunc[item](id);
			}
		}
	},
}

var topic = {
	getTopicList: function(){
		$.ajax({
			url: urlUtil.getRequestUrl("getCommunityList"),
			type: "post",
			dataType: "json",
			success: function(data){
				if(data.header.success){
					topic.renderTopicList(data.body);
				}else{
					util.toast(data.header.errorInfo);
				}
			},
			error: function(error){
				util.toast(error);
			}
		});
	},

	renderTopicList: function(data){
		var html = "";
		data.forEach(function(val, index, arr){
			var htmlTemplate = '<tr>\
									<td>' + val.id + '</td>\
									<td>' + val.title + '</td>\
									<td>' + val.classify + '</td>\
									<td>' + val.introduce + '</td>\
									<td>' + val.author + '</td>\
									<td>' + val.publishDate + '</td>\
									<td>' + val.view + '</td>\
									<td>' + val.commentNum + '</td>\
									<td>\
										<a class="btn_type_2" href="javascript:topic.deleteTopic(' + val.id + ');">删除</a>\
									</td>\
								</tr>';
			html += htmlTemplate;
		});
		document.querySelector(".topicList tbody").innerHTML = html;
	},

	deleteTopic: function(id, isSure){
		isSure = isSure || false;
		if( !isSure ){
			publicFunc.popup(id, topic.deleteTopic, "delete");
		}else{
			$.ajax({
				url: urlUtil.getRequestUrl("deleteTopic"),
				data: {
					id: id
				},
				type: "post",
				dataType: "json",
				success: function(data){
					if(data.header.success){
						topic.getTopicList();
					}else{
						util.toast(data.header.errorInfo);
					}
				},
				error: function(error){
					util.toast(error);
				}
			});
		}
	}
}

var order = {
	getOrderList: function(){
		$.ajax({
			url: urlUtil.getRequestUrl("getAllOrderList"),
			type: "post",
			dataType: "json",
			success: function(data){
				if(data.header.success){
					order.renderOrderList(data.body);
				}else{
					util.toast(data.header.errorInfo);
				}
			},
			error: function(error){
				util.toast(error);
			}
		});
	},
	renderOrderList: function(data){
		var html = "";
		data.forEach(function(val, index, arr){
			var htmlTemplate = '<tr>\
									<td>' + val.id + '</td>\
									<td>' + val.orderId + '</td>\
									<td>' + val.phone + '</td>\
									<td>' + val.foodName + ' </td>\
									<td>' + val.payment + '</td>\
									<td>' + val.orderDate + '</td>\
									<td>' + val.payMethod + '</td>\
									<td>' + order.transformOrderState(val.state) + '</td>\
									<td>\
										<a class="btn_type_1" href="javascript:order.modifyState(' + val.id + ');">修改订单状态</a>\
									</td>\
								</tr>';
			html += htmlTemplate;
		});
		document.querySelector(".orderList tbody").innerHTML = html;
	},
	//修改订单状态
	modifyState: function(id, isPopup){
		if( !isPopup ){
			publicFunc.popup(id, order.modifyState, "changeOrderState");
		}else{
			if(order.state == null){
				util.toast("请选择订单状态");
			}else{
				$.ajax({
					url: urlUtil.getRequestUrl("modifyOrderState"),
					data: {
						id: id,
						state: order.state
					},
					type: "post",
					dataType: "json",
					success: function(data){
						if(data.header.success){
							order.getOrderList();
							//修改成功之后，需将state属性恢复为null
							order.state = null;
						}else{
							util.toast(data.header.errorInfo);
						}
					},
					error: function(error){
						util.toast(error);
					}
				});
			}
		}
	},
	//弹出层-选择状态
	selectState: function(state){
		order.state = state;
	},

	transformOrderState: function (state) {
		var result = "";
		switch(state){
			case 1:
				result = "已支付";
				break;
			case 0:
				result = "未支付";
				break;
			case -1:
				result = "取消订单";
				break;
			default :
				break;
		}
		return result;
	}
}

var user = {

	userInfo:[],

	//判断用户信息是否已存在,如果存在返回索引，否则返回-1
	userIsExist: function(id){
		var result = -1;
		for(var i = 0; i < user.userInfo.length; i++){
			if(user.userInfo[i].id == id){
				result = i;
				break;
			}
		}
		return result;
	},

	getUserList: function(){
		$.ajax({
			url: urlUtil.getRequestUrl("getUserList"),
			type: "post",
			dataType: "json",
			success: function(data){
				if(data.header.success){
					user.renderUserList(data.body);
				}else{
					util.toast(data.header.errorInfo);
				}
			},
			error: function(error){
				util.toast(error);
			}
		});
	},
	
	renderUserList: function(data){
		var html = "";
		data.forEach(function(val, index, arr){
			var htmlTemplate = '<tr>\
									<td>' + val.id + '</td>\
									<td>\
										<input onchange="user.showSaveBtn(' + val.id + ', this, \'username\')" type="text" value="' + val.username + '">\
									</td>\
									<td>\
										<img src="' + val.icon + '" alt="">\
									</td>\
									<td>\
										<input onchange="user.showSaveBtn(' + val.id + ', this, \'phone\')" type="number" value="' + val.phone + '">\
									</td>\
									<td>\
										<select onchange="user.showSaveBtn(' + val.id + ', this, \'gender\')">\
											<option value="1" ' + (val.gender == 1 ? "selected='true'" : "") + '>男</option>\
											<option value="0" ' + (val.gender == 1 ? "" : "selected='true'") + '>女</option>\
										</select>\
									</td>\
									<td>\
										<select onchange="user.showSaveBtn(' + val.id + ', this, \'isAdmin\')">\
											<option value="0" ' + (val.isAdmin == 1 ? "" : "selected='true'") + '>普通成员</option>\
											<option value="1" ' + (val.isAdmin == 1 ? "selected='true'" : "") + '>管理员</option>\
										</select>\
									</td>\
									<td>\
										<input onchange="user.showSaveBtn(' + val.id + ', this, \'balance\')" type="number" value="' + val.balance + '">\
									</td>\
									<td>\
										<input onchange="user.showSaveBtn(' + val.id + ', this, \'cash\')" type="number" value="' + val.cash + '">\
									</td>\
									<td>\
										<input onchange="user.showSaveBtn(' + val.id + ', this, \'integral\')" type="number" value="' + val.integral + '">\
									</td>\
									<td>\
										<a class="save_btn btn_type_3" href="javascript:user.saveEdit(' + val.id + ');">保存</a>\
										<div class="changePhoto">\
											<input type="file" accept="image/png,image/jpg,image/jpeg" onchange="user.changePhoto(' + val.id + ', this)">\
											<a class="btn_type_1" href="javascript:;">修改头像</a>\
										</div>\
										<a class="btn_type_2" href="javascript:user.deleteUser(' + val.id + ');">删除</a>\
									</td>\
								</tr>';
			html += htmlTemplate;
		});
		document.querySelector(".userList table tbody").innerHTML = html;
	},

	//显示保存按钮
	showSaveBtn: function (id, ele, key) {
		var val = ele.value;
		ele.parentNode.parentNode.querySelector(".save_btn").style.display = "inline-block";
		var index = user.userIsExist(id);
		if(index != -1){
			user.userInfo[index][key] = val;
		}else{
			var obj = {};
			obj.id = id;
			obj[key] = val;
			user.userInfo.push(obj);
		}
	},

	//按id获取改变的用户信息
	getUserInfo: function(id){
		var userInfoObj = {};
		for(var i = 0; i < user.userInfo.length; i++){
			if(user.userInfo[i].id == id){
				userInfoObj = user.userInfo[i];
				break;
			}
		}
		return userInfoObj;
	},

	saveEdit: function (id) {
		var obj = user.getUserInfo(id);
		$.ajax({
			url: urlUtil.getRequestUrl("saveEditUserInfo"),
			data:obj,
			type: "post",
			dataType: "json",
			success: function(data){
				if(data.header.success){
					user.getUserList();
				}else{
					util.toast(data.header.errorInfo);
				}
			},
			error: function(error){
				util.toast(error);
			}

		});
	},

	changePhoto: function (id, inpuFile) {
		var file = inpuFile.files[0];
		if(file.size > 1*1024*1024){
			util.toast("上传图片不能超过1M");
		}else{
			if(window.FileReader){
				var fr = new FileReader();
				fr.readAsDataURL(file);
				fr.onloadend = function(e){
					var imgBase64 = e.target.result;
					user.uploadPhoto(id, imgBase64);
				}
			}
		}
	},

	//上传头像
	uploadPhoto: function(id, imgBase64){
		$.ajax({
			url: urlUtil.getRequestUrl("uploadUserIcon"),
			data: {
				id: id,
				imgBase64: imgBase64
			},
			type: "post",
			dataType: "json",
			success: function(data){
				if(data.header.success){
					user.getUserList();
				}else{
					util.toast(data.header.errorInfo);
				}
			},
			error: function(error){
				util.toast(error);
			}
		});
	},

	deleteUser: function (id, isSure) {
		isSure = isSure || false;
		if(!isSure){
			publicFunc.popup(id, user.deleteUser, "delete");
		}else{
			$.ajax({
				url: urlUtil.getRequestUrl("deleteUser"),
				data: {
					id: id
				},
				type: "post",
				dataType: "json",
				success: function(data){
					if(data.header.success){
						user.getUserList();
					}else{
						util.toast(data.header.errorInfo);
					}
				},
				error: function(error){
					util.toast(error);
				}
			});
		}
	}
}