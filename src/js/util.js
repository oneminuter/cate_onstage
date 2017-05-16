var util = {
	//去掉空格
	trim: function(str){
		return null==str?"":(str+"").replace("\s","")
	},

	//toast弹层
	toast:function(text){
		var toast = document.createElement("p");
		toast.style.cssText = 'background-color: rgba(0, 0, 0, 0.4);width: 300px;position: absolute;top: 20%;z-index: 3;left: 50%;margin-left: -100px;color: rgba(255, 255, 255, 0.65);padding: 8px;border-radius: 8px;text-align: center;';
		toast.innerHTML = text;
		document.body.appendChild(toast);
		var timeer = setTimeout(function(){
			document.body.removeChild(toast);
			clearTimeout(timeer);
		}, 3000);
	}
}