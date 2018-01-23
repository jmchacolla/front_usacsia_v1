'use strict';
angular.module('authService', [])
	.factory('sessionControl', function(){
		return {
			get: function(key){
				return sessionStorage.getItem(key);
			},
			set: function(key,val){
				return sessionStorage.setItem(key, val);
			},
			unset: function(key){
				return sessionStorage.removeItem(key);
			}
		};
	})

	.factory('authUser', function ($auth, sessionControl, toastr, $location, $rootScope, FuncionarioPer, CONFIG,/* Establecimientos,*/$route,$timeout,/*RolResource,*/Personas,Paises,/*PacientePersona,*/EstabSols) {
		var cacheSession = function(usu_nick, rol_id, usu_identificador, id){
			//Asigna variables de sesion
			sessionControl.set('userIsLogin',true);
			sessionControl.set('usu_nick', usu_nick);
			sessionControl.set('rol_id', rol_id);
			sessionControl.set('per_id', usu_identificador);
			sessionControl.set('id', id);//Id del usuario
		};
		var unCacheSession = function (){
			//Elimina variables de sesion
			sessionControl.unset('userIsLogin');
			sessionControl.unset('usu_nick');
			sessionControl.unset('rol_id');
			sessionControl.unset('per_id');
			sessionControl.unset('id');
		};

		var login = function(loginForm){
			$auth.login(loginForm).then(
				function(response){
					/*console.log("DATA",response.data);
					console.log("CONFIG",response.config.data);*/
					if(response.data.error && response.config.data.usu_nick !='' && response.config.data.password != undefined) {
						toastr.error('El nombre de usuario y la contraseña no coinciden', 'Error');
						console.log(response);
					}
					cacheSession(response.data.user.usu_nick, response.data.user.rol_id, /*response.data.user.per_id,*/ response.data.user.id);
					toastr.success('Sesion iniciada con exito.', 'Mensaje');
					/*console.log(response,"RESPONSE");*/
					//Guardando los datos de la sesión en una variable para localStorage
					var datosSesion = {//datos de la sesion
						usu_nick: response.data.user.usu_nick,
						per_id: response.data.user.usu_identificador,
						rol_id: response.data.user.rol_id,
						id: response.data.user.id,
					};
					/*Paises.get(function(data){
						var paisess=data.pais;
						console.log(paisess);
					});*/
					//guardando en localStorage los datos de la sesion
					var Sesion = JSON.stringify(datosSesion);
			
					localStorage.setItem("Sesion", Sesion);
			

					//para almacenar en localStorage los datos de la persona logueada
					//convirtiendo text a int
					var per_id= parseInt(response.data.user.usu_identificador, 10);
					if (response.data.user.rol_id!=6) {
					Personas.get({per_id:per_id}, function(data){
						var persona = data.persona;
						//console.log("GUARDANDO DATOS DE PERSONA EN LOCALSTORAGE",persona)
						persona = JSON.stringify(persona);
						localStorage.setItem("DatosPer", persona);
					},function () {
      				  toastr.error("ERROR INESPERADO, POR FAVOR ACTUALICE LA PÁGINA");
				      $scope.loading = false;
				      $scope.msg = false;
				    });
	
					} else {
						EstabSols.get({ess_id:per_id}, function(data){
						var persona = data.establecimiento;
						//console.log("GUARDANDO DATOS DE PERSONA EN LOCALSTORAGE",persona)
						persona = JSON.stringify(persona);
						localStorage.setItem("DatosEstablecimiento", persona);
						console.log("sessss___",persona);
					});
					}
					//para el rol
					CONFIG.ROL_CURRENT_USER = parseInt(response.data.user.rol_id, 10);//este es el usuario que esta logueado
					/*console.log("ROL",CONFIG.ROL_CURRENT_USER );*/
					//DEBERIA GUARDARSE EL ROL NOMBRE AQUI, MIENTRAS ESTOY PONIENDO USU_NICK
  					CONFIG.ROL_CURRENT_USER_NAME = response.data.rol.rol_nombre;
  					/*console.log("rol_nombre",CONFIG.ROL_CURRENT_USER_NAME );*/


					localStorage.setItem("ROL_CURRENT_USER", parseInt(response.data.user.rol_id, 10));//para obtener el rol_id
					//localStorage.setItem("ROL_CURRENT_USER_NAME", response.data.user.rol_nombre);//para obtener el rol_nombre
					//mientras no corre el servicio de roles
					localStorage.setItem("ROL_CURRENT_USER_NAME", response.data.rol.rol_nombre);//para
					//para saber que persona es
		
					if (response.data.user.rol_id!=6) {
					FuncionarioPer.get({per_id:response.data.user.usu_identificador}, function(data)
					{
						var funcionario = data.funcionario;
						if (data.funcionario.fun_estado=='ACTIVO') {
						  				
					         /* es_id: funcionario.funcionario_establecimiento[i].es_id,*/
					          fun_id: funcionario.fun_id;
					          /*console.log("GUARDANDO DATOS DE FUNCIONARIO EN LOCALSTORAGE",funcionario)*/
							funcionario = JSON.stringify(funcionario);
							localStorage.setItem("Funcionario", funcionario);
					    }
					},function () {
				      
				      toastr.error("ERROR INESPERADO, POR FAVOR ACTUALICE LA PÁGINA");
				      $scope.loading = false;
				      $scope.msg = false;
				    });
					}//fin del if
					
					$timeout(function() {
		              $location.path('/');
		          	},2000);

				},
				function(){
					unCacheSession();
					toastr.error('Error inesperado, por favor vuelva a intentar');
				}
			);
		};
		return {
			loginApi: function(loginForm){
				login(loginForm);
			},
			logout: function(){
				//localStorage.removeItem("nombreEst");
				localStorage.removeItem("Sesion");//removeItem
				localStorage.removeItem("DatosPer");
				localStorage.removeItem("ROL_CURRENT_USER");
				localStorage.removeItem("ROL_CURRENT_USER_NAME");
				localStorage.removeItem("DatosEstablecimiento");
				localStorage.removeItem("Funcionario");
			    //localStorage.removeItem("PacId");
				localStorage.removeItem("aux_es_id");
				localStorage.removeItem("DOS_ESTAB");
				
				$auth.logout();
				unCacheSession();
				$timeout(function() {
	              $location.path('/inicio');
	            },0);
				toastr.success('Sesion cerrada con exito.', 'Mensaje');
			},
			isLoggedIn: function(){
				return sessionControl.get('userIsLogin') !== null;
			}
		}
	});