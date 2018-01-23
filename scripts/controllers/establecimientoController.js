'use strict';
angular.module("adminApp")

.controller('IndexEstablecimientoCtrl', ['$scope','Establecimientos', '$route', 'toastr',
  function ($scope, Establecimientos, $route, toastr){
  $scope.ajustes = {
    //Configuraciones del menu:
    menu:{
      titulo: 'Gestión de Establecimientos USACSIA',
      items:[
        {nombre:'Establecimientos', enlace:'#/establecimientos', estilo:'active'}/*,
        {nombre:'Nuevo establecimiento', enlace:'#/establecimientos/create', estilo:''}*/]
    },
    //Configuraciones de la página
    pagina:{
      titulo:'Establecimientos USACSIA'
    }
  }

  $scope.sortType = 'usa_id'; // set the default sort type
  $scope.sortReverse  = false;  // set the default sort order
  $scope.establecimientos = [];
  
  $scope.loading=true;//PARA HACER UN LOADING EN EL TEMPLATE
  $scope.establecimientoss = [];

  $scope.getEstablecimientos = function(page){
    //page = 20;
    $scope.establecimientoss = Establecimientos.query({
      page: page,
      max: 10
    })
    console.log($scope.establecimientoss);
  };

  Establecimientos.get(function(data){
    $scope.establecimientos = data.usacsia;
    //PARA HACER UN LOADING EN EL TEMPLATE
    if(data.status){
      $scope.loading = false;
      $scope.msg = data.status;
    }
  },function () {
      console.log("error");
      toastr.error("ERROR INESPERADO, POR FAVOR ACTUALICE LA PÁGINA");
      $scope.loading = false;
      $scope.msg = false;
    });

  var id = 0;
  $scope.nombre = "";
  $scope.get_es_id = function(usa_id, es_nombre){
    id=usa_id;
    $scope.nombre = es_nombre;
  }

  $scope.remove = function(es_id){
    Establecimientos.delete({es_id:id}).$promise.then(function(data){
      if(data.mensaje) {
        toastr.success('Eliminado correctamente');
        $route.reload();
      }
    })
  }
  
  //PARA PAGINACIÓN 
  $scope.currentPage = 0;
  $scope.pageSize = 10; // Esta la cantidad de registros que deseamos mostrar por página
  $scope.pages = [];

  $scope.configPages = function() {
   $scope.pages.length = 0;
   var ini = $scope.currentPage - 4;
   var fin = $scope.currentPage + 5;
   if (ini < 1) {
      ini = 1;
      if (Math.ceil($scope.establecimientos.length / $scope.pageSize) > 10) fin = 10;
      else fin = Math.ceil($scope.establecimientos.length / $scope.pageSize);
   } else {
      if (ini >= Math.ceil($scope.establecimientos.length / $scope.pageSize) - 10) {
         ini = Math.ceil($scope.establecimientos.length / $scope.pageSize) - 10;
         fin = Math.ceil($scope.establecimientos.length / $scope.pageSize);
      }
   }
   if (ini < 1) ini = 1;
   for (var i = ini; i <= fin; i++) {
      $scope.pages.push({ no: i });
   }
   if ($scope.currentPage >= $scope.pages.length)
      $scope.currentPage = $scope.pages.length - 1;
  };
  $scope.setPage = function(index) {
     $scope.currentPage = index - 1;
  };
  //para llamar a la función:
  $scope.configPages();
  //fin paginación 
}])

