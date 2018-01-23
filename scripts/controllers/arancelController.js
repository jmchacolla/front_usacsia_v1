'use strict';
angular.module("adminApp")
.controller('CategoriaCtrl', ['$scope', 'Categoria','$route', '$resource', '$routeParams', 'toastr', '$location', '$timeout', '$http', 'CONFIG', function ($scope, Categoria, $route, $resource,$routeParams, toastr, $location, $timeout, $http, CONFIG) {

    $scope.ajustes = {
      menu:{
        titulo: 'Gestión de Arancel',
        items:[
          {nombre:'Clasificación general', enlace:'#/clasificacion-general', estilo:''},
          {nombre:'Clasificación de especialidad', enlace:'#clasificacion-especialidad', estilo:''},
          {nombre:'Subclacificación', enlace:'#/subclasificacion', estilo:''},
          {nombre:'Categoria', enlace:'#/categoria', estilo:'active'}
          ]
      },
      pagina:{
        titulo:'Listas de Aranceles'
      }
    }
    $scope.verform=false;
    $scope.patternCadena = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$/;
    $scope.patternCadenaNumero = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ 0-9.]*$/;
    // $scope.sortType = 'cat_codigo'; // set the default sort type
    $scope.sortReverse  = true;  // set the default sort order
    $scope.loading=true;  
    Categoria.get(function (data) {
        $scope.categorias=data.categoria;
        console.log($scope.categoria);
        if(data.categoria.length>0){
          $scope.loading = false;
          $scope.msg = true;
        }
        else{
          $scope.loading = false;
          $scope.msg = false;
        }
    },function () {
      toastr.error("ERROR INESPERADO, POR FAVOR ACTUALICE LA PÁGINA");
      $scope.loading = false;
      $scope.msg = false;
    });

    $http.get(CONFIG.DOMINIO_SERVICIOS+"/clasificacion_general").success(function (data) {
        $scope.clasigral = data.clasigral;
        if($scope.clasigral.length > 0){
          $scope.loading = false;
          $scope.msg = true;
        }
        else {
          $scope.loading = false;
          $scope.msg = false;
        }
      },function () {
        toastr.error("Error inesperado");
        }
    );

    $scope.veragregar=function (argument) {
      $scope.verform=!$scope.verform;
    }
    $scope.reset = function(form) {
      $scope.clasificacion_general = {};
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
    }
    $scope.buscaesp=function (cg_id) {
      console.log('cg_id-----',cg_id);
      $http.get(CONFIG.DOMINIO_SERVICIOS+"/buscarcle/"+cg_id).success(function (argument) {
        $scope.cle=argument.cle;
      })
    }
    $scope.buscasub=function (cle_id) {
      console.log('cle_id-----',cle_id);
      $http.get(CONFIG.DOMINIO_SERVICIOS+"/buscarsub/"+cle_id).success(function (argument) {
        $scope.subcla=argument.subcla;
      })
    }
    $scope.catego={
        sub_id:null,
        cat_secuencial:'',
        cat_area:'',
        cat_categoria:'',
        cat_monto:null,
        cat_descripcion:'',
        cat_servicio:''
    };
    $scope.submit=function (data) {
      $scope.verform=!$scope.verform;
      $http.post(CONFIG.DOMINIO_SERVICIOS+"/categoria", $scope.catego).success(function (data) {
          $scope.clasifigral=data.clasigral;
          toastr.success('Registrado exitosamente');
          $route.reload();
        },function () {
          toastr.error("Error de red, al guardar la clasificasión");
          }
      );
    }
    $scope.get_id = function(categoria){
        console.log('categooooooo', categoria);
        $scope.cat=categoria;
    }
    $scope.update=function (clasificasion, cg_codigo) {
      Categoria.update({cat_id:$scope.cat.cat_id}, $scope.cat).$promise.then(function (data) {
        if(data.mensaje) {
            $timeout(function() {
                toastr.success('Modificado exitosamente');
                $route.reload();
            },200);
          
        }
      })
    }
    $scope.remove = function(){
      Categoria.delete({cat_id:$scope.cat.cat_id}).$promise.then(function(data){
        if(data.mensaje) {
          $timeout(function() {
              toastr.success('Eliminado correctamente');
              $route.reload();
          },200);

        }
      })
    }



}])
.controller('ClaGralCrearCtrl', ['$scope', 'ClasificacionGeneral', '$route', '$resource', '$routeParams', 'toastr', '$location', '$timeout', '$http', 'CONFIG', function ($scope, ClasificacionGeneral, $route, $resource, $routeParams, toastr, $location, $timeout, $http, CONFIG) {
    $scope.ajustes = {
      menu:{
        titulo: 'Gestión de Arancel',
        items:[
          {nombre:'Clasificación general', enlace:'#/clasificacion-general', estilo:'active'},
          {nombre:'Clasificación de especialidad', enlace:'#clasificacion-especialidad', estilo:''},
          {nombre:'Subclacificación', enlace:'#/subclasificacion', estilo:''},
          {nombre:'Categoria', enlace:'#/categoria', estilo:''}
          ]
      },
      pagina:{
        titulo:'Agregar Clasificación General'
      }
    }
    $scope.verform=false;

    $http.get(CONFIG.DOMINIO_SERVICIOS+"/clasificacion_general").success(function (data) {
        $scope.clasigral = data.clasigral;
        if($scope.clasigral.length > 0){
          $scope.loading = false;
          $scope.msg = true;
        }
        else {
          $scope.loading = false;
          $scope.msg = false;
        }
      },function () {
        toastr.error("Error inesperado");
        }
    );

      $scope.patternCadena = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$/;
      $scope.patternCadenaNumero = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ 0-9,]*$/;
    $scope.veragregar=function (argument) {
      $scope.verform=!$scope.verform;
    }

    $scope.clasificacion_general={
      cg_codigo:'',
      cg_nombre:''
    };
    $scope.reset = function(form) {
      $scope.clasificacion_general = {};
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
    }
    $scope.submit=function (data) {
      $scope.verform=!$scope.verform;
      $http.post(CONFIG.DOMINIO_SERVICIOS+"/clasificacion_general", $scope.clasificacion_general).success(function (data) {
          $scope.clasifigral=data.clasigral;
          toastr.success('Empleado registrado exitosamente');
          $route.reload();
        },function () {
          toastr.error("Error de red, al guardar la clasificasión");
          }
      );
    }
    //PARA ELIMINAR UN CLASIFICACION GENERAL
    var id = 0;
    $scope.clasificasion = "";
    $scope.cg_codigo = "";
    $scope.get_id = function(cg_id, cg_codigo, cg_nombre){
        id = cg_id;
        $scope.clasificasion = cg_nombre;
        $scope.cg_codigo = cg_codigo;
    }
    $scope.remove = function(){
      ClasificacionGeneral.delete({cg_id:id}).$promise.then(function(data){
        if(data.mensaje) {
          $timeout(function() {
              toastr.success('Eliminado correctamente');
              $route.reload();
          },200);

        }
      })
    }
    $scope.update=function (clasificasion, cg_codigo) {
      var modificar={
        cg_nombre:clasificasion,
        cg_codigo:cg_codigo
      }
      ClasificacionGeneral.update({cg_id:id}, modificar).$promise.then(function (data) {
        if(data.mensaje) {
            $timeout(function() {
                toastr.success('Modificado exitosamente');
                $route.reload();
            },200);
          
        }
      })
    }

}])

