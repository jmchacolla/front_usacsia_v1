'use strict';

angular.module("adminApp")
.controller('LoginCtrl', function (authUser) {
	var vm = this;
	vm.loginForm = {
	usu_nick: '',
	password: ''
	};

	vm.login = function(){
		authUser.loginApi(vm.loginForm);
	}

})

/*121815027*/

;