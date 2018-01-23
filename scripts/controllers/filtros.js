'use strict';
angular.module("adminApp")
//Filtro para poner la primera letra en mayúscula
.filter("capitalize", function(){
	return function(text) {
		if(text != null){
			return text.substring(0,1).toUpperCase()+text.substring(1);
		}
	}
})
.filter("maxLength", function(){
	return function(text,max){
		if(text != null){
			if(text.length > max){
				return text.substring(0, max) + "...";
			}
			else{
				return text;
			}
		}
	}
})