.controller('ClaEspCrearCtrl', ['$scope', 'ClasificacionGeneral', 'Cle', '$route', '$resource', '$routeParams', 'toastr', '$location', '$timeout', '$http', 'CONFIG', function ($scope, ClasificacionGeneral, Cle, $route, $resource, $routeParams, toastr, $location, $timeout, $http, CONFIG) {
    $scope.ajustes = {
      menu:{
        titulo: 'Gestión de Arancel',
        items:[
          {nombre:'Clasificación general', enlace:'#/clasificacion-general', estilo:''},
          {nombre:'Clasificación de especialidad', enlace:'#clasificacion-especialidad', estilo:'active'},
          {nombre:'Subclacificación', enlace:'#/subclasificacion', estilo:''},
          {nombre:'Categoria', enlace:'#/categoria', estilo:''}
          ]
      },
      pagina:{
        titulo:'Agregar Clasificación General'
      }
    }
    $scope.verform=false;

    $http.get(CONFIG.DOMINIO_SERVICIOS+"/clasificacion_especialidad").success(function (data) {
        $scope.cle = data.cle;
        console.log('$scope.cle--', $scope.cle);
        if($scope.cle.length > 0){
          $scope.loading = false;
          $scope.msg = true;
        }
        else {
          $scope.loading = false;
          $scope.msg = false;
        }
      },function () {
        toastr.error("Actualice la página porfavor");
        }
    );
    $http.get(CONFIG.DOMINIO_SERVICIOS+"/clasificacion_general").success(function (data) {
        $scope.clasigral = data.clasigral;
        if($scope.clasigral.length > 0){
          $scope.loading = false;
          $scope.msg = true;
        }
        else {
          $scope.loading = false;
          $scope.msg = false;
        }
      },function () {
        toastr.error("Error inesperado");
        }
    );

      $scope.patternCadena = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$/;
      $scope.patternCadenaNumero = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ 0-9,]*$/;
    $scope.veragregar=function (argument) {
      $scope.verform=!$scope.verform;
    }
    $scope.clasificacion_esp={
      cle_codigo:'',
      cle_nombre:'',
      cg_id:null
    };

    $scope.reset = function(form) {
      $scope.clasificacion_esp = {};
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
    }
    $scope.submit=function (data) {
      $scope.verform=!$scope.verform;
      $http.post(CONFIG.DOMINIO_SERVICIOS+"/clasificacion_especialidad", $scope.clasificacion_esp).success(function (data) {
          $scope.clasifiespecialidad=data.cle;
          toastr.success('Empleado registrado exitosamente');
          $route.reload();
        },function () {
          toastr.error("Error de red, al guardar la clasificasión");
          }
      );
    }
    //PARA ELIMINAR UN CLASIFICACION GENERAL
    var id = 0;
    $scope.clasificasion = "";
    $scope.cle_codigo = "";
    $scope.get_id = function(cle_id, cle_codigo, cle_nombre){
        id = cle_id;
        console.log('cle_id---', cle_id);
        $scope.clasificasion = cle_nombre;
        console.log('cle_nombre---', cle_nombre);
        $scope.cle_codigo = cle_codigo;
        console.log('cle_codigo---', cle_codigo);
    }
    $scope.remove = function(){
      Cle.delete({cle_id:id}).$promise.then(function(data){
        if(data.mensaje) {
          $timeout(function() {
              toastr.success('Eliminado correctamente');
              $route.reload();
          },200);

        }
      })
    }
    $scope.id=id;
    $scope.update=function (clasificasion, cle_codigo, cg_id) {
      var modificar={
        cle_nombre:clasificasion,
        cle_codigo:cle_codigo,
        cg_id:cg_id
      }
      Cle.update({cle_id:id}, modificar).$promise.then(function (data) {
        if(data.mensaje) {
            $timeout(function() {
                toastr.success('Modificado exitosamente');
                $route.reload();
            },200);
          
        }
      })
    }

}])