.controller('VerEstablecimientoCtrl', ['CONFIG', 'authUser','$scope','Establecimientos','Funcionario', '$routeParams', '$location', '$timeout',
  function (CONFIG, authUser,$scope, Establecimientos, Funcionario, $routeParams, $location, $timeout){
  /*if(authUser.isLoggedIn()){*/

    if(CONFIG.ROL_CURRENT_USER == 1)
    {
      $scope.ajustes = {
        menu:{
          titulo: 'Gestión de Establecimiento USACSIA',
          items:[
            {nombre:'Establecimiento', enlace:'#/establecimientos', estilo:''}/*,
            {nombre:'Nuevo Establecimiento', enlace:'#/establecimientos/create', estilo:''},
            {nombre:'Establecimientos por Red', enlace:'#/red/establecimientos', estilo:''}*/]
        },
        pagina:{
          titulo:'Información General del Establecimiento'
        }
      }
    }
   /* else if(CONFIG.ROL_CURRENT_USER == 2 || CONFIG.ROL_CURRENT_USER == 9){
      $scope.ajustes = {
        menu:{
          titulo: 'Gestión del Establecimiento de Salud',
          items:[
            {nombre:'Establecimiento', enlace:'#/establecimientos/ver', estilo:'active'},
            {nombre:'Editar Establecimiento', enlace:'#/establecimientos/edit', estilo:''}]
        },
        pagina:{
          titulo:'Información General del Establecimiento'
        }
      }
    }
    else{
      $scope.ajustes = {
        menu:{
          titulo: 'Gestión del Establecimiento de Salud',
          items:[
            {nombre:'Establecimiento', enlace:'#/establecimientos/ver', estilo:'active'}]
        },
        pagina:{
          titulo:'Información General del Establecimiento'
        }
      }
    }*/
  /*  var es_id = 0;
    if(CONFIG.ROL_CURRENT_USER == 1)
    {
      es_id = $routeParams.es_id;
    }else{
      var FunG = localStorage.getItem("Funcionario");
      var FunG = JSON.parse(FunG);
      es_id = FunG.es_id;
    }*/
    var usa_id=$routeParams.usa_id;
    Establecimientos.get({usa_id:usa_id}, function(data){
      $scope.establecimiento = data.usacsia;
      console.log("ESTABLEC_USACSIA",$scope.establecimiento);
      $scope.establecimiento.usa_fecha_creacion = moment($scope.establecimiento.usa_fecha_creacion,"YYYY-MM-DD").format("DD-MM-YYYY");
      $scope.establecimiento.usa_fecha_inicio_actividad = moment($scope.establecimiento.usa_fecha_inicio_actividad,"YYYY-MM-DD").format("DD-MM-YYYY");
      $scope.establecimiento.usa_inicio_atencion = toTime($scope.establecimiento.usa_inicio_atencion);
      $scope.establecimiento.usa_final_atencion = toTime($scope.establecimiento.usa_final_atencion);
    });

    $scope.cuenta_funcionarios = function(){
      Funcionario.get({es_id:es_id}, function(data){
        $scope.funcionarios = data.funcionario;
        if($scope.funcionarios.length>0) {
          $timeout(function() {
            $location.path('/usuario/create/'+es_id);
          },0);
        }  
        else {
          $timeout(function() {
            $location.path('/funcionarios/createf/'+es_id);
          },0);
        }  
      })
    }
    function toTime(timeString){
      var timeTokens = timeString.split(':');
      return new Date(1970,0,1, timeTokens[0], timeTokens[1], timeTokens[2]);
    }

 /* } else {
    $location.path('/inicio');
  }*/
}])
.filter('startFromGrid', function() {
   return function(input, start) {
      start = +start;
      return input.slice(start);
   };
})














