'use strict';
angular.module('adminApp')
.controller('PaisCtrl', ['$scope', 'Paises',
 function ($scope, Paises) {
	$scope.ajustes = {
    menu:{
      titulo: 'Gestión de País',
      items:[
        {nombre:'Gestión de Parasitos', enlace:'#/parasito', estilo:''},
        {nombre:'Gestión de Tratamientos', enlace:'#/tratamiento', estilo:''}
        ,
        {nombre:'Gestión de Zonas', enlace:'#/zonas', estilo:''},
         {nombre:'Paises', enlace:'#/homepais', estilo:'active'}
       ]
       },
    pagina:{
      titulo:'Paises'
      
    }
  }
  $scope.sortType = 'nac_id'; // ESTABLECIENDO EL TIPO DE ORDENAMIENTO
  $scope.sortReverse  = true;  // PARA ORDENAR ASCENDENTEMENTO O DESCENDENTEMENTE
  $scope.loading=true;//PARA HACER UN LOADING EN EL TEMPLATE
	Paises.get(function(data){
		$scope.paises = data.pais;
    //PARA HACER UN LOADING EN EL TEMPLATE
    if(data.status){
      $scope.loading = false;
      $scope.msg = data.status;
    }
	})
}]);