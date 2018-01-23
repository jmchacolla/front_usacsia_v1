'use strict';
angular.module("adminApp")

.controller('CrearPJuridicaCtrl', ['$scope','PJuridica', '$route', 'toastr','$location',
  function ($scope, PJuridica,$route, toastr,$location){
    $scope.pjur={
      pjur_razon_social:"",
      pjur_nit:null,
      pro_tipo:"J"
    }

    $scope.save_pjuridica=function(){
      console.log("es lo que se va a crear",$scope.pjur);
      PJuridica.save($scope.pjur).$promise.then(function(data){
        if(data.status){
          $scope.ajustes.pagina.success = "Empresa creada correctamente";
          toastr.success('Empresa creada correctamente');

          $location.path('/establecimientosol/empresa/ver/'+data.pjuridica.pjur.pjur_nit);
        }
      });
    }
}])

.controller('VerPJuridicaCtrl', ['$scope','$routeParams','PJuridica', '$route', 'toastr',
  function ($scope,$routeParams, PJuridica,$route, toastr){
    $scope.ajustes = {
    //Configuraciones del menu:
    menu:{
      titulo: 'Gestión de Establecimientos Solicitantes, Persona registrada',
      items:[
        {nombre:'Establecimientos', enlace:'#/establecimientossol', estilo:''},
        {nombre:'Nuevo establecimiento', enlace:'#/establecimientosol/persona', estilo:'active'}]
    },
    //Configuraciones de la página
    pagina:{
      titulo:'Gestión de Establecimientos Solicitantes, Empresa registrada'
    }
  }
    var pjur_nit=$routeParams.pjur_nit;
    PJuridica.get({pjur_nit:pjur_nit},function(data){
      $scope.pjuridica=data.pjuridica;
    });
}])