//****************+CONTROLADORES SESAR
.controller('CreateEstablecimientoCtrl', ['$scope','Establecimientos', 'Redes', '$location', '$timeout', 'toastr',
 function ($scope, Establecimientos, Redes, $location, $timeout, toastr){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Establecimientos de Salud',
      items:[
        {nombre:'Establecimientos', enlace:'#/establecimientos', estilo:''},
        {nombre:'Nuevo Establecimiento', enlace:'#/establecimientos/create', estilo:'active'},
        {nombre:'Establecimientos por Red', enlace:'#/red/establecimientos', estilo:''}]
    },
    pagina:{
      titulo:'Nuevo Establecimiento',
      action: "CREAR"
    }
  }
  
  $scope.establecimiento = {
    es_nombre:null,
    mun_id:null,
    red_id:null,
    tip_id:null,
    te_numero:null,
    es_nivel:null,
    es_nit:null,
    es_fecha_inicio_actividad:"",
    es_zona_localidad_comuni:"",
    es_avenida_calle:"",
    es_numero:null,
    es_horas:null,
    es_inicio_atencion:null,
    es_final_atencion:"",
    es_latitud:null,
    es_longitud:null,
    es_altitud:null,
    es_codigo:null,
    es_fax:null,
    es_correo_electronico:"",
    es_direccion_web:"",
    es_fecha_creacion:"",
    es_numero_rm:null,
    ins_id:null,
    ie_nombre:"EST.JPG",
    ie_enlace: "./img-est/",
    ie_tipo:"fotografia"
  };

  $scope.hora_ini="";
  $scope.hora_fin="";

  $scope.ver=function(hora_ini,option){
    $scope.hora_ini=hora_ini;
    console.log('hora_ini: ', hora_ini);
  };

  $scope.hora_ini="";
  $scope.hora_fin="";
  var total=0;

  $scope.horas_atencion=function(a,b){
    var hora=(a).split(':');
    console.log('hora_inicial: ', hora,'--',b);
    total=hora[0]*1+b*1;
    console.log('total1--',total);
    if (total>24)
      total=total*1-24;
    if (total==24)
      total="00";
    console.log('total2--',total);
    $scope.hora_fin =total+":"+hora[1];
  }

  $scope.patternCadena = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ .]*$/;
  $scope.patternNumero = /^[0-9]*$/;
  $scope.patternNombreEstab = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ. 0-9()-º]*$/;
  $scope.patternCadenaNumero = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ. 0-9]*$/;
  $scope.patternFecha = /^(0[1-9]|1[0-9]|2[0-9]|3[01]).(0[1-9]|1[012]).[0-9]{4}$/;
  $scope.patternHora = /^[0-9:]*$/;
  //VALIDAR NUMEROS !!!!!!
  $scope.submit = function(a, fecha_c, fecha_ia, h_ini, h_fin){
    $scope.establecimiento.es_fecha_creacion=fecha_c;
    $scope.establecimiento.es_fecha_inicio_actividad=fecha_ia;
    $scope.establecimiento.es_inicio_atencion=h_ini;
    $scope.establecimiento.es_final_atencion=h_fin;
       
    Establecimientos.save($scope.establecimiento).$promise.then(function(data){
      if(data.status) {
        angular.copy({}, $scope.establecimiento);
        $scope.ajustes.pagina.success = "Establecimiento añadido correctamente";
        toastr.success('Establecimiento añadido correctamente');
        $timeout(function() {
          $location.path('/establecimientos');
        },0);
      }
    });
  };

  $scope.reset = function(form) {
    $scope.establecimiento = {};
    if (form) {
      //console.log(form);
      form.$setPristine();
      form.$setUntouched();
    }
  };
}])

