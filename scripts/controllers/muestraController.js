'use-strict';
angular.module("adminApp")
.controller('NumeroMuestraController', ['$http','CONFIG','$scope','Muestra', '$route', 'toastr', function ($http,CONFIG,$scope,Muestra, $route, toastr){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Muestras',
      items:[
        {nombre:'Asignación de Número de Muestra', enlace:'#/numero-muestra/crear', estilo:'active'},
        {nombre:'Muestras asignadas', enlace:'#/numero-muestra', estilo:''}]
    },
    pagina:{
      titulo:'Asignación de Número de Muestra'
    }
  }
  $scope.CurrentDate=new Date();
  $scope.muestra={
    pt_id:null,
  }
  $scope.num_muestra_traido_del_crear=0;
  $scope.aux=null;
  $scope.savem=function(a,b)
  {
     $scope.muestra.pt_id=a;
     $scope.muestra.mue_num_muestra=b;
    Muestra.save($scope.muestra).$promise.then(function(data)
    {
      if(data.status)
      {
        $scope.ajustes.pagina.success="Muestra asignada exitosamente";
        $scope.aux=data.muestra.mue_num_muestra;
        $scope.aux2=data.muestra.mue_id;
        console.log('ESTE ES EL NUMERO DE MUESTRA QUE SE ASIGNÓ',$scope.aux,$scope.aux2);
        verNumeroMuestra($scope.aux2);
        toastr.success('Muestra asignada correctamente');
      }
    });
  }
  function verNumeroMuestra(mue_id){
      $http.get(CONFIG.DOMINIO_SERVICIOS+'/muestra/'+mue_id).success(function(respuesta){
          $scope.num_muestra_traido_del_crear = respuesta.muestra.mue_num_muestra;
          console.log('llamo a la funcion', $scope.num_muestra_traido_del_crear);
      });
  }


  $scope.recarga=function(){
    $route.reload();
  }

}])




.controller('ListarMuestraController', ['$scope','Muestra', '$route', 'toastr', function ($scope,Muestra, $route, toastr){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Muestras',
      items:[
        {nombre:'Muestras asignadas', enlace:'#/numero-muestra', estilo:'active'}]
    },
    pagina:{
      titulo:'Números de muestra asignados'
    }
  }
    Muestra.get(function(data){
    $scope.muestra = data.muestra;
    if(data.muestra.length>0){
      $scope.loading = false;
      $scope.msg = true;
    }
    else{
      $scope.loading = false;
      $scope.msg = false;
    }    
    },function () {
      toastr.error("ERROR INESPERADO, por favor actualize la página");
      $scope.loading = false;
      $scope.msg = false;
    });

}])

.controller('apiAppCtrl_persona', ['$http', '$scope', 'CONFIG', '$route', buscaPersonaController])
function buscaPersonaController($http, $scope, CONFIG, $route){
  $scope.buscaPersona = function($per_ci){
    console.log('esta buscando persona',$scope.per_ci);
      $scope.tamanio="Cargando...";//////CAMBIADO
      $http.get(CONFIG.DOMINIO_SERVICIOS+'/buscar_persona_tramite/'+$scope.per_ci).success(function(respuesta){
          $scope.persona_tramite = respuesta.persona_tramite;
          $scope.numero_muestra = "numero que yo puse";
          $scope.tamanio="";
          if(respuesta.persona_tramite){
              $scope.tamanio="";
              $scope.ver=true;
              $scope.switch=false;
          } else if(!respuesta.persona_tramite){
              $scope.ver=false;
              $scope.tamanio="La persona con el carnet ingresado, no inició un Trámite";
          }
          if(respuesta.muestra){
              $scope.tamanio="La persona ya cuenta con un numero de muestra";
              $scope.verprueba=true;
          }
      });
  }
}



