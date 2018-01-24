'use strict';
angular.module("adminApp")
// ------ CONTRAREFERENCIA -------
.controller('ListarParasitoCtrl',['$scope','CONFIG', 'Parasito','$routeParams', '$route', 'toastr', '$location','$timeout',
  function ($scope, CONFIG, Parasito,$routeParams, $route, toastr, $location,$timeout){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Parasitos',
      items:[
       {nombre:'Gestión de Parasitos', enlace:'#/parasito', estilo:'active'},
        {nombre:'Gestión de Tratamientos', enlace:'#/tratamiento', estilo:''},
        
        {nombre:'Gestión de Zonas', enlace:'#/zonas', estilo:''},
         {nombre:'Paises', enlace:'#/homepais', estilo:''}
        ]
    },
    pagina:{
      titulo:'Parasitos'
    }
  }

  
  Parasito.get(function(data){
    $scope.parasitos = data.parasito;
    if(data.parasito.length>0){
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
    $scope.get_id = function(id,nombre,descripcion,clasificacion)
    {
      ide=id;
      $scope.nombre=nombre;
      $scope.descripcion=descripcion; 
      $scope.clasificacion=clasificacion;

      console.log("llego----",ide,$scope.nombre);
    }

    $scope.editar=function(b,c,d){
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
    }
    
    $scope.get_id1 = function(id,nombre)
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
    }

}])

.controller('CrearParasitoCtrl',['$scope','CONFIG', 'Parasito','$routeParams', '$route', 'toastr', '$location','$timeout',
  function ($scope, CONFIG, Parasito,$routeParams, $route, toastr, $location,$timeout){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Parasitos',
      items:[
         {nombre:'Parasitos', enlace:'#/parasito', estilo:''},
        {nombre:'Crear Parasito', enlace:'#/parasito/crear', estilo:'active'}
        ]
    },
    pagina:{
      titulo:'Crear Parasito'
    }

  }

  $scope.parasito={
    par_nombre:"",
    par_descripcion:"",
    par_clasificacion:""
  }

  $scope.verb=false;
    $scope.verbutton=function()
    {
      if(!$scope.verb)
        $scope.verb=true;
      else{
        $scope.verb=false;
      }
    };

    $scope.ver=false;
    $scope.vertratamientos=function()
    { 
      if(!$scope.ver)
        $scope.ver=true;
      else{
        $scope.ver=false;
      }
    };

  $scope.save=function()
  {
    Parasito.save($scope.parasito).$promise.then(function(data)
    {
      if(data.status)
      {
        angular.copy({},$scope.parasito);

        $scope.ajustes.pagina.success="Parasito creado exitosamente";
        toastr.success('Parásito creado correctamente');
        $timeout(function() {
        console.log("lleoooooooooooooooooooooooooooooo");
          $location.path('/parasito/ver/'+data.parasito.par_id);
        },1);
      }
    });

  }
}])

.controller('VerParasitoCtrl',['$scope','CONFIG', 'Parasito','Tratamiento2','ParasitoTratamiento1','ParasitoTratamiento','$routeParams', '$route', 'toastr', '$location','$timeout',
  function ($scope, CONFIG, Parasito,Tratamiento2,ParasitoTratamiento1,ParasitoTratamiento,$routeParams, $route, toastr, $location,$timeout){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Parasitos',
      items:[
        {nombre:'Referencias Realizadas', enlace:'#/referencias', estilo:''},
        {nombre:'Referencias Recibidas', enlace:'#/referenciasRec', estilo:''},
        {nombre:'Contrareferencias Realizadas', enlace:'#/contrareferenciasrea', estilo:'active'}
        ]
    },
    pagina:{
      titulo:'Parasito: '
    }
  }
    var par_id=$routeParams.par_id;
    Parasito.get({par_id:par_id},function(data){
      $scope.parasito=data.parasito;
      
    })
    
    Tratamiento2.get({par_id:par_id},function(data){
      $scope.tratamiento=data.tratamiento;
      console.log("deberia mostrar los tratamientos que no estan asignados"+data.tratamiento);
    })


      $scope.parasitoTratamiento={
      par_id:par_id,
      trat_id:null
      }

      ParasitoTratamiento1.get({par_id:par_id},function(data){
        $scope.ptrat=data.parasito_tratamiento;
        console.log("deberia mostrar todos los tratmientos del parasito "+data.parasito_tratamiento);
      })

    $scope.asigna_tratamiento_parasito=function()
    {
      ParasitoTratamiento.save($scope.parasitoTratamiento).$promise.then(function(data)
      {
        if(data.status)
        {
          $scope.ajustes.pagina.success="Tratamiento agregado exitosamente";
          toastr.success('Tratamiento agregado correctamente');
          $route.reload();
        }else{
        toastr.error("ERROR INESPERADO, POR FAVOR VUELVA A INTENTAR");
      }
      });
    }
    var ide=0;
    $scope.get_id = function(id,nombre)
    {
      ide=id;
      $scope.nombre=nombre;
    }

    $scope.retirar = function() {
    ParasitoTratamiento.delete({pt_id:ide}).$promise.then(function(data){
        if(data.status) {
          $route.reload();
          toastr.success('Tratamiento retirado exitosamente');
        }else{
        toastr.error("ERROR INESPERADO, POR FAVOR VUELVA A INTENTAR");
      }
      })
  }
}])