.controller('FechaEstCtrl', ['$scope', function($scope) {
  $scope.dias=[{"dia_id": "1", "dia":"1"},{"dia_id": "2", "dia":"2"},
               {"dia_id": "3", "dia":"3"},{"dia_id": "4", "dia":"4"},
               {"dia_id": "5", "dia":"5"},{"dia_id": "6", "dia":"6"},
               {"dia_id": "7", "dia":"7"},{"dia_id": "8", "dia":"8"},
               {"dia_id": "9", "dia":"9"},{"dia_id": "10", "dia":"10"},
               {"dia_id": "11", "dia":"11"},{"dia_id": "12", "dia":"12"},
               {"dia_id": "13", "dia":"13"},{"dia_id": "14", "dia":"14"},
               {"dia_id": "15", "dia":"15"},{"dia_id": "16", "dia":"16"},
               {"dia_id": "17", "dia":"17"},{"dia_id": "18", "dia":"18"},
               {"dia_id": "19", "dia":"19"},{"dia_id": "20", "dia":"20"},
               {"dia_id": "21", "dia":"21"},{"dia_id": "22", "dia":"22"},
               {"dia_id": "23", "dia":"23"},{"dia_id": "24", "dia":"24"},
               {"dia_id": "25", "dia":"25"},{"dia_id": "26", "dia":"26"},
               {"dia_id": "27", "dia":"27"},{"dia_id": "28", "dia":"28"},
               {"dia_id": "29", "dia":"29"},{"dia_id": "30", "dia":"30"},
               {"dia_id": "31", "dia":"31"},];
  //Fecha de creacion
  $scope.fechaC = {};
  $scope.diac = ""; 
  $scope.mesc = ""; 
  $scope.anioc = "";

  $scope.fechaCreacion=null;

  var date = new Date();
  $scope.FromDate = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' +date.getFullYear() ;
  $scope.FromDate1 = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) ;
  
  $scope.dia=('0' + date.getDate()).slice(-2);
  $scope.mes=('0' + (date.getMonth() + 1)).slice(-2);
  $scope.anio=date.getFullYear() + 1;

  $scope.d=null;
  // etc... 
  // These values will be updated when the user types in the input boxes
  //$scope.funcionarios.per_fecha_nacimiento=$scope.fecha.dia + "-" + $scope.fecha.mes + "-"+ $scope.fecha.anio;
 
  //Funcion para concatenar la fecha de creacion
  $scope.rest = function() {
  //return $scope.fecha.dia + "-" + $scope.fecha.mes + "-"+ $scope.fecha.anio;
    $scope.fechaCreacion=$scope.fechaC.diac + "-" + $scope.fechaC.mesc + "-"+ $scope.fechaC.anioc;
    $scope.d = $scope.fechaC.anioc + "-" +$scope.fechaC.mesc + "-"+ $scope.fechaC.diac;
    var a1 = new Date($scope.d);
    var a2 = new Date($scope.FromDate1);

    $scope.ar=a1;    
    $scope.cr = moment($scope.ar,"DD-MM-YYYY").format("YYYY-MM-DD");
    $scope.br=a2;
    $scope.dr = moment($scope.br,"DD-MM-YYYY").format("YYYY-MM-DD");
    if($scope.cr <= $scope.dr){
        $scope.var="uno";
    }else{
        $scope.var="cero";
    }
  };

  //Fecha inicio actividad
  $scope.fechaIA = {};
  $scope.diaia = ""; 
  $scope.mesia = ""; 
  $scope.anioia = "";

  $scope.fechaInicio=null;
  $scope.fecha_ymd=null;
  //Funcion para concatenar la fecha de inicio de actividad
  $scope.fec_IA = function() {
    $scope.fechaInicio=$scope.fechaIA.diaia + "-" + $scope.fechaIA.mesia + "-"+ $scope.fechaIA.anioia;
    $scope.fecha_ymd = $scope.fechaIA.anioia + "-" +$scope.fechaIA.mesia+ "-"+ $scope.fechaIA.diaia;
    var b1 = new Date($scope.fecha_ymd);
    var b2 = new Date($scope.FromDate1);

    $scope.a=b1;    
    $scope.c = moment($scope.a,"DD-MM-YYYY").format("YYYY-MM-DD");
    $scope.b=b2;
    $scope.d = moment($scope.b,"DD-MM-YYYY").format("YYYY-MM-DD");
    if($scope.c <= $scope.d && $scope.c >= $scope.cr ){
        $scope.var2="uno";
    }else{
        $scope.var2="cero";     
    }
  }
}]) 

