'use strict';
angular.module('adminApp')

.controller('HomeCtrlEnf', ['$scope','Enfermedades','$route', 'toastr', function ($scope, Enfermedades, $route, toastr) 
{
$scope.ajustes = {
    menu:{
      titulo: 'Gestión de Enfermedades',
      items:[
       {nombre:'Gestión de Parasitos', enlace:'#/parasito', estilo:''},
        {nombre:'Gestión de Tratamientos', enlace:'#/tratamiento', estilo:''},
        {nombre:'Gestión de Enferemdades', enlace:'#/homeenfermedad', estilo:'active'},
         {nombre:'Paises', enlace:'#/homepais', estilo:''}
       ]
        
    },
    pagina:{
      titulo:'Lista de Enfermedades'
    }
  }
  $scope.sortType = 'enfe_id'; // ESTABLECIENDO EL TIPO DE ORDENAMIENTO
  $scope.sortReverse  = true;  // PARA ORDENAR ASCENDENTEMENTO O DESCENDENTEMENTE
  $scope.loading=true;//PARA HACER UN LOADING EN EL TEMPLATE

  Enfermedades.get(function(data) {
		$scope.enfermedad = data.enfermedad;
    //PARA HACER UN LOADING EN EL TEMPLATE
    if(data.status){
      $scope.loading = false;
      $scope.msg = data.status;
    }
	}); 

  //PARA OBTENER EL ID DE LA VACUNA Y QUE NO SE PIERDA AL USAR LA VENTANA MODAL
  var id=0;
  $scope.nombre = "";
  $scope.get_enfe_id  = function(enfe_id, enfe_nombre){
    id=enfe_id;
    console.log(id);
    $scope.nombre = enfe_nombre;
    console.log($scope.nombre);
  }

  $scope.remove = function() {
    console.log(id);
  	Enfermedades.delete({enfe_id:id}).$promise.then(function(data){
  		if(data.msg){
  			//MENSAJE CON TOAST
        toastr.success('Vacuna eliminada correctamente');
        $route.reload();
  		}
  	})
  }

}])

.controller('EditCtrlEnf', [/*'authUser', */'$scope', 'Enfermedades','$routeParams', '$location', '$timeout', 'toastr',
 function (/*authUser,*/ $scope, Enfermedades, $routeParams, $location, $timeout, toastr) {
	// if(authUser.isLoggedIn()){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Enfermedades',
      items:[
        {nombre:'Crear Enfermedad', enlace:'#/createenfermedad', estilo:''},
        {nombre:'Enfermedades', enlace:'#/homeenfermedad', estilo:''}]
        
    },
    pagina:{
      titulo:'Editar Enfermedad',
      action:'EDITAR'
    }
  }
  $scope.patternCadena = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ .]*$/;
  $scope.patternCadenaNumero = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ. 0-9]*$/;
  $scope.patternCadenaNumero2 = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ., 0-9()-º]*$/;
  var enfe_id = $routeParams.enfe_id; //Obtiene el id
	Enfermedades.get({enfe_id:enfe_id}, function(data){
	 $scope.enfermedad = data.enfermedad;
   $scope.submit = function(){ 
    $scope.enfer = 
    { enfe_nombre : $scope.enfermedad.enfermedad.enfe_nombre,
      enfe_causas : $scope.enfermedad.enfermedad.enfe_causas,
      enfe_consecuencia : $scope.enfermedad.enfermedad.enfe_consecuencia,
      enfe_descripcion : $scope.enfermedad.enfermedad.enfe_descripcion,
      enfe_prevencion : $scope.enfermedad.enfermedad.enfe_prevencion,}
    Enfermedades.update({enfe_id:$scope.enfermedad.enfermedad.enfe_id}, $scope.enfer).$promise.then(function(data)
    {
      if(data.status){ 
        angular.copy({}, $scope.enfermedad);
        $scope.ajustes.pagina.success = "Datos de la enfermedad editados correctamente"
        toastr.success('Enfermedad editada correctamente');
        $timeout(function() {
          $location.path('/verenfermedad/'+data.enfermedad.enfe_id);
        },0);
      }
    })
   }
	});
// } else {
//   $location.path('/inicio');
// }	
}])

.controller('VerCtrlEnf', [/*'authUser',*/ '$scope', 'Enfermedades','$routeParams', '$location', 
  function (/*authUser,*/ $scope, Enfermedades, $routeParams, $location) {
  // if(authUser.isLoggedIn()){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Enfermedades',
      items:[
        
        {nombre:'Crear Enfermedad', enlace:'#/createenfermedad', estilo:''},
        {nombre:'Enfermedades', enlace:'#/homeenfermedad', estilo:''}]
    },
    pagina:{
      titulo:'Detalle de patología:'
    }
  }
  
  // var enfe_id = $routeParams.enfe_id;
  // $scope.enfe_nombre = $routeParams.enfe_nombre;
  var enfe_id = $routeParams.enfe_id; //Obtiene el id
  Enfermedades.get({enfe_id:enfe_id}, function(data){
  $scope.enfermedad = data.enfermedad;
  });
        
// } else {
//   $location.path('/inicio');
// }
}])
.controller('CreateCtrlEnf', ['$scope','Enfermedades', '$location', '$timeout', 'toastr',
  function ($scope, Enfermedades, $location, $timeout, toastr){
	$scope.ajustes = {
    menu:{
      titulo: 'Gestión de Enfermedades',
      items:[
        {nombre:'Crear Enfermedad', enlace:'#/createenfermedad', estilo:'active'},
        {nombre:'Enfermedades', enlace:'#/homeenfermedad', estilo:''}]
    },
    pagina:{
      titulo:'Crear Enfermedad',
      action:'GUARDAR'
    }
  }
	$scope.enfermedad = {
		enfe_nombre: "",
		enfe_causas: "",
		enfe_consecuencia: "",
		enfe_descripcion: "", 
		enfe_prevencion: ""
		
	};

  $scope.patternCadena = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ .]*$/;
  $scope.patternCadenaNumero = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ. 0-9]*$/;
  $scope.patternCadenaNumero2 = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ., 0-9()-º]*$/;
  
	$scope.submit = function(){
		Enfermedades.save($scope.enfermedad).$promise.then(function(data){
			if(data.msg){	
  			angular.copy({}, $scope.enfermedad);
  			toastr.success('Enfermedad creada correctamente');
        $scope.ajustes.pagina.success = "Enfermedad creada correctamente";
        $timeout(function() {
          $location.path('/homeenfermedad');
        },0);
			}
		});
	}

  $scope.reset = function(form) {
    //$scope.establecimiento = {};
    if (form) {
      //console.log(form);
      form.$setPristine();
      form.$setUntouched();
    }
  };
}])



