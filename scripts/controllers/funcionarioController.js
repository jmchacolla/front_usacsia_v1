'use strict';
angular.module("adminApp")

.controller('FuncionarioCtrl', ['CONFIG',/*'authUser',*/'$scope','Funcionarios','$route','$routeParams','toastr','$location','Func',
  function (CONFIG,/*authUser,*/$scope,Funcionarios,$route,$routeParams,toastr,$location,Func){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Funcionarios de USACSIA',
      items:[
        {nombre:'Funcionarios', enlace:'#/funcionarios', estilo:'active'},
        {nombre:'Registrar funcionario', enlace:'#/funcionarios/createFun', estilo:''},
        {nombre:'Buscar Persona', enlace:'#/funcionarios/createfo', estilo:''}]
    },
    pagina:{
      titulo:'Funcionarios de USACSIA'
    }
  }
  
  $scope.sortType = 'fun_id'; // set the default sort type
  $scope.sortReverse  = true;  // set the default sort order
  $scope.loading=true;  
  
 /* if (authUser.isLoggedIn())
  { */
  /*  if(CONFIG.ROL_CURRENT_USER == 1){
      
    }
    else{*/
    
      var FunG = localStorage.getItem("Funcionario");
      var FunG = JSON.parse(FunG);
  
  /*  }*/
 /* }
  else{
    var es_id = $routeParams.es_id;
  }
  */
  Funcionarios.get(function(data)
  {
    $scope.funcionarios = data.funcionario;
    if($scope.funcionarios.length >0){
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

  var id = 0;
  var per_id = 0;
  $scope.nombre_completo = "";
  $scope.funcionarioPer = {
    per_id:null,
    fun_cargo : "",
    fun_profesion:"",
    fun_estado : "INACTIVO"
  };


 
  $scope.get_fe_id = function(fun_id, fe_paterno, fe_materno, fe_nombre, fe_cargo,fun_profesion/*, fe_estado_laboral, fe_inicio_trabajo,fe_fin_trabajo,fe_memorandum*/) {
    id = fun_id;

    console.log('________datos recuperados____',fe_paterno-fe_materno);
    $scope.nombre_completo = fe_paterno + " " + fe_materno + " " + fe_nombre;
    $scope.funcionarioPer.fun_cargo = fe_cargo;
    $scope.funcionarioPer.fun_profesion = fun_profesion;
/*    $scope.funcionarioPer.per_id = per_id;*/
    $scope.funcionarioPer.fun_estado = "INACTIVO";
    console.log($scope.funcionarioPer,id);
  }

   $scope.remove = function(fe_id)
  {
    console.log("____para editar_", $scope.funcionarioPer);

    Func.update({fun_id:id}, $scope.funcionarioPer).$promise.then(function(data){
      if(data.status){
        toastr.success('ELIMINADO CORRECTAMENTE');
        $route.reload();
      }
    })
  } 
 
}])


.controller('VerFuncionarioCtrl',[/*'authUser',*/ '$scope','CONFIG','Personas', 'Funcionarios', '$routeParams', '$location',
            function (/*authUser,*/ $scope,CONFIG, Personas, Funcionarios, $routeParams, $location) {
  /*if(authUser.isLoggedIn()){ */
    if(CONFIG.ROL_CURRENT_USER==1){
     var es_id = 1;
      $scope.ajustes = {
        menu:{
          titulo: 'Gestión de Funcionarios USACSIA',
          items:[
            {nombre:'Funcionarios', enlace:'#/funcionarios', estilo:''},
            {nombre:'Ver Datos del Establecimiento', enlace:'#/establecimientos/ver/'+es_id, estilo:''}
          ]
        },
        pagina:{
          titulo:'Datos del Funcionario'
        }
      }
    }
    else{
      var FunG = localStorage.getItem("Funcionario");
      var FunG = JSON.parse(FunG);
     // var es_id = FunG.es_id;
      $scope.ajustes = {
        menu:{
          titulo: 'Gestión de Funcionarios de USACSIA',
          items:[
            {nombre:'Funcionarios', enlace:'#/funcionarios', estilo:''},
            {nombre:'Registrar funcionario', enlace:'#/funcionarios/createf', estilo:''}]
        },
        pagina:{
          titulo:'Datos del Funcionario'
        }
      }
    }  
    var fun_id = $routeParams.fun_id;
    Funcionarios.get({fun_id:fun_id}, function(data)
    {
      $scope.funcionarios = data.funcionario;
      console.log("aaa",$scope.funcionarios);
      //var es_id11 = $scope.funcionarios.funcionario_establecimiento.es_id;//para obtener el nombre del funcionario en caso de que sea el admin
     /* $scope.fecha_ini = moment($scope.funcionarios.funcionario_establecimiento.fe_inicio_trabajo,"YYYY-MM-DD").format("DD-MM-YYYY");
      $scope.fecha_fin = moment($scope.funcionarios.funcionario_establecimiento.fe_fin_trabajo,"YYYY-MM-DD").format("DD-MM-YYYY");*/
        
  /*    if(CONFIG.ROL_CURRENT_USER==1) { 
        $scope.ajustes.menu.items[0].enlace = '#/establecimientos/ver/'+es_id11+"#FUNCIONARIOS";
      }*/

      var per_id1 = $scope.funcionarios.funcionario.per_id;
      Personas.get({per_id:per_id1}, function(data){
        $scope.persona = data.persona;
        if ($scope.persona.persona.per_genero=='F' || $scope.persona.persona.per_genero=='f'){
          $scope.persona.persona.per_genero='FEMENINO';
        }
        else if($scope.persona.persona.per_genero=='M' || $scope.persona.persona.per_genero=='m'){
          $scope.persona.persona.per_genero='MASCULINO';
        }
        $scope.fecha_nac = moment($scope.persona.persona.per_fecha_nacimiento,"YYYY-MM-DD").format("DD-MM-YYYY");
      })
    });
 /* } else {
    $location.path('/inicio');
  }*/
}])


.controller('CreateFuncionarioPersonaCtrl',['CONFIG','Zonas', '$scope', 'FuncionarioPersona', '$location', '$timeout', 'toastr', '$routeParams', '$resource', 
  function (CONFIG,Zonas,$scope, FuncionarioPersona, $location, $timeout, toastr, $routeParams, $resource)
  { 
    var es_id = 1;
    if(CONFIG.ROL_CURRENT_USER=1) {
      $scope.ajustes = {
        menu:{
          titulo: 'Gestión de Funcionarios',
          items:[
            {nombre:'Funcionarios', enlace:'#/funcionarios', estilo:''},
            {nombre:'Registrar Funcionario', enlace:'#/funcionarios/createFun', estilo:'active'},
            {nombre:'Buscar Persona', enlace:'#/funcionarios/createfo', estilo:''}]
        },
        pagina:{
          titulo:'Registrar Funcionario',
          action:'CREAR'
        }
      }
    } else {
      es_id = 1;
      $scope.ajustes = {
        menu:{
          titulo: 'Gestión de Funcionarios',
          items:[
            {nombre:'Ver Datos del Establecimiento', enlace:'#/establecimientos/ver/'+es_id, estilo:''}]
        },
        pagina:{
          titulo:'Registrar Funcionario',
          action:'CREAR'
        }
      }
    }

    $scope.mensaje="hola";
    $scope.boton="registrar";

    $scope.funcionarios = {
        zon_id:null,
        per_ci: null,
        per_tipo_documento: "",
        per_pais: null,
        per_ci_expedido: "LP",
        per_nombres: null,
        per_apellido_primero: null,
        per_apellido_segundo: null,
        per_fecha_nacimiento: null,
        per_genero: null,
        per_email: null,
        per_numero_celular: null,
        per_clave_publica: "",
        per_avenida_calle: "",
        per_numero:null,
        per_ocupacion:"",
        per_tipo_permanencia: "RESIDENTE",
        ima_nombre:"perfil.jpg",
        ima_enlace: "./img-per",
        ima_tipo: "fotografia",
        
        fun_estado:"ACTIVO",

     /* dir_zona_comunidad: "",
      dir_avenida_calle: "",
      dir_numero: null,
      dir_tipo: "DOMICILIO",
      mun_id:null,*/
      fun_profesion:null,
      fun_cargo:null
      /*fe_memorandum: null,
      fe_inicio_trabajo: "01-01-2001",
      fe_fin_trabajo: "01-01-2001",
      fe_cargo: null,
      fe_estado_laboral: null*/
    };
$scope.zon=false;
  $scope.ver_zonas=function(mun_id){
      console.log(mun_id+"<<< MUN_ID");
      $scope.zon=false;
      Zonas.get({mun_id:mun_id}, function(data){
          $scope.zonas=data.zona;
          console.log("ZOnasss",$scope.zonas);
          //Agregando 26/10/17
          if($scope.zonas.length == 0){
                $scope.zon=true;
          }
          console.log("length "+$scope.zonas.length);
      })
  };
    $scope.patternCadena = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$/;
    $scope.patternCadenaNumero = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ 0-9.]*$/;
  
    var a=$scope.per_ci;
    $scope.per_ci="";
      
    $scope.submit = function(b, per_ci, fechaNacimiento/*,zon_id, fechaIni, fechaFin*/)
    {
      $scope.funcionarios.per_fecha_nacimiento = fechaNacimiento;
      console.log("_____aaaa___________",b.fun_profesion)
      $scope.funcionarios.per_ocupacion =b.fun_profesion;
     
     
        $scope.funcionarios.per_tipo_documento="CI";
        $scope.funcionarios.per_pais="BOLIVIA";
      $scope.funcionarios.per_ci=per_ci;
    
      FuncionarioPersona.save($scope.funcionarios).$promise.then(function(data)
      {
        console.log($scope.funcionarios);
        if(data.msg)
        {
          console.log("data",data);
          angular.copy({}, $scope.funcionarios);
          $scope.ajustes.pagina.success = "FUNCIONARIO REGISTRADO CORRECTAMENTE";
          toastr.success('FUNCIONARIO REGISTRADO CORRECTAMENTE');
          $timeout(function() {
            
              $location.path('/funcionarios');
           
          },1000);
        }
      },function () {
        toastr.error("Error inesperado");
      })
    }
    $scope.reset = function(form) {
      $scope.funcionarios = {};
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
    };
}])