/*.directive("myValidDate", function () {
  return {
    require: "ngModel",
    restrict: "A", // Attributes only
    link: function (scope, elem, attr, ctrl) {

      ctrl.$validators.bzValidDate = function(value) {
        if (value === undefined || value === null || value === "") {
            return true;
        }
        return moment(value, ["D-M-YYYY"], true).isValid();
      }
    }
  }
})*/
/*
.controller('VerEstablecimientoCtrl', ['CONFIG', 'authUser','$scope','Establecimientos','Funcionario', '$routeParams', '$location', '$timeout',
  function (CONFIG, authUser,$scope, Establecimientos, Funcionario, $routeParams, $location, $timeout){
  if(authUser.isLoggedIn()){

    if(CONFIG.ROL_CURRENT_USER == 1)
    {
      $scope.ajustes = {
        menu:{
          titulo: 'Gestión de Establecimientos de Salud',
          items:[
            {nombre:'Establecimientos', enlace:'#/establecimientos', estilo:''},
            {nombre:'Nuevo Establecimiento', enlace:'#/establecimientos/create', estilo:''},
            {nombre:'Establecimientos por Red', enlace:'#/red/establecimientos', estilo:''}]
        },
        pagina:{
          titulo:'Información General del Establecimiento'
        }
      }
    }
    else if(CONFIG.ROL_CURRENT_USER == 2 || CONFIG.ROL_CURRENT_USER == 9){
      $scope.ajustes = {
        menu:{
          titulo: 'Gestión del Establecimiento de Salud',
          items:[
            {nombre:'Establecimiento', enlace:'#/establecimientos/ver', estilo:'active'},
            {nombre:'Editar Establecimiento', enlace:'#/establecimientos/edit', estilo:''}]
        },
        pagina:{
          titulo:'Información General del Establecimiento'
        }
      }
    }
    else{
      $scope.ajustes = {
        menu:{
          titulo: 'Gestión del Establecimiento de Salud',
          items:[
            {nombre:'Establecimiento', enlace:'#/establecimientos/ver', estilo:'active'}]
        },
        pagina:{
          titulo:'Información General del Establecimiento'
        }
      }
    }
    var es_id = 0;
    if(CONFIG.ROL_CURRENT_USER == 1)
    {
      es_id = $routeParams.es_id;
    }else{
      var FunG = localStorage.getItem("Funcionario");
      var FunG = JSON.parse(FunG);
      es_id = FunG.es_id;
    }
    Establecimientos.get({es_id:es_id}, function(data){
      $scope.establecimiento = data.establecimiento;
      $scope.establecimiento.establecimientos.es_fecha_creacion = moment($scope.establecimiento.establecimientos.es_fecha_creacion,"YYYY-MM-DD").format("DD-MM-YYYY");
      $scope.establecimiento.establecimientos.es_fecha_inicio_actividad = moment($scope.establecimiento.establecimientos.es_fecha_inicio_actividad,"YYYY-MM-DD").format("DD-MM-YYYY");
      $scope.establecimiento.establecimientos.es_inicio_atencion = toTime($scope.establecimiento.establecimientos.es_inicio_atencion);
      $scope.establecimiento.establecimientos.es_final_atencion = toTime($scope.establecimiento.establecimientos.es_final_atencion);
    });

    $scope.cuenta_funcionarios = function(){
      Funcionario.get({es_id:es_id}, function(data){
        $scope.funcionarios = data.funcionario;
        if($scope.funcionarios.length>0) {
          $timeout(function() {
            $location.path('/usuario/create/'+es_id);
          },0);
        }  
        else {
          $timeout(function() {
            $location.path('/funcionarios/createf/'+es_id);
          },0);
        }  
      })

    }*/
   /* function toTime(timeString){
      var timeTokens = timeString.split(':');
      return new Date(1970,0,1, timeTokens[0], timeTokens[1], timeTokens[2]);
    }
*/
/*  } else {
    $location.path('/inicio');
  }
}])*/

