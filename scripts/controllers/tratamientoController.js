'use strict';
angular.module("adminApp")
// ------ CONTRAREFERENCIA -------
.controller('ListarTratamientoCtrl',['$scope','CONFIG', 'Tratamiento','$routeParams', '$route', 'toastr', '$location','$timeout',
  function ($scope, CONFIG, Tratamiento,$routeParams, $route, toastr, $location,$timeout){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Tratamientos',
      items:[
        {nombre:'Gestión de Parasitos', enlace:'#/parasito', estilo:''},
        {nombre:'Gestión de Tratamientos', enlace:'#/tratamiento', estilo:'active'}
        ,
        {nombre:'Gestión de Zonas', enlace:'#/zonas', estilo:''},
         {nombre:'Paises', enlace:'#/homepais', estilo:''}
        ]
    },
    pagina:{
      titulo:'Tratamientos'
    }
  }

  
  Tratamiento.get(function(data){
    
    $scope.tratamiento = data.tratamiento;
        console.log("lleoooooooooooooooooooooooooooooo   ",data);

    if(data.tratamiento.length>0){
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

    var  ide=0;
    $scope.get_id = function(id,nombre,dosis,descripcion)
    {
      ide=id;
      $scope.nombre=nombre;
      $scope.dosis=dosis; 
      $scope.descripcion=descripcion;

      console.log("llego----",ide,$scope.nombre);
    }

    $scope.editar=function(b,c,d){
      $scope.tratamiento={
        trat_nombre:b,
        trat_dosis:c, 
        trat_descripcion:d,
      }
      console.log('*******para editar ---------', $scope.tratamiento);
      Tratamiento.update({trat_id:ide},$scope.tratamiento).$promise.then(function(data)
      {
        if(data.status)
        {
          $scope.ajustes.pagina.success="Tratamiento editado correctamente";
          toastr.success('Tratamiento editado correctamente');
          $timeout(function() {
            $route.reload();
          },1);
        }
      })
    }
    
    $scope.get_id1 = function(id,nombre)
    {
      ide=id;
      $scope.nombre=nombre;
    }

    $scope.remove = function()
    {
      Tratamiento.delete({trat_id:ide}).$promise.then(function(data)
      {
        if(data.mensaje)
        {
          toastr.success('Tratamiento eliminado correctamente');
          $timeout(function() {
            $route.reload();
          },1);
        }
      })
    }

}])

.controller('CrearTratamientoCtrl',['$scope','CONFIG', 'Tratamiento','$routeParams', '$route', 'toastr', '$location','$timeout',
  function ($scope, CONFIG, Tratamiento,$routeParams, $route, toastr, $location,$timeout){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Tratamientos',
      items:[
        {nombre:'Tratamientos', enlace:'#/tratamiento', estilo:''},
        {nombre:'Crear Tratamiento', enlace:'#/tratamiento/crear', estilo:'active'}
        ]
    },
    pagina:{
      titulo:'Crear Tratamiento'
    }
  }

  $scope.tratamiento={
    trat_nombre:"",
    trat_dosis:"",
    trat_descripcion:""
  }

  $scope.save=function()
  {
    Tratamiento.save($scope.tratamiento).$promise.then(function(data)
    {
      if(data.status)
      {
        angular.copy({},$scope.tratamiento);
        $scope.ajustes.pagina.success="Tratamiento creado exitosamente";
        toastr.success('Tratamiento creado correctamente');
        $timeout(function() {
          $location.path('/tratamiento');
        },1);
      }
    });

  }
}])
