'use strict';
angular.module("adminApp")

.controller('ListaConsultorioCtrl',['CONFIG', /*'authUser',*/'$scope', '$routeParams','Consultorios','ConsultoriosLista', /*'Cons',*/ 'toastr', '$route',
function (CONFIG,/*authUser,*/ $scope, $routeParams, Consultorios,ConsultoriosLista, /*Cons,*/ toastr, $route){
	$scope.ajustes = {
	    menu:{
	      titulo: 'Gestión de Consultorios',
	      items:[
	        {nombre:'Consultorios', enlace:'#/consultorios', estilo:'active'},
	        {nombre:'Registrar Consultorio', enlace:'#/consultorios/create', estilo:''}]
	    },
	    pagina:{
	      titulo:'Consultorios'
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
	Consultorios.get(function(data)
	{
		$scope.consultorios = data.consultorios;
		console.log($scope.consultorios);
		if(($scope.consultorios.length >0 && data.status) ){
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
	$scope.get_con_id = function(con_id, con_nombre){
	    id=con_id;
	    $scope.nombre = con_nombre;
	}

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

.controller('VerConsultorioCtrl', ['$scope'/*,'Cons'*/,'$route','$routeParams','$location','toastr', /*'ServicioConsultorios', 'EstablecimientoPresta'*/'Consultorios', function ($scope,/*Cons,*/$route,$routeParams,$location,toastr,Consultorios/*,ServicioConsultorios,EstablecimientoPresta*/){
	$scope.ajustes = {
	    menu:{
	      titulo: 'Gestión de Consultorios',
	      items:[
	        {nombre:'Consultorios', enlace:'#/consultorios', estilo:''},
	        {nombre:'Registrar Consultorio', enlace:'#/consultorios/create', estilo:''}]
	    },
	    pagina:{
	      titulo:'Detalle de Consultorio',
	      action: "AGREGAR OTRO SERVICIO"
	    }
	};

	var FunG = localStorage.getItem("Funcionario");
	var FunG = JSON.parse(FunG);
	//var es_id = FunG.es_id;
	/*EstablecimientoPresta.get({es_id:es_id}, function(data)
    {
        $scope.prestas = data.servicio_especialidad;
    });*/
  	
  	var amb_id = $routeParams.amb_id;
  	console.log("id",amb_id);
	Consultorios.get({amb_id:amb_id}, function(data)
	{
		$scope.consultorios = data.ambiente;
		console.log("son los consultorios",$scope.consultorios);
	});
	
	/*$scope.servicios_consultorios = {
		con_id : con_id,
		se_id : null
	}*/
/*	$scope.get_ser = function(id,nombre_servicio){
		$scope.se_sc_id = id;//recibe sc_id cuando quita un servicio y recibe se_id cuando agrega un servicio 
		$scope.nombre_servicio = nombre_servicio;
	}*/

	/*$scope.asigna_servicio_consultorio = function(se_id1){//Para agregar más servicios a un consultorio
		$scope.servicios_consultorios.se_id = se_id1;
		ServicioConsultorios.save($scope.servicios_consultorios).$promise.then(function(data){
			if(data.msg){
				angular.copy({},$scope.servicios_consultorios);
				toastr.success('SERVICIO AGREGADO CORRECTAMENTE');
        		$route.reload();
			} else{
				toastr.error("ERROR INESPERADO, POR FAVOR VUELVA A INTENTAR");
			}
		});
	}

	$scope.quitar = function(sc_id) {
		ServicioConsultorios.delete({sc_id:sc_id}).$promise.then(function(data){
	      if(data.mensaje) {
	        $route.reload();
	        toastr.success('SERVICIO QUITADO CORRECTAMENTE');
	      }
	    })
	}*/
}])


.controller('CrearConsultorioCtrl', ['$scope','Cons','$location', '$timeout', 'toastr'/*, 'EstablecimientoPresta', 'ServicioConsultorios'*/, function ($scope,Cons, $location, $timeout, toastr/*,EstablecimientoPresta,ServicioConsultorios*/){
 	$scope.ajustes = {
	    menu:{
	      titulo: 'Gestión de Consultorios',
	      items:[
	        {nombre:'Consultorios', enlace:'#/consultorios', estilo:''},
	        {nombre:'Registrar Consultorio', enlace:'#/consultorios/create', estilo:'active'}]
	    },
	    pagina:{
	      titulo:'Registrar Consultorio',
	      action: "GUARDAR"
	    }
	};
 	var FunG = localStorage.getItem("Funcionario");
	var FunG = JSON.parse(FunG);
	//var es_id = FunG.es_id;

 /*	EstablecimientoPresta.get({es_id:es_id}, function(data) {
        $scope.prestas = data.servicio_especialidad;
    });*/

	$scope.consultorios ={
		usa_id:1,
		amb_nombre:"",
		amb_tipo:"CONSULTORIO",
		amb_descripcion:"",
		con_cod:"",
		con_tipo:null,
		
	};

/*	$scope.servicios_consultorios = {
		con_id : null,
		se_id : null
	}
*/
	$scope.patternCadena = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$/;
  	$scope.patternCadenaNumero = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ 0-9,]*$/;
  
	$scope.submit =function()
	{
		$scope.consultorios.amb_tipo="CONSULTORIO";
		Cons.save($scope.consultorios).$promise.then(function(data)
		{
			if(data.msg)
			{
				console.log("DATA",data);
				angular.copy({},$scope.consultorios);
				$scope.ajustes.pagina.success ="CONSULTORIO REGISTRADO CORRECTAMENTE";
				toastr.success('CONSULTORIO REGISTRADO CORRECTAMENTE');
        		$timeout(function() {
            		$location.path('/consultorios/ver/'+data.consultorio.ambientes.amb_id);
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

.controller('EditConsultorioCtrl', ['$scope', 'Consultorios', 'ListaFunCargo', 'Horario', '$routeParams', '$location', '$timeout', 'toastr', function ($scope, Consultorios, ListaFunCargo, Horario, $routeParams, $location, $timeout, toastr) {
	$scope.ajustes = {
	    menu:{
	      titulo: 'Gestión de Consultorios',
	      items:[
	        {nombre:'Consultorios', enlace:'#/consultorios', estilo:''},
	        {nombre:'Registrar Consultorio', enlace:'#/consultorios/create', estilo:''}]
	    },
	    pagina:{
	      titulo:'Editar Consultorio',
	      action: "EDITAR"
	    }
	};

	var FunG = localStorage.getItem("Funcionario");
	var FunG = JSON.parse(FunG);
	//var es_id = FunG.es_id;
	$scope.medico=null;
    $scope.enfermera=null;
	var amb_id = $routeParams.amb_id;
	Consultorios.get({amb_id:amb_id}, function(data)
	{
		$scope.consultorio = data.ambiente;
		$scope.consultorios ={
			amb_nombre:$scope.consultorio.ambientes.amb_nombre,
			amb_tipo:$scope.consultorio.ambientes.amb_tipo,
			amb_descripcion:$scope.consultorio.ambientes.amb_descripcion,
			con_cod:$scope.consultorio.consultorios.con_cod,
		};
	});
    $scope.horario={
        fun_id:null,
        amb_id:amb_id,
        ser_id:1
    }
    $scope.horario2={
        fun_id:null,
        amb_id:amb_id,
        ser_id:1
    }

    $scope.medico={cargo:"MEDICO"};

    ListaFunCargo.get($scope.medico, function (argument) {
        console.log('medicos---------',argument);
        $scope.medicos=argument.funcionario;
    })
    $scope.enfermera={cargo:"ENFERMERA"};
    ListaFunCargo.get($scope.enfermera, function (data) {
        $scope.enfermeras=data.funcionario;
    })

    
    // console.log($scope.consultorios,"CONSULTORIOS");
	$scope.submit = function(a){
            console.log('entrooooi-------', $scope.medico, $scope.enfermera);
            console.log('$scope.horario.fun_id--', $scope.horario.fun_id);
            if($scope.horario.fun_id!=null){
                Horario.save($scope.horario, function (argument) {
                    if (argument.status) {
                        toastr.success('ASIGNACION DE PERSONAL CORRECTA')
                    }
                })
            }
            console.log('2$scope.horario.fun_id--', $scope.horario2.fun_id);
            if($scope.horario2.fun_id!=null){
                Horario.save($scope.horario, function (argument) {
                    if (argument.status) {
                        toastr.success('ASIGNACION DE PERSONAL CORRECTA')
                    }
                })
            }
		console.log($scope.consultorios,"CONSULTORIOS 22222222");
		Consultorios.update({amb_id:amb_id}, $scope.consultorios).$promise.then(function(data){
			if(data.status) {
				console.log("data edit..................",data);
				$scope.ajustes.pagina.success = "LOS DATOS FUERON ACTUALIZADOS CORRECTAMENTE";
	        	toastr.success('LOS DATOS FUERON ACTUALIZADOS CORRECTAMENTE');
		        $timeout(function() {
		        	console.log(data.consultorio.ambientes.amb_id,"AAAAAAAAAAAAAAAAAA");
		          	$location.path('/consultorios/ver/'+data.consultorio.ambientes.amb_id);	          	
		        },0);
			}
		})
	}
}])