.controller('EditEstablecimientoCtrl', ['CONFIG','authUser','$scope','Establecimientos','$routeParams','$location','$timeout','toastr',
  function (CONFIG,authUser,$scope,Establecimientos,$routeParams,$location,$timeout,toastr){
  if(authUser.isLoggedIn()){
    var rol_id = CONFIG.ROL_CURRENT_USER;
    if(rol_id == 1){
      $scope.ajustes = {
        menu:{
          titulo: 'Gestión de Establecimientos de Salud',
          items:[
            {nombre:'Establecimientos', enlace:'#/establecimientos', estilo:''},
            {nombre:'Nuevo Establecimiento', enlace:'#/establecimientos/create', estilo:''},
            {nombre:'Establecimientos por Red', enlace:'#/red/establecimientos', estilo:''}]
        },
        pagina:{
          titulo:'Editar establecimiento',
          action: "EDITAR"
        }
      }
    }else{
      $scope.ajustes = {
        menu:{
          titulo: 'Gestión del Establecimiento de Salud',
          items:[
            {nombre:'Establecimiento', enlace:'#/establecimientos/ver', estilo:''},
            {nombre:'Editar Establecimiento', enlace:'#/establecimientos/edit', estilo:'active'}]
        },
        pagina:{
          titulo:'Editar datos del establecimiento',
          action: "EDITAR"
        }
      }
    }
    
    var es_id = 0;
    if(rol_id == 1)
    {
      es_id = $routeParams.es_id;
    }else{
      var FunG = localStorage.getItem("Funcionario");
      var FunG = JSON.parse(FunG);
      var es_id = FunG.es_id;
    }
    
    Establecimientos.get({es_id:es_id}, function(data){
      $scope.establecimiento = data.establecimiento;
      $scope.establecimiento.establecimientos.es_numero_rm = parseInt($scope.establecimiento.establecimientos.es_numero_rm, 10);
      $scope.establecimiento.establecimientos.es_nit = parseInt($scope.establecimiento.establecimientos.es_nit, 10);
      $scope.establecimiento.establecimientos.es_numero = parseInt($scope.establecimiento.establecimientos.es_numero, 10);
      $scope.establecimiento.establecimientos.es_fax = parseInt($scope.establecimiento.establecimientos.es_fax, 10);
      $scope.establecimiento.telefonos[0].te_numero = parseInt($scope.establecimiento.telefonos[0].te_numero, 10);
      $scope.hora_ini = $scope.establecimiento.establecimientos.es_inicio_atencion;
      $scope.hora_fin = $scope.establecimiento.establecimientos.es_final_atencion;

      $scope.ver=function(hora_ini,option){
        $scope.hora_ini=hora_ini;
        console.log('hora_ini: ', hora_ini);
      };

      var total=0;

      $scope.horas_atencion=function(a,b){
        var hora=(a).split(':');
        console.log('hora_inicial: ', hora,'--',b);

          total=hora[0]*1+b*1;
          console.log('total1--',total);

        if (total>24)
        total=total*1-24;
        if (total==24)
          total="00";
        console.log('total2--',total);
        $scope.hora_fin =total+":"+hora[1];
      }
    });

    $scope.patternCadena = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ .]*$/;
    $scope.patternNumero = /^[0-9]*$/;
    $scope.patternNombreEstab = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ. 0-9()-º]*$/;
    $scope.patternCadenaNumero = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ. 0-9#]*$/;
    $scope.patternFecha = /^(0[1-9]|1[0-9]|2[0-9]|3[01]).(0[1-9]|1[012]).[0-9]{4}$/;
    $scope.patternHora = /^[0-9:]*$/;
      
    $scope.submit = function(a, h_ini, h_fin){
      $scope.estab = {
        es_nombre : $scope.establecimiento.establecimientos.es_nombre,
        mun_id : $scope.establecimiento.establecimientos.mun_id,
        red_id : $scope.establecimiento.establecimientos.red_id,
        tip_id : $scope.establecimiento.establecimientos.tip_id,
        es_nivel : $scope.establecimiento.establecimientos.es_nivel,
        es_nit : $scope.establecimiento.establecimientos.es_nit,
        es_fecha_inicio_actividad : $scope.establecimiento.establecimientos.es_fecha_inicio_actividad,
        es_zona_localidad_comuni : $scope.establecimiento.establecimientos.es_zona_localidad_comuni,
        es_avenida_calle : $scope.establecimiento.establecimientos.es_avenida_calle,
        es_numero : $scope.establecimiento.establecimientos.es_numero,
        es_horas : $scope.establecimiento.establecimientos.es_horas,
        //es_inicio_atencion : $scope.establecimiento.establecimientos.es_inicio_atencion,
        es_latitud : $scope.establecimiento.establecimientos.es_latitud,
        es_codigo : $scope.establecimiento.establecimientos.es_codigo,
        es_fax : $scope.establecimiento.establecimientos.es_fax,
        es_correo_electronico : $scope.establecimiento.establecimientos.es_correo_electronico,
        es_direccion_web : $scope.establecimiento.establecimientos.es_direccion_web,
        es_fecha_creacion : $scope.establecimiento.establecimientos.es_fecha_creacion,
        es_numero_rm : $scope.establecimiento.establecimientos.es_numero_rm,
        ins_id : $scope.establecimiento.establecimientos.ins_id,
        te_numero : $scope.establecimiento.telefonos[0].te_numero,
        es_altitud : $scope.establecimiento.establecimientos.es_altitud,
        es_longitud : $scope.establecimiento.establecimientos.es_longitud,
        ie_nombre : $scope.establecimiento.imagenes.ie_nombre,
        ie_enlace : "./img-est/",
        ie_tipo : $scope.establecimiento.imagenes.ie_tipo
        //es_final_atencion : $scope.establecimiento.establecimientos.es_final_atencion
      }
      $scope.estab.es_inicio_atencion=h_ini;
      $scope.estab.es_final_atencion=h_fin;
      
      Establecimientos.update({es_id:$scope.establecimiento.establecimientos.es_id}, $scope.estab).$promise.then(function(data){
        if(data.status) {
          $scope.ajustes.pagina.success = "Establecimiento editado correctamente";
          toastr.success('Establecimiento editado correctamente');
          $timeout(function() {
            if(rol_id == 1){
              $location.path('/establecimientos/ver/'+es_id);
            }
            else{
              $location.path('/establecimientos/ver');
            }
          },0);
        }
      })
    }
  } else {
    $location.path('/inicio');
  }
}])


