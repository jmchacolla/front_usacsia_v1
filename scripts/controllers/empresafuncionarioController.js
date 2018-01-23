'use strict';
angular.module('adminApp')

.controller('VerificarPersonaCtrl', ['$scope','$http','CONFIG', 'PersonasEstablecimiento2','PersonasEstablecimiento','$route','$routeParams', 'toastr', '$location',
	function ($scope, $http,CONFIG,PersonasEstablecimiento2,PersonasEstablecimiento,$route,$routeParams,toastr,$location)
	{
		$scope.ajustes = {
			menu:{
				titulo: 'Verificar estado de persona en USACSIA',
				items:[
				{nombre:'Registrar Empleado', enlace:'#/persona-usacsia', estilo:'active'}]
			},
			pagina:{
				titulo:'Verificar estado de persona en USACSIA'
			}
		}

		var EstG = localStorage.getItem("DatosEstablecimiento");
		var EstG = JSON.parse(EstG);
		var ess_id= EstG.est_sol.ess_id;

		PersonasEstablecimiento.get({ess_id:ess_id},function(data)
		{
			$scope.personas_x_establecimiento = data.personas_x_establecimiento;
			if($scope.personas_x_establecimiento.length > 0){
				$scope.loading = false;
				$scope.msg = true;
			}
			else {
				$scope.loading = false;
				$scope.msg = false;
			}
		},function () {
			$scope.loading = false;
			$scope.msg = false;
		});
		$scope.cambioper_ci=function(){
			$scope.estado_persona = null;
			$scope.mensajee=null;
			$scope.sin_registro=false;
			$scope.sin_tramite=false;
			$scope.en_establecimiento=false;
		}
		$scope.verificarper=function(){

			$http.get(CONFIG.DOMINIO_SERVICIOS+'/estado_tramite_persona/'+$scope.per_ci+'/'+ess_id).success(function(data){
				$scope.estado_persona = data.estado_pt;
				$scope.mensajee=null;
				var per_id=data.estado_pt.per_id;
				$scope.en_establecimiento=true;
				$http.get(CONFIG.DOMINIO_SERVICIOS+'/establecimiento_persona/'+per_id+'/'+ess_id).success(function(data){
					if(data.message)
						$scope.mensajee="PERSONA REGISTRADA";
					$scope.class='success';
				}).error(function(data){$scope.en_establecimiento=false;})
			}).error(function(data){
				$scope.estado_persona=null;
				$scope.mensajee="La persona no cuenta con registro en USACSIA";
				$scope.sin_registro=true;
				$scope.class='warning';
				if(data.errors[0].message=='Sin tramite'){
					console.log('llega al error sin tramite', data.errors[0].estado_pt);
					$scope.estado_persona=data.errors[0].estado_pt;
					$scope.sin_tramite=true;
					if(data.errors[0].existe){
						$scope.en_establecimiento=true;
						$scope.mensajee="PERSONA REGISTRADA";
					}else{
						$scope.mensajee="Persona registrada, sin inicio de trámite";
					}
					$scope.sin_registro=false;
					$scope.class='info';
				}
			});
		};

		var id=null;
		$scope.get_perid=function(per_id,n,app,aps){
			id=per_id;
			$scope.nombres=n+" "+app+" "+aps;
			console.log("perid elegido", id);
		};

		$scope.submit=function(cargo){
			$scope.personaestab={
				per_id:id,
				ess_id:ess_id,
				ep_cargo:cargo
			};
			PersonasEstablecimiento2.save($scope.personaestab).$promise.then(function(data){
				if(data.status){
					$scope.ajustes.pagina.success = "Empleado registrado exitosamente";
					toastr.success('Empleado registrado exitosamente');
					$route.reload();
				}
			});
		};

		var id2=null;
		$scope.get_perid2=function(ep_id,n,app,aps){
			id2=ep_id;
			$scope.nombres=n+" "+app+" "+aps;
			console.log("perid elegido", id2); 
		};

		$scope.remove = function()
		{
			PersonasEstablecimiento2.delete({ep_id:id2}).$promise.then(function(data)
			{
				if(data.mensaje)
				{
					toastr.success('Empleado retirado correctamente');
					$route.reload();
				}
			})
		};

  $scope.sortType = 'per_id'; // set the default sort type
  $scope.sortReverse  = true;  // set the default sort order
  $scope.Personas = [];
  var et_id= $routeParams.et_id;

}])