.controller('EditFuncionarioCtrl',[/*'authUser', */'$scope','Zonas', 'Funcionarios', 'Personas','Func','$routeParams','$location', '$timeout','toastr',
            function (/*authUser,*/ $scope,Zonas, Funcionarios,Personas,Func,$routeParams,$location,$timeout,toastr){
              var es_id=1;
/*  if(authUser.isLoggedIn()){*/
    $scope.ajustes = {
      menu:{
        titulo: 'Gestión de Funcionarios de USACSIA',
        items:[
          {nombre:'Funcionarios', enlace:'#/funcionarios', estilo:''},
          {nombre:'Ver Datos del Establecimiento', enlace:'#/establecimientos/ver/'+es_id, estilo:''}]
      },
      pagina:{
        titulo:'Editar Datos del Funcionario de wendy',
        action:'EDITAR'
      }
    }

/*$scope.zon=false;
  $scope.ver_zonas=function(mun_id){
      console.log(mun_id+"<<< MUN_ID");
      $scope.zon=false;*/
      Zonas.get({mun_id:1}, function(data){
          $scope.zonas=data.zona;
          console.log("ZOnasss",$scope.zonas);
          //Agregando 26/10/17
  /*        if($scope.zonas.length == 0){
                $scope.zon=true;
          }*/
          console.log("length "+$scope.zonas.length);
      })
/*  };*/
    var fun_id=$routeParams.fun_id;
    Funcionarios.get({fun_id:fun_id}, function(data) {
      $scope.funcionarios = data.funcionario;
      $scope.per_id = $scope.funcionarios.persona.per_id;

      var fecha_naci = new Date($scope.funcionarios.persona.per_fecha_nacimiento);
      $scope.diacE = (('0' + fecha_naci.getDate()).slice(-2));
      $scope.mescE = ('0' + (fecha_naci.getMonth() + 1)).slice(-2);
      $scope.aniocE = (fecha_naci.getFullYear() + 0)+"";
      
      Personas.get({per_id:$scope.per_id}, function(data) {
        $scope.personas = data.persona;
      });
    });

    $scope.submitP = function(a, fecha_naci){
      $scope.personaE = {
        zon_id: $scope.personas.persona.zon_id,
        per_ci : $scope.personas.persona.per_ci,
        per_tipo_documento: $scope.personas.persona.per_tipo_documento,
        per_pais:$scope.personas.persona.per_pais,
        per_ci_expedido : $scope.personas.persona.per_ci_expedido,
        per_nombres : $scope.personas.persona.per_nombres,
        per_apellido_primero : $scope.personas.persona.per_apellido_primero,
        per_apellido_segundo : $scope.personas.persona.per_apellido_segundo,
        per_fecha_nacimiento : $scope.personas.persona.per_fecha_nacimiento,
        per_genero : $scope.personas.persona.per_genero,
        per_email : $scope.personas.persona.per_email,
        per_tipo_permanencia : $scope.personas.persona.per_tipo_permanencia,
        per_ocupacion:$scope.personas.persona.per_ocupacion,
        per_numero_celular : $scope.personas.persona.per_numero_celular,
        per_clave_publica : $scope.personas.persona.per_clave_publica,
        per_avenida_calle:$scope.personas.persona.per_avenida_calle,
        per_numero:$scope.personas.persona.per_numero,

        ima_nombre : $scope.personas.imagen/*[0]*/.ima_nombre,
        ima_enlace : "./img-per",
        ima_tipo : $scope.personas.imagen/*[0]*/.ima_tipo
     
      };
      if(fecha_naci != null){
         $scope.personaE.per_fecha_nacimiento=fecha_naci;
      }
     
     /* console.log("ANTES DE EDITAR",$scope.personaE);*/

      Personas.update({per_id:$scope.personas.persona.per_id}, $scope.personaE).$promise.then(function(data){
        if(data.status){
           console.log("DESPUES DE EDITAR LO LOGRO",$scope.personaE);
         
        }
      })
    };
//EDITAR SOLO DATOS FUNCIONARIO
    $scope.submitFun = function(b){ 
      $scope.funcionarioPer = {
        fun_cargo : $scope.funcionarios.funcionario.fun_cargo,
        fun_profesion : $scope.funcionarios.funcionario.fun_profesion,
        fun_estado : "ACTIVO"
      };
      console.log("ANTES DE GUARDAR FUNCIONARIOS",$scope.funcionarioPer);

      Func.update({fun_id:fun_id}, $scope.funcionarioPer).$promise.then(function(data){
        if(data.status){
      /*    if(fun_estado!=null){
            toastr.success('SE HABILITÓ AL FUNCIONARIO EN EL ESTABLECIMIENTO');*/
       /*   } else {*/
            $scope.ajustes.pagina.success = "LOS DATOS DEL FUNCIONARIO SE ACTUALIZARON DE MANERA CORRECTA";
            toastr.success('LOS DATOS DEL FUNCIONARIO SE ACTUALIZARON DE MANERA CORRECTA');
         /* }*/
         console.log("DATAAAA",data)
          $timeout(function() {
            $location.path('/funcionarios/ver/'+data.funcionario.fun_id);
          },1000);
        }
      })
    }

    $scope.reset = function(form) {
      $scope.personaE = {};
      $scope.funcionarioPer = {};
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
    };
/*  }
  else {
    $location.path('/inicio');
  }*/
}])

