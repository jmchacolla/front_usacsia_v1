'use strict';
angular.module("adminApp")
.controller('MunicipioCtrl', ['$scope', 'Municipios', 
	function($scope, Municipios)
{
	$scope.ajustes = {
    menu:{
      titulo: 'Gestión de Municipios',
      items:[
      
        {nombre:'Gestión de Municipios', enlace:'#/homemunicipio', estilo:'active'},
        {nombre:'Listar Tipos de Establecimientos de Salud', enlace:'#/hometipo', estilo:''},
        {nombre:'Gestión de Seguros', enlace:'#/homeseguro', estilo:''},
        {nombre:'Gestión de Institucion', enlace:'#/homeinstitucion', estilo:''},
        {nombre:'Gestión de Subsectores', enlace:'#/homesubsector', estilo:''},
        {nombre:'Gestión de Redes', enlace:'#/homered', estilo:''},
        {nombre:'Gestión de  Roles', enlace:'#/homerol', estilo:''},
        {nombre:'Gestión de Cargos', enlace:'#/homecargo', estilo:''}]
        
       },
    pagina:{
      titulo:'Gestión de Municipios'
      
    }
  }
   $scope.sortType = 'mun_id'; // ESTABLECIENDO EL TIPO DE ORDENAMIENTO
  $scope.sortReverse  = true;  // PARA ORDENAR ASCENDENTEMENTO O DESCENDENTEMENTE
  $scope.loading=true;//PARA HACER UN LOADING EN EL TEMPLATE

	Municipios.get(function(data)
	{
		$scope.municipios = data.municipio;
		//PARA HACER UN LOADING EN EL TEMPLATE
    if(data.status){
      $scope.loading = false;
      $scope.msg = data.status;
    }
	})

}])
.controller('EditCtrlMun', ['$scope', 'Municipios','$routeParams','$location', '$timeout', 'toastr', 'Provincia', 'Region',
         function ($scope, Municipios, $routeParams, $location, $timeout, toastr, Provincia, Region) {
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Municipios',
      items:[
        {nombre:'Crear Municipio', enlace:'#/createmunicipio', estilo:''},
        {nombre:'Gestión de Municipios', enlace:'#/homemunicipio', estilo:''}]
    },
    pagina:{
      titulo:'Editar Municipio',
      action:'EDITAR'
    }
  }
  
  var mun_id = $routeParams.mun_id; //Obtiene el id
  Municipios.get({mun_id:mun_id}, function(data){
  $scope.municipio = data.municipio;
  console.log($scope.municipio);
  });
  $scope.submit = function(){ 
    Municipios.update({mun_id:$scope.municipio.mun_id}, $scope.municipio).$promise.then(function(data)
    {
    if(data.msg){ 
      angular.copy({}, $scope.municipio);
      $scope.ajustes.pagina.success = "Datos del municipio editado correctamente"
      //INICIO MENSAJE TOAST Y PARA REDIRECCIONAR
        toastr.success('Municipio editada correctamente');
        $timeout(function() {
          $location.path('/homemunicipio');
        },0);
        //FIN MENSAJE TOAST Y PARA REDIRECCIONAR
      }
    })
  }

}])

.controller('CreateCtrlMun', ['$scope','Municipios','$location', '$timeout', 'toastr', 
  function ($scope, Municipios, $location, $timeout, toastr){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Municipios',
      items:[
        {nombre:'Crear Municipio', enlace:'#/createmunicipio', estilo:'active'},
        {nombre:'Gestión de Municipios', enlace:'#/homemunicipio', estilo:''}]
    },
    pagina:{
      titulo:'Crear Municipio',
      action:'AÑADIR'
    }
  }
  
  $scope.municipio = {
    mun_nombre: "",
    pro_id: 0,
    reg_id: 0
    
    
  };

  $scope.submit = function(){
    Municipios.save($scope.municipio).$promise.then(function(data){
      if(data.status){ 
        angular.copy({}, $scope.municipio);
        $scope.ajustes.pagina.success = "Municipio creado correctamente";   
        //INICIO MENSAJE TOAST Y PARA REDIRECCIONAR
        toastr.success('Municipio creado correctamente');
        $timeout(function() {
          $location.path('/homemunicipio');
        },0);
        //FIN MENSAJE TOAST Y PARA REDIRECCIONAR
      };
     
    });
  }
}])

