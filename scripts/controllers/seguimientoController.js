'use strict';
angular.module('adminApp')
.controller('SeguimientoTramiteCtrl', ['$scope', 'CONFIG', 'Seguimiento', '$route', '$resource', '$routeParams', 'toastr', '$location', '$timeout', '$http', function ($scope, CONFIG, Seguimiento, $route, $resource,$routeParams, toastr, $location, $timeout,$http) {
        $scope.ajustes = {
          menu:{
            titulo: 'Gestion de Consultas',
            items:[
              {nombre:'Ciudadanos Registrados', enlace:'#/persona-usacsia', estilo:'active'}]
          },
          pagina:{
            titulo:'Seguimiento a trámite Carné Sanitario'
          }
        },
        $scope.buscaTramite=function() {
            console.log('datos----', $scope.datos)
            Seguimiento.get($scope.datos, function(data){
              console.log('*******la data---------', data);
                var pt_id = data.pt_id;
              if (pt_id) {
                    $timeout(function() {
                            $location.path('/seguimiento-tramite-cas/'+pt_id);
                        },1000);
              }else{
                console.log('esto es----',data.message);
                $scope.message=data.message;
              }
            });
        }

}])

.controller('SeguimientoVerCtrl', ['$scope', 'PersonaTramite', 'UltimaFichaAtendida', 'UltimaPL', '$route', '$resource', '$routeParams', 'toastr', '$location', '$timeout', function ($scope, PersonaTramite,UltimaFichaAtendida, UltimaPL, $route, $resource,$routeParams, toastr, $location, $timeout) {
    $scope.ajustes = {
      menu:{
        titulo: 'Gestion de Consultas',
        items:[
          {nombre:'Ciudadanos Registrados', enlace:'#/persona-usacsia', estilo:'active'}]
      },
      pagina:{
        titulo:'Ficha Clínica'
      }
    }
    var pt_id=$routeParams.pt_id;
    PersonaTramite.get({pt_id:pt_id},function (data) {
      console.log('data-------', data);
      $scope.pertramite=data.pertramite;
      // console.log('data-------', $scope.persona);
      $scope.ajustes.pagina.titulo='Trámite Nro:'+$scope.pertramite.persona_tramite.pt_numero_tramite
    });
    UltimaFichaAtendida.get({pt_id:pt_id}, function (argument) {
        $scope.pruebam=argument.prueba_medica;
        $scope.receta=argument.receta;
        // console.log('argument',  $scope.pruebam);
    });

    UltimaPL.get({pt_id:pt_id}, function (upl) {
        $scope.plab=upl;
    })  

}])


