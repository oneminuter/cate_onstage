var publicFunc = {
	//显示面板
	show: function(targetElement){
		mui("."+targetElement)[0].style.display = "block";
	},

	//隐藏面板
	hidden: function(targetElement){
		mui("."+targetElement)[0].style.display = "none";
	},

	//底部菜单切换
	bind: function(){
		var menus = mui("#footer_menu a");
		for(var i = 0; i < menus.length; i++){
			menus[i].addEventListener("tap", function(){
				if( this.href != "###"){
					window.location.href = this.href;
				}
			}, false);
		}
	}
}
publicFunc.bind();