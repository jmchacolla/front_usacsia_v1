'use strict';

angular.module('adminApp')
	.controller('MenuCtrl', ['$auth','authUser', '$location', '$scope', 'sessionControl', 'ROLES', 'CONFIG', '$routeParams', /*'ReservasDia', 'CitasMedicos',*/
		function ($auth,authUser, $location, $scope, sessionControl, ROLES, CONFIG, $routeParams/*,ReservasDia,CitasMedicos*/){
		var vm = this;
		vm.isLogin = authUser.isLoggedIn();

		$scope.$watch(function(){
			return authUser.isLoggedIn();
		}, function(newVal){
			if (typeof newVal !== 'undefined') {
				vm.isLogin = authUser.isLoggedIn();
			}			
		});

		vm.user = {
			usu_nick: sessionControl.get('usu_nick'),
			rol_id: sessionControl.get('rol_id'),
		      //	roles: sessionControl.get('roles'),
		//	per_id: sessionControl.get('per_id'),
		}
				
		///$watch es para mostrar el dato
		$scope.$watch(function(){
			return sessionControl.get('usu_nick');
		}, function(newVal){
			if (typeof newVal !== 'undefined') {
				vm.user.usu_nick = sessionControl.get('usu_nick');
			}			
		});

		$scope.$watch(function(){
			return sessionControl.get('rol_id');
		}, function(newVal){
			if (typeof newVal !== 'undefined') {
				vm.user.rol_id = sessionControl.get('rol_id');
			}			
		});

		vm.ROLES = ROLES;
		vm.CONFIG = CONFIG;
		//console.log(typeof CONFIG.ROL_CURRENT_USER);
		//Almacena los datos de persona en caso de que sea una paciente
		

		var DatosPer = localStorage.getItem("DatosPer");
		var DatosPer = JSON.parse(DatosPer);
		vm.persona = DatosPer;

		vm.logout = function(){
			authUser.logout();
		};

		vm.isActive = function (viewLocation){
			return viewLocation == $location.path();
		};

		//Para cambiar de rol si, se tiene más de uno
	/*	vm.cambia_rol=false;
		var SesionG = localStorage.getItem("Sesion");
  		var SesionG = JSON.parse(SesionG);
  		console.log(typeof localStorage.getItem("DOS_ESTAB"));

		if(SesionG.roles.length>1 || localStorage.getItem("DOS_ESTAB")=="2"){
			vm.cambia_rol=true;
		}*/
		
		var FunG = localStorage.getItem("Funcionario");
		var FunG = JSON.parse(FunG);
		console.log("MENUCONTROLLER DATOS FUNCIONARIO", FunG);
		


		// jhonnnnnnnnnnnnnn
		// console.log('$auth.isAuthenticated()', $auth.isAuthenticated());
		// console.log('hola charo', $auth.isAuthenticated());

		//PARA LAS NOTIFICACIONES DE RESERVAS/////////////////////////////////////////////////////////
		//NOTIFICACIONES PARA EL MEDICO Y ADMINISTRADOR MEDICO
	/*	if((CONFIG.ROL_CURRENT_USER == 4 || CONFIG.ROL_CURRENT_USER == 9) && FunG) {
			$scope.CurrentDate = new Date();
	   		$scope.fecha_hoy=moment($scope.CurrentDate,"YYYY-MM-DD").format("YYYY-MM-DD");
			CitasMedicos.get({fe_id:FunG.fe_id,fecha:$scope.fecha_hoy},function(data){
				$scope.nro=0;
				for(var i=0; i < data.cita.length; i++){
					if((data.cita[i].cit_estado_asistencia==false || data.cita[i].cit_estado_asistencia==null) && data.cita[i].cit_estado_pago == true && data.cita[i].cit_fecha_consulta == $scope.fecha_hoy){
						$scope.nro=$scope.nro+1;
					}
				}
			});
			var timer = null;
			timer =	setInterval(function () {
				var FunG = localStorage.getItem("Funcionario");
				var FunG = JSON.parse(FunG);
				if(authUser.isLoggedIn()&&FunG!=null){
					console.log(FunG.fe_id);
					CitasMedicos.get({fe_id:FunG.fe_id,fecha:$scope.fecha_hoy},function(data){
						$scope.nro=0;
						for(var i=0; i < data.cita.length; i++){
							if((data.cita[i].cit_estado_asistencia==false || data.cita[i].cit_estado_asistencia==null) && data.cita[i].cit_estado_pago == true && data.cita[i].cit_fecha_consulta == $scope.fecha_hoy){
								$scope.nro=$scope.nro+1;
							}
						}
					});
					$scope.$apply();
				} else {
					clearInterval(timer);
					timer = null;
					$scope.$apply();
					CONFIG.ROL_CURRENT_USER == 0;
					FunG = null;
				}
			}, 120000);
		}*/
	
	}])

	.controller('MenuLateralCtrl', ['$scope', 'CONFIG', function ($scope, CONFIG) {
		var SesionG = localStorage.getItem("Sesion");
  		var SesionG = JSON.parse(SesionG);
  		$scope.ro=SesionG.rol_id;
  		
  		var vm = this;
  		//obteniendo datos del rol
		vm.roles = CONFIG.ROL_CURRENT_USER_NAME;//localStorage.getItem("ROL_CURRENT_USER_NAME");
		vm.rol = CONFIG.ROL_CURRENT_USER;//SesionG.rol_id;
		//obteniendo datos de la persona
		if (vm.rol!=6) {
			var DatosPer = localStorage.getItem("DatosPer");
			var DatosPer = JSON.parse(DatosPer);
			vm.persona = DatosPer;
		} else {
			var DatosEst = localStorage.getItem("DatosEstablecimiento");
			var DatosEst = JSON.parse(DatosEst);
			vm.establecimiento = DatosEst;
			console.log("datos de establecimiento__________",vm.establecimiento);
		}
		
		
		vm.usu_nick=SesionG.usu_nick;
		
		//vm.nombreEst = localStorage.getItem("nombreEst");
		/*if(vm.rol == 6 && (localStorage.getItem("DatosEstablecimiento")!=null)) {
			var Establecimiento = localStorage.getItem("DatosEstablecimiento");
	  		var Establecimiento = JSON.parse(Establecimiento);
	  		vm.nombreEst = Establecimiento.establecimientos.es_nombre;
		}*/
		
	}])
;