.controller('EstablecimientoRedCtrl', ['$scope', '$route', '$http', 'CONFIG', 'Establecimientos', 'toastr',
 function($scope, $route, $http, CONFIG, Establecimientos, toastr){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Establecimientos de Salud',
      items:[
        {nombre:'Establecimientos', enlace:'#/establecimientos', estilo:''},
        {nombre:'Nuevo Establecimiento', enlace:'#/establecimientos/create', estilo:''},
        {nombre:'Establecimientos por Red', enlace:'#/red/establecimientos', estilo:'active'}]
    },
    pagina:{
      titulo:'Establecimientos por Red'
    }
  }
  
  $scope.loading=true;
  $scope.sortType = 'es_nombre'; // set the default sort type
  $scope.sortReverse  = false;  // set the default sort order
  var vm=this;
  vm.buscaRed = function(){
    $scope.loading=true;
      $http.get(CONFIG.DOMINIO_SERVICIOS+"/establecimiento_salud_red/"+vm.aux).success(function(data){
      //console.log("respuesta: "+data.status);
      vm.redes = data.establecimiento;
      if(data.status && vm.redes.length>0){
        $scope.loading = false;
        $scope.msg = data.status;
      }
      else{
        $scope.loading = false;
        $scope.msg = false;
      }
    });
  }

  var id = 0;
  $scope.nombre = "";
  $scope.get_es_id = function(es_id, es_nombre){
    id=es_id;
    $scope.nombre = es_nombre;
  }

  $scope.remove = function(es_id){
    console.log(id);
    Establecimientos.delete({es_id:id}).$promise.then(function(data){
      if(data.mensaje) {
        toastr.success('Eliminado correctamente');
        $route.reload();
      }
    })
  }
}])
/*
.controller('PdfEstablecimientoCtrl',['$scope','Establecimientos', '$routeParams', '$http', function ($scope, Establecimientos, $routeParams, $http){

  // prepare the document definition using declarative approach
  var es_id = $routeParams.es_id;
  Establecimientos.get({es_id:es_id}, function(data)
  {
    $scope.establecimientos = data.establecimiento;

    var docDefinition = {
      content: [
        {
          text: 'INFORMACIÓN DEL ESTABLECIMIENTO DE SALUD\n\n\n',
          style: 'header', 
          alignment: 'center'
        },
        {
          text: [{text: 'DATOS GENERALES\n\n', style:'header'}],
        },
        {
          //style: 'tableExample',
          table: {
            widths: [200, 'auto'],
            body: [
              [{text: 'Nombre o razón social del establecimiento de salud:', style: 'header'},{text: $scope.establecimientos.es_nombre, style: 'cuerpo'}],
              [{text: 'CÓDIGO', style: 'header'},{ text: $scope.establecimientos.es_codigo, style: 'cuerpo'}],
              [{text: 'NIT', style: 'header'},{ text: $scope.establecimientos.es_nit, style: 'cuerpo'}],
              [{text: 'RESOLUCIÓN', style: 'header'},{ text: $scope.establecimientos.es_numero_rm, style: 'cuerpo'}],
              [{text: 'NUMERO FAX', style: 'header'},{ text: $scope.establecimientos.es_fax, style: 'cuerpo'}],
              [{text: 'NIVEL', style: 'header'},{ text: $scope.establecimientos.es_nivel, style: 'cuerpo'}],
              [{text: 'RED', style: 'header'},{ text: $scope.establecimientos.red_nombre, style: 'cuerpo'}],
              [{text: 'TIPO', style: 'header'},{ text: $scope.establecimientos.tip_nombre, style: 'cuerpo'}],
              [{text: 'HORAS DE ATENCION', style: 'header'},{ text: $scope.establecimientos.es_horas, style: 'cuerpo'}],
              [{text: 'HORARIO DE ATENCION', style: 'header'},{ text: [{text: $scope.establecimientos.es_inicio_atencion},{text: ' -'},{text :$scope.establecimientos.es_final_atencion}],style : 'cuerpo'} ],
              [{text: 'FECHA DE CREACION', style: 'header'},{ text: $scope.establecimientos.tip_nombre, style: 'cuerpo'}],
              [{text: 'FECHA DE INICIO DE ACTIVIDAD', style: 'header'},{ text: $scope.establecimientos.tip_nombre, style: 'cuerpo'}],
              [{text: 'PAGINA WEB', style: 'header'},{ text: $scope.establecimientos.es_direccion_web, style: 'cuerpo'}],
              [{text: 'INSTITUCION DE DEPENDENCIA', style: 'header'},{ text: $scope.establecimientos.ins_nombre, style: 'cuerpo'}],
            ]
          }
        },
      ],
      canvas: [
        {
            style: 'rectangleData',
            type: 'rect',
            x: 198,
            y: -186,
            w: 198,
            h: 188,
            r: 8,
            lineWidth: 4,
            lineColor: '#276fb8',

      },],
        styles: {
          header: {
            bold: true,
            color: '#000',
            fontSize: 10
          },
          cuerpo: {
            color: '#000',
            fontSize: 8
          },
          demoTable: {
            color: '#666',
            fontSize: 10
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black',
            background: '#777'
          }
        }
     };

    $scope.openPdf = function() {
      pdfMake.createPdf(docDefinition).open();
    };

    $scope.downloadPdf = function() {
      pdfMake.createPdf(docDefinition).download();
    };
    
  });

}])


;*/