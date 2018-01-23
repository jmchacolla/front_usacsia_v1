'use strict';
angular.module("adminApp")

.controller('ListarDocumentoCtrl', ['$scope', 'Documento', '$route','$routeParams', 'toastr', '$location',
function ($scope, Documento, $route,$routeParams,toastr,$location)
{
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de tramites de Carné Sanitario',
      items:[
        {nombre:'Requisitos para el trámite de Certificado sanitario', enlace:'#/documento', estilo:'active'},
        {nombre:'Crear documento como requisito', enlace:'#/documento/crear', estilo:''}]
    },
    pagina:{
      titulo:'Documentos requeridos para el registro del establecimiento'
    }
  }

  console.log('LLEGO AL CONTROLADOR del crear docmuento---------');
    Documento.get(function(data){
      $scope.documentos=data.documento;
    });
  

}])


.controller('CrearDocumentoCtrl', ['$scope', 'Documento', '$route','$routeParams', 'toastr', '$location',
function ($scope, Documento, $route,$routeParams,toastr,$location)
{
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de trámites de Carné Sanitario',
      items:[
        {nombre:'Requisitos para el tramite de Certificado sanitario', enlace:'#/documento', estilo:''},
        {nombre:'Crear documento como requisito', enlace:'#/documento/crear', estilo:'active'}]
    },
    pagina:{
      titulo:'Crear documento como requisito'
    }
  }

  $scope.documento={
    doc_nombre:"",
    doc_importancia:"",
    doc_importancia_e:""
  }

  console.log('LLEGO AL CONTROLADOR del crear docmuento---------');
    $scope.submit=function(){
      Documento.save($scope.documento).$promise.then(function(data){
          if(data.status
            ){
            $scope.ajustes.pagina.success = "El documento requisito registrada exitosamente";
            toastr.success('Documento requisito Guardado correctamente');
            $location.path('/documento');
          }
        });
    };
    

}])
