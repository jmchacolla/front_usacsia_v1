'use strict';
angular.module("adminApp")

.controller('ListarZonaCtrl',['$scope','CONFIG', 'Zonas','$routeParams', '$route', 'toastr', '$location','$timeout',
  function ($scope, CONFIG, Zonas,$routeParams, $route, toastr, $location,$timeout){
  $scope.ajustes = {
    menu:{
      titulo: 'Trámites administrativos',
      items:[
       {nombre:'Gestión de Parasitos', enlace:'#/parasito', estilo:''},
        {nombre:'Gestión de Tratamientos', enlace:'#/tratamiento', estilo:''}/*,
        {nombre:'Gestión de Enferemdades', enlace:'#/homeenfermedad', estilo:''}*/,
        {nombre:'Gestión de Zonas', enlace:'#/parasito', estilo:'active'},
         {nombre:'Paises', enlace:'#/homepais', estilo:''}
        ]
    },
    pagina:{
      titulo:'Zonas'
    }
  }
  $scope.zon=false;
  $scope.ver_zonas=function(mun_id){
      console.log(mun_id+"<<< MUN_ID");
      Zonas.get({mun_id:mun_id}, function(data){
          $scope.zonas=data.zona;
          console.log("ZOnasss",$scope.zonas);
          if ($scope.zonas.length!=0) {
          $scope.zon=true;
          console.log("mostrar zonas "+$scope.zon);
          }
          else{
            console.log("no hay zonas "+$scope.zon);
          }
        
      })
  };



  /*  var  ide=0;
    $scope.get_id = function(id,nombre,descripcion,clasificacion)
    {
      ide=id;
      $scope.nombre=nombre;
      $scope.descripcion=descripcion; 
      $scope.clasificacion=clasificacion;

      console.log("llego----",ide,$scope.nombre);
    }
*/
  /*  $scope.editar=function(b,c,d){
      $scope.parasit={
        par_nombre:b,
        par_descripcion:c, 
        par_clasificacion:d,
      }
      console.log('*******para editar ---------', $scope.parasit);
      Parasito.update({par_id:ide},$scope.parasit).$promise.then(function(data)
      {
        if(data.status)
        {
          $scope.ajustes.pagina.success="Parasito editado correctamente";
          toastr.success('Parásito editado correctamente');
          $timeout(function() {
            $route.reload();
          },1);
        }
      })
    }*/
    
/*    $scope.get_id1 = function(id,nombre)
    {
      ide=id;
      $scope.nombre=nombre;
    }

    $scope.remove = function()
    {
      Parasito.delete({par_id:ide}).$promise.then(function(data)
      {
        if(data.mensaje)
        {
          toastr.success('Parásito eliminado correctamente');
          $timeout(function() {
            $route.reload();
          },1);
        }
      })
    }*/

}])

.controller('CrearZonaCtrl',['$scope','CONFIG', 'ZonasG','$routeParams', '$route', 'toastr', '$location','$timeout',
  function ($scope, CONFIG, ZonasG,$routeParams, $route, toastr, $location,$timeout){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Zonas',
      items:[
         {nombre:'Zonas', enlace:'#/zonas', estilo:''},
        {nombre:'Crear Zonas', enlace:'#/zona/crear', estilo:'active'}
        ]
    },
    pagina:{
      titulo:'Crear Zonas'
    }

  }

  $scope.zona={
    mun_id:null,
    zon_macrodistrito:"",
    zon_distrito:"",
    zon_nombre:""
  }



  $scope.save=function()
  {
    ZonasG.save($scope.zona).$promise.then(function(data)
    {
      if(data.status)
      {
        angular.copy({},$scope.zona);

        $scope.ajustes.pagina.success="Zona creada exitosamente";
        toastr.success('Zona creado correctamente');
        /*$timeout(function() {
       
          $location.path('/parasito/ver/'+data.parasito.par_id);
        },1);*/
      }
    });

  }
}])

.controller('VerZonaCtrl',['$scope','CONFIG', 'ZonasG','$routeParams', '$route', 'toastr', '$location','$timeout',
  function ($scope, CONFIG, ZonasG,$routeParams, $route, toastr, $location,$timeout){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Zonas',
      items:[
        {nombre:'Zonas', enlace:'#/zonas', estilo:''}
        ]
    },
    pagina:{
      titulo:'Zona: '
    }
  }
    var zon_id=$routeParams.zon_id;
    ZonasG.get({zon_id:zon_id},function(data){
      $scope.zona=data.zona;
      
    })

    var ide=0;
    $scope.get_id = function(id,nombre)
    {
      ide=id;
      $scope.nombre=nombre;
    }

  }
/*}*/])