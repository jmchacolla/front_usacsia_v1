
'use strict';
angular.module("adminApp")

.controller('AsignarInspeccionCtrl',['CONFIG', '$scope', '$routeParams','TramitesAsignarInspector','AsignarTramiteInspector', 'toastr', '$route',
function (CONFIG, $scope, $routeParams, TramitesAsignarInspector,AsignarTramiteInspector, toastr, $route){
	$scope.ajustes = {
	    menu:{
	      titulo: 'Gestión de Consultorios',
	      items:[
	        {nombre:'Asignar inspecciones', enlace:'#/asignar-inspeccion', estilo:'active'},
	        {nombre:'Inspecciones Asignadas', enlace:'#/inspeccion-asignada', estilo:''}]
	    },
	    pagina:{
	      titulo:'Asignar inspecciones'
	    }
	};


    $scope.loading=true;//PARA HACER UN LOADING EN EL TEMPLATE
  	$scope.sortType = 'con_id'; // set the default sort type
  	$scope.sortReverse  = true;  // set the default sort order
  	
  	$scope.btn_hab=true;
  	$scope.cambio_hab=function(){
  		if($scope.btn_hab)
  			$scope.btn_hab=false;
  		else
  			$scope.btn_hab=true;
  	}
  	/*if (authUser.isLoggedIn()) {*/
  		if(CONFIG.ROL_CURRENT_USER == 1){//Si es administrador del SEDES
			//var es_id = $routeParams.es_id;
		}
		else{//Si es Administrador del establecimiento
			var FunG = localStorage.getItem("Funcionario");
	  		var FunG = JSON.parse(FunG);
			//var es_id = FunG.es_id;
		} 
	/*} 	
	else{*/
		//var es_id = $routeParams.es_id;
	/*}*/
	TramitesAsignarInspector.get(function(data)
	{
		$scope.tramites = data.empresa_tramite;
		console.log($scope.consultorios);
		if($scope.tramites.length >0 && data.status ){
			$scope.loading = false;
  			$scope.msg = true;
		}
		$scope.loading = false;
	},function () {
      $scope.loading = false;
      $scope.msg = false;
      toastr.error("ERROR INESPERADO, POR FAVOR ACTUALICE LA PÁGINA");
    });


	/*asignar tramite a inspector*/
	$scope.ids = [];

    $scope.editado = function (et_id) {
        var idx = $scope.ids.indexOf(et_id);
        if (idx > -1){
        	$scope.ids.splice(idx,1);
        }
        else{
        	$scope.ids.push(et_id);
        }
        $scope.final= $scope.ids.toString();
    };

    $scope.update_lista = function(a){
    	$scope.id_estado={
			ids:$scope.ids
    	};
		AsignarTramiteInspector.save($scope.id_estado).$promise.then(function(data){
			if(data.status) {
				$scope.ajustes.pagina.success = "CONFIGURACION GUARDADA";
	        	toastr.success('CONFIGURACIÓN GUARDADA');
	        	$route.reload();
			}
		})
	}
	/*----------------------*/

	
	$scope.remove = function(){
	    Consultorios.delete({amb_id:id}).$promise.then(function(data){
	      if(data.mensaje) {
	        toastr.success('Eliminado correctamente');
	        $route.reload();
	      }
	    })
	}
}])



.controller('InspeccionAsignadasCtrl',['CONFIG', '$scope', '$routeParams','TramitesAsignadosInspeccion','ListaInspector','Inspectores', 'toastr', '$route',
function (CONFIG, $scope, $routeParams, TramitesAsignadosInspeccion,ListaInspector,Inspectores, toastr, $route){
	$scope.ajustes = {
	    menu:{
	      titulo: 'Gestión de Consultorios',
	      items:[
	        {nombre:'Asignar inspecciones', enlace:'#/asignar-inspeccion', estilo:''},
	        {nombre:'Inspecciones Asignadas', enlace:'#/inspeccion-asignada', estilo:'active'}]
	    },
	    pagina:{
	      titulo:'Asignar inspecciones'
	    }
	};


    $scope.loading=true;//PARA HACER UN LOADING EN EL TEMPLATE
  	$scope.sortType = 'con_id'; // set the default sort type
  	$scope.sortReverse  = true;  // set the default sort order
  	
  
  	/*if (authUser.isLoggedIn()) {*/
  		if(CONFIG.ROL_CURRENT_USER == 1){//Si es administrador del SEDES
			//var es_id = $routeParams.es_id;
		}
		else{//Si es Administrador del establecimiento
			var FunG = localStorage.getItem("Funcionario");
	  		var FunG = JSON.parse(FunG);
			//var es_id = FunG.es_id;
		} 
	/*} 	
	else{*/
	/*}*/		//var es_id = $routeParams.es_id;

	Inspectores.get(function(data){
		$scope.inspectores = data.funcionario;
	})
	TramitesAsignadosInspeccion.get(function(data)
	{
		$scope.tramites = data.empresa_tramite;
		if(($scope.tramites.length >0 && data.status) ){
			$scope.loading = false;
  			$scope.msg = true;
		}
		$scope.loading = false;
	},function () {
      $scope.loading = false;
      $scope.msg = false;
      toastr.error("ERROR INESPERADO, POR FAVOR ACTUALICE LA PÁGINA");
    });

    
    $scope.por_inspector=function(fun_id){
    	if(fun_id!=null || fun_id){
    		console.log('el fun_id del inspector',fun_id);
    		ListaInspector.get({fun_id:fun_id},function(data){
    			$scope.tramites=data.empresa_tramite;
    		});
    	}
    	if(!fun_id)
    	{
    		TramitesAsignadosInspeccion.get(function(data)
			{
				$scope.tramites = data.empresa_tramite;
			});
    	}
    };



	/*habilitar consultorios*/
	$scope.ids = [];
	$scope.estados = [];
    $scope.editado = function (con_id,con_estado) {
        var idx = $scope.ids.indexOf(con_id);
        if (idx > -1){
        	$scope.estados[idx]=con_estado;
        }
        else{
        	$scope.ids.push(con_id);
        	$scope.estados.push(con_estado);
        }
        $scope.final= $scope.ids.toString();
        $scope.final2= $scope.estados.toString();
    };

    $scope.update_lista = function(a){
    	$scope.id_estado={
			ids:$scope.ids,
			estados:$scope.estados
    	};
		ConsultoriosLista.save($scope.id_estado).$promise.then(function(data){
			if(data.status) {
				$scope.ajustes.pagina.success = "CONFIGURACION GUARDADA";
	        	toastr.success('CONFIGURACIÓN GUARDADA');
			}
		})
	}
	/*----------------------*/

	
	$scope.remove = function(){
	    Consultorios.delete({amb_id:id}).$promise.then(function(data){
	      if(data.mensaje) {
	        toastr.success('Eliminado correctamente');
	        $route.reload();
	      }
	    })
	}
}])