//crear solo funcionario
.controller('CreateFuCtrl',[/*'authUser',*/ '$scope', 'Funcionarios', '$routeParams', '$location', '$timeout', 'toastr', 'CONFIG', '$resource','Personas',
function (/*authUser,*/$scope, Funcionarios, $routeParams, $location, $timeout, toastr, CONFIG, $resource,Personas)
{
  /*if (authUser.isLoggedIn()){*/
    var es_id = 1;
    $scope.rol_id = CONFIG.ROL_CURRENT_USER;
    if($scope.rol_id == 1)
    {
      
      $scope.ajustes = {
        menu:{
          titulo: 'Gestión de Funcionarios de USACSIA',
          items:[
             {nombre:'Funcionarios', enlace:'#/funcionarios', estilo:''},
              {nombre:'Registrar funcionario', enlace:'#/funcionarios/createFun', estilo:''},
              {nombre:'Buscar Persona', enlace:'#/funcionarios/createfo', estilo:'active'}]
        },
        pagina:{
          titulo:'Registrar Funcionario',
            action: "CREAR"
        }
      }
    }
    else{
      $scope.ajustes = {
        menu:{
          titulo: 'Gestión de Funcionarios de USACSIA',
          items:[
            {nombre:'Funcionarios', enlace:'#/establecimiento/funcionarios', estilo:''},
            {nombre:'Registrar funcionario', enlace:'#/funcionarios/createfo', estilo:'active'}]
        },
        pagina:{
          titulo:'Registrar Funcionario',
            action: "CREAR"
        }
      }
    }
    $scope.mensaje="hola";
    
    /*$scope.fun_id_params = $routeParams.fun_id;
    console.log($scope.fun_id_params);*/
    $scope.funcionarios = {
        per_id: null,
        fun_cargo: '',
        fun_profesion: '',
        fun_estado: ''
 
    };



    $scope.submit = function(b, per_id)
    {
      console.log("llego al submit para guardar solo funcionario",per_id);
      $scope.funcionarios.per_id = per_id;

        var FunG = localStorage.getItem("Funcionario");
        var FunG = JSON.parse(FunG);
  
        console.log("datos que se guardaram",$scope.funcionarios);
      Funcionarios.save($scope.funcionarios).$promise.then(function(data)
      {
        if(data.msg)
        {
          angular.copy({}, $scope.funcionarios);
          $scope.ajustes.pagina.success = "Funcionario guardado correctamente";
          toastr.success('Funcionario registrado correctamente');
          $timeout(function() {
              $location.path('/funcionarios');
          },1000);
        }
      },function () {
        toastr.error("Error inesperado");
      })
    }
    /*para agregar a un funcionario */
    $scope.busca_fun=true;
    var per_id = $routeParams.per_id;
    if(per_id!=null){
      Personas.get({per_id:per_id},function(data)
      {
          $scope.personas_encontrada = data.persona;
          $scope.fecha_nacimiento = moment($scope.personas_encontrada.persona.per_fecha_nacimiento,"YYYY-MM-DD").format("DD-MM-YYYY");
          if($scope.personas_encontrada.persona.per_genero == "F" || $scope.personas_encontrada.persona.per_genero == "f") {
            $scope.genero="FEMENINO";
          }else if($scope.personas_encontrada.persona.per_genero == "M" || $scope.personas_encontrada.persona.per_genero == "m"){
            $scope.genero="MASCULINO";
          };
      });
    }
    $scope.per_ci="";
    /*para agregar a un funcionario */
    $scope.reset = function(form) {
      $scope.funcionarios = {};
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
    };

/*  } else {
    $location.path('/inicio');
  }*/
}])