.controller('SubclasificacionCtrl', ['$scope', 'ClasificacionGeneral', 'Cle', 'Subclacificacion', '$route', '$resource', '$routeParams', 'toastr', '$location', '$timeout', '$http', 'CONFIG', function ($scope, ClasificacionGeneral, Cle, Subclacificacion, $route, $resource, $routeParams, toastr, $location, $timeout, $http, CONFIG) {

    $scope.ajustes = {
      menu:{
        titulo: 'Gestión de Arancel',
        items:[
          {nombre:'Clasificación general', enlace:'#/clasificacion-general', estilo:''},
          {nombre:'Clasificación de especialidad', enlace:'#clasificacion-especialidad', estilo:''},
          {nombre:'Subclacificación', enlace:'#/subclasificacion', estilo:'active'},
          {nombre:'Categoria', enlace:'#/categoria', estilo:''}
          ]
      },
      pagina:{
        titulo:'Agregar Clasificación General'
      }
    }
    $scope.verform=false;
    
    $http.get(CONFIG.DOMINIO_SERVICIOS+"/subclasificacion").success(function (data) {
        $scope.subclacificacion = data.subclacificacion;
        console.log('$scope.subclacificacion--', $scope.subclacificacion);
        if($scope.subclacificacion.length > 0){
          $scope.loading = false;
          $scope.msg = true;
        }
        else {
          $scope.loading = false;
          $scope.msg = false;
        }
      },function () {
        toastr.error("Actualice la página porfavor");
        }
    );
    $http.get(CONFIG.DOMINIO_SERVICIOS+"/clasificacion_general").success(function (data) {
        $scope.clasigral = data.clasigral;
        if($scope.clasigral.length > 0){
          $scope.loading = false;
          $scope.msg = true;
        }
        else {
          $scope.loading = false;
          $scope.msg = false;
        }
      },function () {
        toastr.error("Error inesperado");
        }
    );

    $scope.patternCadena = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$/;
    $scope.patternCadenaNumero = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ 0-9,]*$/;
    $scope.veragregar=function (argument) {
      $scope.verform=!$scope.verform;
    }
    $scope.sub={
      sub_codigo:'',
      sub_nombre:'',
      cle_id:null
    };
    $scope.reset = function(form) {
      $scope.sub = {};
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
    }
    $scope.submit=function (data) {
      $scope.verform=!$scope.verform;
      $http.post(CONFIG.DOMINIO_SERVICIOS+"/subclasificacion", $scope.sub).success(function (data) {
          $scope.subc=data.subcla;
          toastr.success('Registro guardado exitosamente');
          $route.reload();
        },function () {
          toastr.error("Error de red, al guardar la clasificasión");
          }
      );
    }
    var id = 0;
    $scope.sub_nombre = "";
    $scope.sub_codigo = "";
    $scope.get_id = function(sub_id, sub_codigo, sub_nombre, cle_id){
        id = sub_id;
        console.log('sub_id---', sub_id);
        console.log('sub_nombre---', sub_nombre);
        console.log('sub_codigo---', sub_codigo);
        $scope.sub_nombre = sub_nombre;
        $scope.sub_codigo = sub_codigo;
        $scope.cle_id=cle_id;
    }
    $scope.remove = function(){
      Subclacificacion.delete({sub_id:id}).$promise.then(function(data){
        if(data.mensaje) {
          $timeout(function() {
              toastr.success('Eliminado correctamente');
              $route.reload();
          },200);

        }
      })
    }
    $scope.id=id;
    $scope.update=function (sub_id, sub_codigo, sub_nombre, cle_id) {
      var modificar={
        sub_nombre:sub_nombre,
        sub_codigo:sub_codigo,
        cle_id:cle_id
      }
      Subclacificacion.update({sub_id:id}, modificar).$promise.then(function (data) {
        if(data.mensaje) {
            $timeout(function() {
                toastr.success('Modificado exitosamente');
                $route.reload();
            },200);
          
        }
      })
    }
    $scope.buscagral=function (cg_id) {
      console.log('cg_id-----',cg_id);
      $http.get(CONFIG.DOMINIO_SERVICIOS+"/buscarcle/"+cg_id).success(function (argument) {
        $scope.cle=argument.cle;
      })
    }

  }])

