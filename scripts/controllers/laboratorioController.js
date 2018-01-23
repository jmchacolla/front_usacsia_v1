'use strict';
angular.module("adminApp")

.controller('ListaLaboratorioCtrl',['CONFIG', /*'authUser',*/'$scope', '$routeParams','Laboratorios', /*'Cons',*/ 'toastr', '$route',
function (CONFIG,/*authUser,*/ $scope, $routeParams, Laboratorios, /*Cons,*/ toastr, $route){
	$scope.ajustes = {
	    menu:{
	      titulo: 'Gestión de Laboratorios',
	      items:[
	        {nombre:'Laboratorios', enlace:'#/laboratorios', estilo:'active'},
	        {nombre:'Registrar Laboratorio', enlace:'#/laboratorios/create', estilo:''}]
	    },
	    pagina:{
	      titulo:'Laboratorios'
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
		//var es_id = $routeParams.es_id;
	/*}*/
	Laboratorios.get(function(data)
	{
		$scope.laboratorios = data.laborato;
		console.log($scope.laboratorios);
		if(($scope.laboratorios.length >0 && data.status) ){
			$scope.loading = false;
  			$scope.msg = true;
		}
		$scope.loading = false;
	},function () {
      $scope.loading = false;
      $scope.msg = false;
      toastr.error("ERROR INESPERADO, POR FAVOR ACTUALICE LA PÁGINA");
    });

	//PARA ELIMINAR UN CONSULTORIO
	var id = 0;
	$scope.nombre = "";
	$scope.get_amb_id = function(lab_id, con_nombre){
	    id=lab_id;
	    $scope.nombre = con_nombre;
	}

	$scope.remove = function(){
	    Laboratorios.delete({amb_id:id}).$promise.then(function(data){
	      if(data.mensaje) {
	        toastr.success('Eliminado correctamente');
	        $route.reload();
	      }
	    })
	}
}])

.controller('VerLaboratorioCtrl', ['$scope'/*,'Cons'*/,'$route','$routeParams','$location','toastr', /*'ServicioConsultorios', 'EstablecimientoPresta'*/'Laboratorios', function ($scope,/*Cons,*/$route,$routeParams,$location,toastr,Laboratorios/*,ServicioConsultorios,EstablecimientoPresta*/){
	$scope.ajustes = {
	    menu:{
	      titulo: 'Gestión de Laboratorios',
	      items:[
	        {nombre:'Laboratorios', enlace:'#/laboratorios', estilo:''},
	        {nombre:'Registrar Laboratorio', enlace:'#/laboratorios/create', estilo:''}]
	    },
	    pagina:{
	      titulo:'Detalle de Laboratorio'/*,
	      action: "AGREGAR OTRO SERVICIO"*/
	    }
	};

	var FunG = localStorage.getItem("Funcionario");
	var FunG = JSON.parse(FunG);

  	var amb_id = $routeParams.amb_id;
  	console.log("id",amb_id);
	Laboratorios.get({amb_id:amb_id}, function(data)
	{
		$scope.laboratorios = data.ambiente;
		console.log("son los consultorios",$scope.consultorios);
	});
	
}])


.controller('CrearLaboratorioCtrl', ['$scope','Labs','$location', '$timeout', 'toastr','Funcionarios'/*, 'EstablecimientoPresta', 'ServicioConsultorios'*/, function ($scope,Labs, $location, $timeout, toastr,Funcionarios/*,EstablecimientoPresta,ServicioConsultorios*/){
 	$scope.ajustes = {
	    menu:{
	      titulo: 'Gestión de Laboratorios',
	      items:[
	        {nombre:'Laboratorios', enlace:'#/laboratorios', estilo:''},
	        {nombre:'Registrar Laboratorio', enlace:'#/laboratorios/create', estilo:'active'}]
	    },
	    pagina:{
	      titulo:'Registrar Laboratorio',
	      action: "GUARDAR"
	    }
	};
 	var FunG = localStorage.getItem("Funcionario");
	var FunG = JSON.parse(FunG);
	//var es_id = FunG.es_id;

 /*	EstablecimientoPresta.get({es_id:es_id}, function(data) {
        $scope.prestas = data.servicio_especialidad;
    });*/

	$scope.laboratorios ={
		usa_id:1,
		amb_nombre:"",
		amb_tipo:"",
		amb_descripcion:"",
		lab_cod:"",
		fun_id:null
		
	};

/*	$scope.servicios_consultorios = {
		con_id : null,
		se_id : null
	}
*/
	$scope.patternCadena = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$/;
  	$scope.patternCadenaNumero = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ 0-9,]*$/;
  Funcionarios.get(function(data)
  {
    $scope.funcionarios = data.funcionario;
    console.log("FUNCIIII",$scope.funcionarios);
})




	$scope.submit =function()
	{
		$scope.laboratorios.amb_tipo="LABORATORIO";
		Labs.save($scope.laboratorios).$promise.then(function(data)
		{
			if(data.msg)
			{
				console.log("DATA",data);
				angular.copy({},$scope.laboratorios);
				$scope.ajustes.pagina.success ="LABORATORIO REGISTRADO CORRECTAMENTE";
				toastr.success('LABORATORIO REGISTRADO CORRECTAMENTE');
        		$timeout(function() {
            		$location.path('/laboratorios/ver/'+data.laboratorio.ambientes.amb_id);
        		},1000);
		    }   		
	
		},function () {
        toastr.error("Error inesperado");
      });
	}
	$scope.reset = function(form) {
    if (form) {
      form.$setPristine();
      form.$setUntouched();
    }
  };
}])

.controller('EditLaboratorioCtrl', ['$scope', 'Laboratorios', '$routeParams', '$location', '$timeout', 'toastr', function ($scope, Laboratorios, $routeParams, $location, $timeout, toastr) {
	$scope.ajustes = {
	    menu:{
	      titulo: 'Gestión de Laboratorios',
	      items:[
	        {nombre:'Laboratorios', enlace:'#/laboratorios', estilo:''},
	        {nombre:'Registrar Laboratorio', enlace:'#/laboratorios/create', estilo:''}]
	    },
	    pagina:{
	      titulo:'Editar Laboratorio',
	      action: "EDITAR"
	    }
	};

	var FunG = localStorage.getItem("Funcionario");
	var FunG = JSON.parse(FunG);
	//var es_id = FunG.es_id;
	
	var amb_id = $routeParams.amb_id;
	Laboratorios.get({amb_id:amb_id}, function(data)
	{
		$scope.laboratorio = data.ambiente;
		$scope.laboratorios ={
			amb_nombre:$scope.laboratorio.ambientes.amb_nombre,
			amb_tipo:$scope.laboratorio.ambientes.amb_tipo,
			amb_descripcion:$scope.laboratorio.ambientes.amb_descripcion,
			lab_cod:$scope.laboratorio.laboratorios.lab_cod,
			fun_id:$scope.laboratorio.laboratorios.fun_id
		};
	});
console.log($scope.laboratorios,"CONSULTORIOS");
	$scope.submit = function(a){
		console.log($scope.laboratorios,"CONSULTORIOS 22222222");
		Laboratorios.update({amb_id:amb_id}, $scope.laboratorios).$promise.then(function(data){
			if(data.status) {
				console.log("data edit..................",data);
				$scope.ajustes.pagina.success = "LOS DATOS FUERON ACTUALIZADOS CORRECTAMENTE";
	        	toastr.success('LOS DATOS FUERON ACTUALIZADOS CORRECTAMENTE');
		        $timeout(function() {
		        	console.log(data.laboratorio.ambientes.amb_id,"AAAAAAAAAAAAAAAAAA");
		          	$location.path('/laboratorios/ver/'+data.laboratorio.ambientes.amb_id);	          	
		        },0);
			}
		})
	}
}])