.controller('CreateFunCtrl',[/*'authUser',*/ '$scope', 'Funcionarios', '$routeParams', '$location', '$timeout', 'toastr', 'CONFIG', '$resource','Personas','$http',
function (/*authUser,*/$scope, Funcionarios, $routeParams, $location, $timeout, toastr, CONFIG, $resource,Personas,$http)
{
  /*if (authUser.isLoggedIn()){*/
    var es_id = 1;
    $scope.rol_id = CONFIG.ROL_CURRENT_USER;
    if($scope.rol_id == 1)
    {
      //es_id = $routeParams.es_id;
      $scope.ajustes = {
        menu:{
          titulo: 'Gestión de Funcionarios de USACSIA',
          items:[
            {nombre:'Ver Datos del Establecimiento', enlace:'#/establecimientos/ver/'+es_id, estilo:''}]
        },
        pagina:{
          titulo:'Registrar Funcionario',
            action: "CREAR"
        }
      }
    }
    else{
      $scope.ajustes = {
        menu:{
          titulo: 'Gestión de Funcionarios de USACSIA',
          items:[
            {nombre:'Funcionarios', enlace:'#/funcionarios', estilo:''},
            {nombre:'Registrar funcionario', enlace:'#/funcionarios/createFun', estilo:''},
            {nombre:'Buscar Persona', enlace:'#/funcionarios/createfo', estilo:'active'}]
        },
        pagina:{
          titulo:'Registrar Funcionario',
            action: "CREAR"
        }
      }
    }

    $scope.per_ci="";
  /*  if ($scope.rol_id != 1) {*/
      var FunG = localStorage.getItem("Funcionario");
      var FunG = JSON.parse(FunG);
    //  $scope.es_id = FunG.es_id;
  /*  } else {*/
      /*$scope.es_id = $routeParams.es_id;
      console.log($scope.es_id);*/
   /* }*/
    
  $scope.agregar_fun=function(per_id, ci, nom, ap1, ap2,valor){
      $scope.fun_id = null;
      $scope.valor=valor;
      console.log("llego a la funcion agregar fun");
      $http.get(CONFIG.DOMINIO_SERVICIOS+'/funcionarios_per/'+per_id).success(function(respuesta){
        console.log("ver si existe funcionario",respuesta.length);
        if(respuesta.length !=0){//En caso de que sea funcionario de algún establecimiento
          //Verificando si el funcionario se encuentra registrado en el establecimiento
          $scope.fun_id = respuesta.funcionario.fun_id;
          console.log("$sope.fun_id",$scope.fun_id)
          $scope.fe_estado = false;
          $scope.fe_estado_activo = false;
          $scope.fe_id = null;
          /*for (var i = 0; i < respuesta.funcionario.length; i++) {*/
           
              if(respuesta.funcionario.fun_estado == "INACTIVO"){
                $scope.valor="2";
                $scope.fe_estado = true;
                $scope.fe_id = respuesta.funcionario.fun_id;
                console.log("___cambios___",$scope.valor, $scope.fe_estado,$scope.fe_id);
              } else {
                $scope.valor="1";//Si entra aquí el funcionario esta en el establecimiento
                $scope.fe_estado_activo = true;
                 console.log("___falso___");
              }
           
          /*};*/
          console.log($scope.valor);
          if($scope.valor="0"){
            $scope.ci=ci;
            $scope.nom=nom;
            $scope.ap1=ap1;
            $scope.ap2=ap2;
          }
        }else {//En caso de que no sea funcionario de ningún establecimiento, y que devuelva array 0
          $scope.valor="0";
          $scope.ci=ci;
          $scope.nom=nom;
          $scope.ap1=ap1;
          $scope.ap2=ap2; 
        }
      }).error(function(respuesta){///En caso de que no encuentre a la persona como funcionario
        $scope.valor="0";
        $scope.ci=ci;
        $scope.nom=nom;
        $scope.ap1=ap1;
        $scope.ap2=ap2; 
      }); 
    }

    $scope.reg=function(per_id,fun_id,fe_id){//Para redireccionar cuando sea tenga sus datos
      $timeout(function() {
        //$location.path('/servicios_ciudadanos/preregistro/ver/'+data.persona.personas.per_id);
        console.log(fun_id);
        console.log(fe_id);
        localStorage.setItem("aux_es_id",per_id);
        if (fun_id != null) {
          if (fe_id!=null){
            $location.path('/funcionarios/habilitar/'+fe_id+'/1');
          } else {
            $location.path('/funcionarios/create_fun/'+per_id+'/'+fun_id);
          }
        } else {
          $location.path('/funcionarios/create_fun/'+per_id);
        }
      },1000);
    }
  /*} else {
    $location.path('/inicio');
  }*/
}])































