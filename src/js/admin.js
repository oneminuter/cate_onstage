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
					var childClassName = "." + thisId;
					pannels[j].querySelector(childClassName).style.display = "block";
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

		}
		
	}
	page.controller();
})()