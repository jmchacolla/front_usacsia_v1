'use strict';
angular.module("adminApp")

.controller('FirmaCrearCtrl', ['$scope','CONFIG','PersonaporCI','Firma', '$route', 'toastr',
  function ($scope, CONFIG,PersonaporCI,Firma, $route, toastr){
  $scope.ajustes = {
    //Configuraciones del menu:
    menu:{
      titulo: 'Crear firma',
      items:[
        {nombre:'Firma', enlace:'#/firma/crear', estilo:'active'}
        ]
    },
    //Configuraciones de la página
    pagina:{
      titulo:'Crear firma'
    } 
  }

  
  var FunG = localStorage.getItem("Funcionario");
  var FunG=JSON.parse(FunG);
  var fun_id=FunG.fun_id;

  var SesionG = localStorage.getItem("Sesion");
  var id = 0;
  $scope.firma={
    fun_id:fun_id,
    fir_url:"./img-firma/",
    fir_name:""
  }

  $scope.submitf=function(){
    $scope.firma.fir_name=$scope.firma.fir_nombre;
    console.log('lo que va a crear', $scope.firma);
      Firma.save($scope.firma).$promise.then(function(data){
        if(data.status){
          $scope.ajustes.pagina.success = "Firma cargada correctamente";
          toastr.success('Firma cargada correctamente');
      }
  });    
  }

}])