//Lista a los funcionarios de un establecimiente
.controller('FuncionarioEstCtrl', ['CONFIG',/*'authUser',*/'$scope','Funcionario','Funcionarios','$route','$routeParams','toastr',
  function (CONFIG,/*authUser,*/$scope,Funcionario,Funcionarios,$route,$routeParams,toastr){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Funcionarios de Salud',
      items:[
        {nombre:'Funcionarios', enlace:'#/establecimiento/funcionarios', estilo:'active'},
        {nombre:'Registrar funcionario', enlace:'#/funcionarios/createf', estilo:''}]
    },
    pagina:{
      titulo:'Funcionarios de Salud del Establecimiento'
    }
  }
  
  $scope.sortType = 'fe_id'; // set the default sort type
  $scope.sortReverse  = true;  // set the default sort order
  $scope.loading=true;  
  
 /* if (authUser.isLoggedIn())
  { */var es_id=0;
    if(CONFIG.ROL_CURRENT_USER == 1){
      var es_id = $routeParams.es_id;
    }
    else{
      var FunG = localStorage.getItem("Funcionario");
      var FunG = JSON.parse(FunG);
      var es_id = FunG.es_id;
    }
 /* }
  else{
    var es_id = $routeParams.es_id;
  }
  */
  Funcionario.get({es_id:es_id}, function(data)
  {
    $scope.funcionarios = data.funcionario;
    if($scope.funcionarios.length >0){
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

  var id = 0;
  $scope.nombre_completo = "";
  $scope.funcionarioPer = {
    fe_cargo : "",
    fe_estado_laboral : "",
    fe_inicio_trabajo : "",
    fe_fin_trabajo : "",
    fe_memorandum : "",
    fe_estado : "INACTIVO"
  };

  $scope.get_fe_id = function(fe_id, fe_paterno, fe_materno, fe_nombre, fe_cargo, fe_estado_laboral, fe_inicio_trabajo,fe_fin_trabajo,fe_memorandum) {
    id = fe_id;
    $scope.nombre_completo = fe_paterno + " " + fe_materno + " " + fe_nombre;
    $scope.funcionarioPer.fe_cargo = fe_cargo;
    $scope.funcionarioPer.fe_estado_laboral = fe_estado_laboral;
    $scope.funcionarioPer.fe_inicio_trabajo = fe_inicio_trabajo;
    $scope.funcionarioPer.fe_fin_trabajo = fe_fin_trabajo;
    $scope.funcionarioPer.fe_memorandum = fe_memorandum;
    $scope.funcionarioPer.fe_estado = "INACTIVO";
    console.log($scope.funcionarioPer);
  }

  $scope.remove = function(fe_id)
  {
    if($scope.funcionarios.fe_estado_laboral == "POR CONTRATAR"){
      $scope.funcionarioPer.fe_memorandum = null;
    } 

    ///MIENTRAS NO SE USEN LAS FECHAS
    if($scope.funcionarioPer.fe_inicio_trabajo == null){
       $scope.funcionarioPer.fe_inicio_trabajo="01-01-2001";
    }
    if($scope.funcionarioPer.fe_fin_trabajo == null){
       $scope.funcionarioPer.fe_fin_trabajo="01-01-2001";
    }
      
    Funcionarios.update({fe_id:id}, $scope.funcionarioPer).$promise.then(function(data){
      if(data.status){
        toastr.success('ELIMINADO CORRECTAMENTE');
        $route.reload();
      }
    })
  } 
}])



.controller('apiAppCtrl_fun', ['$http', '$scope', 'CONFIG', controladorPrincipal_fun])

.controller('apiAppCtrl_Pre', ['$http', '$scope', 'CONFIG','toastr', controladorPrincipal_Pre])

.controller('apiAppCtrl', ['$http', '$scope', 'CONFIG', controladorPrincipal])

.controller('apiAppCtrl_Edad', ['$http', '$scope', 'CONFIG','toastr', controladorPrincipal_Edad]) ; 

function controladorPrincipal($http, $scope, CONFIG){
  var vm=this;
  $scope.ss="dcs";
  /*$scope.tamanio=0;*/

  vm.buscaPersona = function(){
      $scope.tamanio="Cargando...";//////CAMBIADO
      $http.get(CONFIG.DOMINIO_SERVICIOS+'/personas_ci/'+vm.per_ci).success(function(respuesta){
          vm.personas = respuesta.persona;
          /*console.log('__:buscar persona:__',vm.personas.persona);*/
         $scope.tamanio=respuesta.length;
          console.log('__:leeeenght:__',respuesta);
          if(respuesta.persona != null){
              $scope.aa="cero";
              $scope.msg=true;
              $scope.msg1=false;
              $scope.switch=false;
              $scope.switch1=true;
          } else{
              $scope.aa="uno";
              $scope.msg=false;
              $http.get(CONFIG.DOMINIO_SERVICIOS+'/personasb/'+vm.per_ci).success(function(respuesta){
                  vm.personas = respuesta.personas;
                  console.log("__entro a else__",vm.personas);
                  vm.variable = respuesta.c;
                  $scope.tamanio=respuesta.personas.length;
                   $scope.switch=true;
                   $scope.switch1=false;
                  if(respuesta.personas.length != 0){
                      $scope.aa="cero";
                      $scope.msg=true;
                      $scope.msg1=false;
                  } else{
                      $scope.aa="uno";
                      $scope.msg=false;
                      $scope.mg=false;
                      $scope.msg1=true;
                      $scope.tamanio="No se encontro ningun resultado";
                  }  
              });
          }  
      });
  }//fin buscaPersona
}

function controladorPrincipal_fun($http, $scope, CONFIG){
  $scope.ss="dcs";
  $scope.mos=false;
  $scope.msg=true;
  $scope.ver=false;
  $scope.buscaPersona = function(){
      $scope.tamanio="Cargando... ";//////CAMBIADO
      $http.get(CONFIG.DOMINIO_SERVICIOS+'/personas_ci/'+$scope.per_ci).success(function(respuesta){
     
          /*$scope.personas1 = respuesta.persona;
          console.log($scope.personas1);*/
         console.log(respuesta.persona);
          if(respuesta.persona==null){
             $scope.mos=true;
              $scope.aa="cero";
              $scope.msg=true;
              $scope.switch=false;
              $scope.tamanio=" La persona no se encuentra registrada";
          } else /*if(respuesta.mensaje=='no')*/{
            $scope.personas = respuesta.persona.persona;
             $scope.tamanio=$scope.personas.length;
             console.log("No existe",$scope.mos);
              $scope.aa="uno";
              $scope.msg=false;
              $scope.ver=true;
              $scope.mos=false;
              $scope.tamanio="Se encontro un resultado";
          }  
      });
  }
}

function controladorPrincipal_Pre($http, $scope, CONFIG, toastr){
  var vm=this;
  console.log("___LLEGO ABUSQUEDA__");
  $scope.ss="dcs";
  //$scope.tamanio=0;
  $scope.pre_reg=false;
  vm.buscaPersona = function(){
      $scope.tamanio="Cargando...";

      $http.get(CONFIG.DOMINIO_SERVICIOS+'/personasb/'+vm.per_ci).success(function(respuesta){
          if(respuesta.personas.length != 0){
              $scope.pre_reg=true;
              console.log("__pre_reg true__",$scope.pre_reg,vm.per_ci);
              toastr.warning('EL CI INTRODUCIDO YA EXISTE');
          } else if (respuesta.personas.length == 0){
              $scope.pre_reg=false;
              console.log("__pre_reg__",$scope.pre_reg,vm.per_ci);
          }  
      });
  }
}


function controladorPrincipal_Edad($http, $scope, CONFIG, toastr){
  var vm=this;
  console.log("___LLEGO A BUSQUEDA DE EDAD__");
  $scope.ss="dcs";
  //$scope.tamanio=0;
  $scope.pre_reg=false;
  vm.buscaPersona = function(){
      $scope.tamanio="Cargando...";

      $http.get(CONFIG.DOMINIO_SERVICIOS+'/persona_edad/'+vm.fecha).success(function(respuesta){
          if(respuesta.personas.length != 0){
              $scope.pre_reg=true;
              console.log("__pre_reg true__",$scope.pre_reg,vm.per_ci);
              toastr.warning('EL CI INTRODUCIDO YA EXISTE');
          } else if (respuesta.personas.length == 0){
              $scope.pre_reg=false;
              console.log("__pre_reg__",$scope.pre_reg,vm.per_ci);
          }  
      });
  }
}