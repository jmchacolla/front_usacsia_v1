'use strict';
angular.module('adminApp')
.controller('InicioCtrl', [/*'Personas',*/ 'PersonaporCI','$scope', 'CONFIG','EstabSols', function (/*Personas,*/ PersonaporCI,$scope, CONFIG,EstabSols){
  var SesionG = localStorage.getItem("Sesion");
  if (SesionG != null)
  {
    var SesionG = JSON.parse(SesionG);
    console.log("__sesion de usuario___",SesionG.per_id);
  /*  Personas.get({per_id:SesionG.per_id}, function(data)
    {
      $scope.persona = data.persona;
      if($scope.persona.persona.per_genero=='F' || $scope.persona.persona.per_genero=='f'){
        $scope.ajustes.menu.titulo = "Bienvenida";
      }
      else if($scope.persona.persona.per_genero=='M' || $scope.persona.persona.per_genero=='m'){
        $scope.ajustes.menu.titulo = "Bienvenido";
      }
    });*/
if (SesionG.rol_id !=6) {
  PersonaporCI.get({per_ci:SesionG.usu_nick}, function(data)
    {
      $scope.persona = data.persona.persona;

      if($scope.persona.per_genero=='F' || $scope.persona.per_genero=='f'){
        $scope.ajustes.menu.titulo = "Bienvenida";
      }
      else if($scope.persona.per_genero=='M' || $scope.persona.per_genero=='m'){
        $scope.ajustes.menu.titulo = "Bienvenido";
      }
    });
    $scope.ajustes = {
    menu:{
      items:[
        {nombre:'Inicio', enlace:'#/', estilo:'active'},
        {nombre:'Manual de Usuario', enlace:'#/', estilo:''}]
    }
  }
 
} else {

  EstabSols.get({ess_id:SesionG.per_id}, function(data){
            $scope.establecimiento = data.establecimiento;
                      
          });
 $scope.bien = "Bienvenido";
   $scope.ajustes = {
    menu:{
      items:[
        {nombre:'Inicio', enlace:'#/', estilo:'active'},
        ]/*,
        titulo:"Bienvenido"*/
    }
  }

}
     $scope.ajustes = {
    menu:{
      items:[
        {nombre:'Inicio', enlace:'#/', estilo:'active'},
        {nombre:'Manual de Usuario', enlace:'#/', estilo:''}]
    }
  }


    
  }


 

  $scope.rol = CONFIG.ROL_CURRENT_USER;

  if(CONFIG.ROL_CURRENT_USER == 1){
    $scope.ajustes.menu.items[1].enlace = "./manuales/admin_sedes.pdf";
  }
  if(CONFIG.ROL_CURRENT_USER == 2){
    $scope.ajustes.menu.items[1].enlace = "./manuales/admin_estab.pdf";
  }
  if(CONFIG.ROL_CURRENT_USER == 3){
    $scope.ajustes.menu.items[1].enlace = "./manuales/estadistico.pdf";
  }
  if(CONFIG.ROL_CURRENT_USER == 4){
    $scope.ajustes.menu.items[1].enlace = "./manuales/medico.pdf";
  }
  if(CONFIG.ROL_CURRENT_USER == 5){
    $scope.ajustes.menu.items[1].enlace = "./manuales/enfermera.pdf";
  }
  if(CONFIG.ROL_CURRENT_USER == 6){
    $scope.ajustes.menu.items[1].enlace = "./manuales/admisionista.pdf";
  }
  if(CONFIG.ROL_CURRENT_USER == 9){
    $scope.ajustes.menu.items[1].enlace = "./manuales/admin_medico.pdf";
  }
}])



//Permite asignar roles a los funcionarios
.controller('UsuarioCreateCtrl', [/*'authUser',*/ '$scope', '$http', 'CONFIG', 'Usuarios', '$routeParams'/*, 'Establecimientos'*/, '$location', '$timeout', 'toastr', '$route', 'Funcionarios',
  function (/*authUser,*/ $scope, $http, CONFIG, Usuarios, $routeParams, /*Establecimientos,*/ $location, $timeout, toastr, $route, Funcionarios) {
  /*if(authUser.isLoggedIn()){*/
    $scope.rol_id = CONFIG.ROL_CURRENT_USER;
    var es_id = 1;
    if($scope.rol_id == 1){
   
      $scope.ajustes = {
        menu:{
          titulo: 'Gestión de usuarios',
          items:[
            {nombre:'Ver Datos del Establecimiento', enlace:'#/establecimientos/ver/'+es_id, estilo:''},
            {nombre:'Asignar Roles', enlace:'#/usuario/create', estilo:'active'}]
        },
        pagina:{
          titulo:'Asignar Roles',
          action: "ASIGNAR ROL"
        }
      }
    }
    else{
     /* var FunG = localStorage.getItem("Funcionario");
      var FunG = JSON.parse(FunG);
      es_id = FunG.es_id;*/
      $scope.ajustes = {
        menu:{
          titulo: 'Gestión de usuarios',
          items:[
            {nombre:'Usuarios', enlace:'#/establecimiento/usuarios', estilo:''},
            {nombre:'Asignar Roles', enlace:'#/usuario/create', estilo:'active'}]
        },
        pagina:{
          titulo:'Asignar Roles',
          action: "ASIGNAR ROL"
        }
      }
    }
    var vm = this;
    vm.usuario = {}
    //Descomentar cuando este en ver establecimiento
    //Establecimientos.get({es_id:es_id}, function(data){
      //$scope.establecimiento = data.establecimiento;
      /*if($scope.rol_id == 1 && $scope.establecimiento.establecimientos.es_nivel == "PRIMER NIVEL")
      {
        $scope.roles = [
          { rol_id: 2, rol_nombre: "ADMINISTRADOR ESTABLECIMIENTO", rol_descripcion: "SE ENCARGA DE GESTIONAR TODOS LOS ELEMENTOS A REGISTRAR, ACTUALIZAR Y DAR DE BAJA EN ELE ESTABLECIMIENTO."},
          { rol_id: 9, rol_nombre: "ADMINISTRADOR MEDICO", rol_descripcion: "TIENE LOS ROLES DE ADMINISTRADOR DE ESTABLECIMIENTO Y MEDICO"}
        ]
        vm.usuario.rol_id = 9;
      }
      else*/ 
        //SESAR
      /*if($scope.rol_id == 1){
        $scope.roles = [
          {rol_id: 2, rol_nombre: "JEFE USACSIA", rol_descripcion: "SE ENCARGA DE GESTIONAR TODOS LOS ELEMENTOS A REGISTRAR, ACTUALIZAR Y DAR DE BAJA EN ELE ESTABLECIMIENTO."},
          {rol_id: 9, rol_nombre: "ADMINISTRADOR MEDICO", rol_descripcion: "TIENE LOS ROLES DE ADMINISTRADOR DE ESTABLECIMIENTO Y MEDICO."}
        ]
        vm.usuario.rol_id = 2;
      }
      else {
        $scope.roles = [
          { rol_id: 2, rol_nombre: "ADMINISTRADOR ESTABLECIMIENTO", rol_descripcion: "SE ENCARGA DE GESTIONAR TODOS LOS ELEMENTOS A REGISTRAR, ACTUALIZAR Y DAR DE BAJA EN ELE ESTABLECIMIENTO."},
          { rol_id: 9, rol_nombre: "ADMINISTRADOR MEDICO", rol_descripcion: "TIENE LOS ROLES DE ADMINISTRADOR DE ESTABLECIMIENTO Y MEDICO."},
          //{ rol_id: 3, rol_nombre: "ESTADISTICA", rol_descripcion: "SE ENCARGA DE TAREAS ESPECIFICAS, REPORTES Y ESTADISTICAS"},
          { rol_id: 4, rol_nombre: "MEDICO", rol_descripcion: "FUNCIONES ESPECIFICAS: REFERENCIA"},
          { rol_id: 5, rol_nombre: "ENFERMERA", rol_descripcion: "FUNCIONES ESPECIFICAS: REGISTRAR Y HACER SEGUIMIENTO A VACUNAS"},
          { rol_id: 6, rol_nombre: "ADMISIONISTA", rol_descripcion: "COMPLEMENTAR LA INFORMACION FINACIERA DE LAS RECERVAS Y FICHAJE"},
          //{ rol_id: 10, rol_nombre: "ESTADISTICO ADMISIONISTA ENFERMERA", rol_descripcion: "TIENE LOS ROLES DE ESTADISTICO ADMISIONISTA Y ENFERMERA "}
        ]
      }*/
    //})
     $scope.roles = [
          { rol_id: 2, rol_nombre: "JEFE USACSIA", rol_descripcion: "GENERA FIRMA, FIRMA DOCUMENTOS"},
          { rol_id: 3, rol_nombre: "CAJERO", rol_descripcion: "Registra pago de trámites, genera reportes, asigna consultorio"}/*,
          { rol_id: 4, rol_nombre: "PERSONA", rol_descripcion: "CUANDO SE REGISTRA EN EL SISTEMA"},
          { rol_id: 5, rol_nombre: "PACIENTE", rol_descripcion: "Paga CaS, entrega muestra, consulta medica, imprime CaS, Seguimiento"},
          { rol_id: 6, rol_nombre: "EMPRESA", rol_descripcion: "Registra empresa, carga lista empleados, solicita trámite CaS, CaS empleados, CeS, seguimiento a tramites, carga documentos, paga trámites"}*/,
          { rol_id: 7, rol_nombre: "RESPONSABLE DE AREA CARNÉ SANITARIO", rol_descripcion: "Registra consultorio, laboratorio, asigna horarios, reprograma carnetización, especifica dias de antención, renera reportes"},

          { rol_id: 8, rol_nombre: "RECEPCIONISTA", rol_descripcion: "Asiste en registro de personas, toma fotografias, asigna consultorio"},
          //{ rol_id: 3, rol_nombre: "ESTADISTICA", rol_descripcion: "SE ENCARGA DE TAREAS ESPECIFICAS, REPORTES Y ESTADISTICAS"},
          { rol_id: 9, rol_nombre: "MEDICO", rol_descripcion: "Registra resultados de consulta, genera reportes"},
          { rol_id: 10, rol_nombre: "ENFERMERA", rol_descripcion: "REGISTRA SIGNOS VITALES"},
          { rol_id: 11, rol_nombre: "RESPONSABLE DE LABORATORIO", rol_descripcion: "Genera reportes mensuales"},
          { rol_id: 12, rol_nombre: "RECEPCIONISTA DE LABORATORIO", rol_descripcion: "Asigna numero de muestra, asigna consultorio"},
          { rol_id: 13, rol_nombre: "TECNICO DE LABORATORIO", rol_descripcion: "Registra resultados de observacion, genera informes"},
          { rol_id: 14, rol_nombre: "RESPONSABLE DE AREA CERTIFICADO SANITARIO", rol_descripcion: "Genera reportes mensuales, genera firma, firma documentos"},
          { rol_id: 15, rol_nombre: "REVISOR", rol_descripcion: "Registra resultados de observacion de docuemntos"},
          { rol_id: 16, rol_nombre: "INSPECTOR", rol_descripcion: "Llenado de ficha inspección, asigna categoria, genera reportes"},
          { rol_id: 17, rol_nombre: "JEFE DE UNIDAD ADMIN FINANCIERA", rol_descripcion: "Genera firma, firma documentos"},
          { rol_id: 18, rol_nombre: "RESPONSABLE TESORERIA", rol_descripcion: "Revisa reportes financieros, valida documento"},
         
        ]


      //SESAR
    //Obtiene a los funcionarios de un establecimiento que no tienen una cuenta de usuario
/*    FuncionariosEstablecimiento.get({es_id:es_id}, function(data)
    {
      $scope.funcionarios = data.funcionario;
    }); */ 
    Funcionarios.get(function(data)
    {
      $scope.funcionarios=data.funcionario;
       console.log("SERVICIO DE FUNCIONARIOS",$scope.funcionarios);
    });
    vm.buscaFuncionario = function(){
      $http.get(CONFIG.DOMINIO_SERVICIOS+"/funcionario/"+vm.aux).success(function(data){
        vm.funci = data.funcionario;
        console.log("datos obtenidos del funcionario",vm.aux);
      
        vm.usuario.usu_tipo = "P";
        vm.usuario.usu_identificador =vm.funci.persona.per_id;
        /*vm.usuario.usu_nick = vm.funci.persona.per_ci;
        vm.usuario.password = vm.funci.persona.per_ci;*/
    
      })
    }
    $scope.submit = function(){
      Usuarios.save(vm.usuario).$promise.then(function(data){
        if(data.msg){
          angular.copy({}, vm.usuario);
          $scope.ajustes.pagina.success = "El rol fue asignado exitosamente";
          vm.aux = null;
          vm.funci.per_nombres = null;
          vm.funci.per_ci = null;
          if($scope.rol_id == 2 || $scope.rol_id == 9){
            toastr.success('Rol asignado correctamente');
            $timeout(function() {
              $location.path('/');
            },0);
          } else {
            toastr.success('Rol asignado correctamente');
            $route.reload();
          }
        }
      });
    }
 /* } else {
    $location.path('/inicio');
  }*/
}])







//Para definir el rol que el usuario quiere usar
/*.controller('RolUsuarioCtrl', ['$scope','$timeout','$location','FuncionarioPer','Establecimientos','CONFIG','UsuarioEstado','PacientePersona',
 function ($scope,$timeout,$location,FuncionarioPer,Establecimientos,CONFIG,UsuarioEstado,PacientePersona) {

  var SesionG = localStorage.getItem("Sesion");
  SesionG = JSON.parse(SesionG);
  $scope.nro_roles = SesionG.roles.length;
  
  //Para generar el menu de funcinario paciente
  $scope.fun_rol = false; $scope.pac_rol = false; $scope.admin_sedes_rol = false;
  
  $scope.rol_id_funcionario=0; $scope.aux_cont_rol=0;

  for(var i=0; i<SesionG.roles.length; i++){
    if (SesionG.roles[i].rol_id != 1 && SesionG.roles[i].rol_id !=7) {//si es funcionario
      $scope.fun_rol = true;
      $scope.rol_id_funcionario = SesionG.roles[i].rol_id;
      $scope.rol_nombre_funcionario = SesionG.roles[i].rol_nombre;
    }
    if (SesionG.roles[i].rol_id == 7){
      $scope.pac_rol = true;
    }
    if (SesionG.roles[i].rol_id == 1){
      $scope.admin_sedes_rol = true;
    }
    $scope.aux_cont_rol++;
  }
  
  //cuando tiene un rol pero pertenece a más de un establecimiento
  if ($scope.fun_rol && !$scope.pac_rol && !$scope.admin_sedes_rol && $scope.aux_cont_rol==1){
    $scope.nombres_establecimientos = [];
    var cont_act = 0;
    FuncionarioPer.get({per_id:SesionG.per_id}, function(data){
      ///Obteniendo los nombres de los establecimiento
      $scope.funcionario = data.funcionario;
      $scope.nombres_establecimientos = data.funcionario.funcionario_establecimiento;
      for (var i = 0; i < data.funcionario.funcionario_establecimiento.length; i++) {
        if (data.funcionario.funcionario_establecimiento[i].fe_estado=='ACTIVO') {
          $scope.nombres_establecimientos[cont_act] = {
            es_id: $scope.funcionario.funcionario_establecimiento[i].es_id,
            fe_id: $scope.funcionario.funcionario_establecimiento[i].fe_id,
            fun_id: $scope.funcionario.funcionario.fun_id,
            es_nombre: $scope.funcionario.funcionario_establecimiento[i].es_nombre,
          }
          cont_act++;
        }
      };
      console.log($scope.nombres_establecimientos);
    });
  }

  $scope.selecciona_rol_admin_sedes = function(){
    CONFIG.ROL_CURRENT_USER = 1;
    CONFIG.ROL_CURRENT_USER_NAME = "ADMINISTRADOR SEDES";
    localStorage.setItem("ROL_CURRENT_USER", 1);
    localStorage.setItem("ROL_CURRENT_USER_NAME", "ADMINISTRADOR SEDES");
    $timeout(function() {
      $location.path('/');
    },1000);
  }

  $scope.selecciona_rol_paciente = function(){//Cuando el usuario inicia sesion como paciente
    CONFIG.ROL_CURRENT_USER = 7;
    CONFIG.ROL_CURRENT_USER_NAME = "PACIENTE";
    localStorage.setItem("ROL_CURRENT_USER", 7);
    localStorage.setItem("ROL_CURRENT_USER_NAME", "PACIENTE");
    localStorage.removeItem("Funcionario");
    //Guardando en localStorage el id del paciente
    var pac_id=0;
    PacientePersona.get({per_id:SesionG.per_id}, function(data)
    {
      pac_id = data.paciente[0].pac_id;
      localStorage.setItem("PacId", pac_id);
    });
    $timeout(function() {
      $location.path('/');
    },1000);
  }

  $scope.selecciona_rol_funcionario = function(){//Cuando el usuario inicia sesion como funcionario
    $scope.nombres_establecimientos = [];
    var cont_act = 0;
    FuncionarioPer.get({per_id:SesionG.per_id}, function(data)
    {
      $scope.es_id = 0;
      $scope.funcionario = data.funcionario;
      for (var i = 0; i < data.funcionario.funcionario_establecimiento.length; i++) {
        if (data.funcionario.funcionario_establecimiento[i].fe_estado=='ACTIVO') {
          $scope.nombres_establecimientos[cont_act] = {
            es_id: $scope.funcionario.funcionario_establecimiento[i].es_id,
            fe_id: $scope.funcionario.funcionario_establecimiento[i].fe_id,
            fun_id: $scope.funcionario.funcionario.fun_id,
            es_nombre: $scope.funcionario.funcionario_establecimiento[i].es_nombre,
          }
          cont_act++;
        }
      };
      if (cont_act == 1){//en caso que solo tenga un rol de funcionario
        //$scope.fun_rol = false;
        CONFIG.ROL_CURRENT_USER = parseInt($scope.rol_id_funcionario, 10);
        CONFIG.ROL_CURRENT_USER_NAME = $scope.rol_nombre_funcionario;
        localStorage.setItem("ROL_CURRENT_USER", parseInt($scope.rol_id_funcionario, 10));
        localStorage.setItem("ROL_CURRENT_USER_NAME", $scope.rol_nombre_funcionario);
        $scope.es_id = data.funcionario.funcionario_establecimiento[0].es_id;  
        //Guarda los datos del establecimiento en localStorage
        Establecimientos.get({es_id:$scope.es_id}, function(data){
          var datosEst = JSON.stringify(data.establecimiento);
          localStorage.setItem("DatosEstablecimiento", datosEst);
        });
        //Guarda los datos del funcionario en LocalStorage, se guarda el establecimiento del rol que seleccionó
        var datosFun = {
          es_id: $scope.es_id,
          fun_id: data.funcionario.funcionario.fun_id,
          fe_id: data.funcionario.funcionario_establecimiento[0].fe_id,
        }
        var datosFunG = JSON.stringify(datosFun);
        localStorage.setItem("Funcionario", datosFunG);

        $timeout(function() {
          $location.path('/');
        },1000);
      } else { //tiene más de un rol de funcionario
        $scope.pac_rol = false;
        $scope.admin_sedes_rol = false;
        console.log($scope.nombres_establecimientos);
      } 
    });
  }

  $scope.continua_sesion = function(estab_selecc_sesion){
    console.log(estab_selecc_sesion);
    CONFIG.ROL_CURRENT_USER = parseInt($scope.rol_id_funcionario, 10);
    CONFIG.ROL_CURRENT_USER_NAME = $scope.rol_nombre_funcionario;
    localStorage.setItem("ROL_CURRENT_USER", parseInt($scope.rol_id_funcionario, 10));
    localStorage.setItem("ROL_CURRENT_USER_NAME", $scope.rol_nombre_funcionario);
    $scope.es_id = estab_selecc_sesion.es_id;  
    
    //Guarda los datos del establecimiento en localStorage
    localStorage.removeItem("DatosEstablecimiento");
    Establecimientos.get({es_id:$scope.es_id}, function(data){
      var datosEst = JSON.stringify(data.establecimiento);
      localStorage.setItem("DatosEstablecimiento", datosEst);
      $scope.establecimiento = data.establecimiento;
    });
    //Guarda los datos del funcionario en LocalStorage, se guarda el establecimiento del rol que seleccionó
    var datosFun = {
      es_id: $scope.es_id,
      fun_id: estab_selecc_sesion.fun_id,
      fe_id: estab_selecc_sesion.fe_id,
    }
    var datosFunG = JSON.stringify(datosFun);
    localStorage.setItem("Funcionario", datosFunG);
    $timeout(function() {
      $location.path('/');
    },1000);
  }
}])*/

///!!!!!! QUITAR !!!!!!!!
.controller('ManualCtrl', ['$scope', 'CONFIG', function ($scope, CONFIG) {
  $scope.ajustes = {
    menu:{
      items:[
        {nombre:'Inicio', enlace:'#/', estilo:''},
        {nombre:'Manual de Usuario', enlace:'#/manual', estilo:'active'}]
    },
    pagina:{
      titulo:'Manual de Usuario'
    }
  } 

  if(CONFIG.ROL_CURRENT_USER == 1){
    $scope.manualUsuario = "./manuales/admin_sedes.pdf";
  }
  if(CONFIG.ROL_CURRENT_USER == 2){
    $scope.manualUsuario = "./manuales/admin_estab.pdf";
  }
  if(CONFIG.ROL_CURRENT_USER == 3){
    $scope.manualUsuario = "./manuales/estadistico.pdf";
  }
  if(CONFIG.ROL_CURRENT_USER == 4){
    $scope.manualUsuario = "./manuales/medico.pdf";
  }
  if(CONFIG.ROL_CURRENT_USER == 5){
    $scope.manualUsuario = "./manuales/enfermera.pdf";
  }
  if(CONFIG.ROL_CURRENT_USER == 6){
    $scope.manualUsuario = "./manuales/admisionista.pdf";
  }
  if(CONFIG.ROL_CURRENT_USER == 7){
    $scope.manualUsuario = "./manuales/paciente.pdf";
    $scope.manualAndroid = "./manuales/android.pdf"
  }
  if(CONFIG.ROL_CURRENT_USER == 8){
    $scope.manualUsuario = "./manuales/root.pdf";
  }
  if(CONFIG.ROL_CURRENT_USER == 9){
    $scope.manualUsuario = "./manuales/admin_medico.pdf";
  }
  if(CONFIG.ROL_CURRENT_USER == 10){
    $scope.manualUsuario = "./manuales/estadistico_admisionista_enfermera.pdf";
  }
}])


.controller('UsuariosFunCtrl', ['CONFIG', '$scope', 'UsuariosF', '$routeParams', 'toastr', '$route', /*'RolesUsuarios',*/ 'Usuarios', function (CONFIG,$scope,UsuariosF,$routeParams,toastr,$route,/*RolesUsuarios,*/Usuarios) {
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de usuarios',
      items:[
        {nombre:'Usuarios', enlace:'#/establecimiento/usuarios', estilo:'active'},
        {nombre:'Asignar Roles', enlace:'#/usuario/create', estilo:''}]
    },
    pagina:{
      titulo:'Usuarios Funcionarios'
    }
  }

  $scope.sortType = 'usu_id'; // set the default sort type
  $scope.sortReverse  = true;  // set the default sort order
  $scope.loading=true;


    var FunG = localStorage.getItem("Funcionario");
    var FunG = JSON.parse(FunG);

  
  UsuariosF.get(function(data){
    $scope.usuarios = data.usuario;

    if(data.status && $scope.usuarios.length>0) {
      $scope.loading = false;
      $scope.msg = data.status;
      /*for (var i = $scope.usuarios.length - 1; i >= 0; i--) {
        if ($scope.usuarios[i].rol_id==5){
          $scope.usuarios[i].rol_nombre = "ENFERMER0(A)";
        }
      };*/
    } else {
      $scope.loading = false;
      $scope.msg = false;
    }

  },function () {
      toastr.error("ERROR INESPERADO, POR FAVOR ACTUALICE LA PÁGINA");
      $scope.loading = false;
      $scope.msg = false;
    });

  $scope.ru_id = 0;
  $scope.nick = "";
  $scope.rol = "";
  $scope.roles = [
    { rol_id: 2, rol_nombre: "ADMINISTRADOR ESTABLECIMIENTO", rol_descripcion: "SE ENCARGA DE GESTIONAR TODOS LOS ELEMENTOS A REGISTRAR, ACTUALIZAR Y DAR DE BAJA EN ELE ESTABLECIMIENTO."},
    { rol_id: 9, rol_nombre: "ADMINISTRADOR MEDICO", rol_descripcion: "TIENE LOS ROLES DE ADMINISTRADOR DE ESTABLECIMIENTO Y MEDICO."},
    //{ rol_id: 3, rol_nombre: "ESTADISTICA", rol_descripcion: "SE ENCARGA DE TAREAS ESPECIFICAS, REPORTES Y ESTADISTICAS"},
    { rol_id: 4, rol_nombre: "MEDICO", rol_descripcion: "FUNCIONES ESPECIFICAS: REFERENCIA"},
    { rol_id: 5, rol_nombre: "ENFERMERA", rol_descripcion: "FUNCIONES ESPECIFICAS: REGISTRAR Y HACER SEGUIMIENTO A VACUNAS"},
    { rol_id: 6, rol_nombre: "ADMISIONISTA", rol_descripcion: "COMPLEMENTAR LA INFORMACION FINACIERA DE LAS RECERVAS Y FICHAJE"},
    //{ rol_id: 10, rol_nombre: "ESTADISTICO ADMISIONISTA ENFERMERA", rol_descripcion: "TIENE LOS ROLES DE ESTADISTICO ADMISIONISTA Y ENFERMERA "}
  ]
  $scope.get_usu_id = function (ru_id,nombres,paterno,materno,rol,rol_id,usu_id,per_id) {
    $scope.ru_id = ru_id;
    $scope.nick = nombres + " " + paterno + " " + materno;
    $scope.rol = rol;
    $scope.rol_id = rol_id;
    $scope.usu_id = usu_id;
    $scope.per_id = per_id;
  }

  $scope.usu = {
    rol_id: null,
    ru_estado: "ACTIVO"
  };

/*  $scope.cambiar_rol = function(rol_nuevo){
    console.log($scope.usu);
    RolesUsuarios.update({ru_id:$scope.ru_id}, $scope.usu).$promise.then(function(data){
      if(data.status){
        toastr.success('Los datos fueron actualizados correctamente');
        $route.reload();
      }
    })
  }*/

  $scope.restablecer_contrasenia = function(usu_id,per_id){
    Usuarios.update({usu_id:usu_id, per_id:per_id}).$promise.then(function(data){
      if(data.msg){
        toastr.success('Se reestableció la contraseña correctamente');
      } 
    },function () {
      toastr.error('Error inesperado, vuelva a intentar');
    })
  }

/*  $scope.remove = function(usu_id)
  {
    RolesUsuarios.update({ru_id:id, rol_id:$scope.rol_id, ru_estado:"INACTIVO"}).$promise.then(function(data)
    {
      if(data.status)
      {
        toastr.success('Eliminado correctamente');
        $route.reload();
      }
    })
  }*/
}])

.controller('UsuariosEstabCtrl', ['CONFIG', '$scope', 'UsuariosEstab', '$routeParams', 'toastr', '$route', /*'RolesUsuarios',*/ 'Usuarios', function (CONFIG,$scope,UsuariosEstab,$routeParams,toastr,$route,/*RolesUsuarios,*/Usuarios) {
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de usuarios',
      items:[
        {nombre:'Usuarios', enlace:'#/establecimiento/usuarios', estilo:'active'},
        {nombre:'Asignar Roles', enlace:'#/usuario/create', estilo:''}]
    },
    pagina:{
      titulo:'Usuarios del Establecimiento'
    }
  }

  $scope.sortType = 'usu_id'; // set the default sort type
  $scope.sortReverse  = true;  // set the default sort order
  $scope.loading=true;

  var es_id = 0;
  if (CONFIG.ROL_CURRENT_USER == 1){
    es_id = $routeParams.es_id;
  }
  else{
    var FunG = localStorage.getItem("Funcionario");
    var FunG = JSON.parse(FunG);
    es_id = FunG.es_id;
  }
  
  UsuariosEstab.get({es_id:es_id}, function(data){
    $scope.usuarios = data.usuario;
    if(data.status && $scope.usuarios.length>0) {
      $scope.loading = false;
      $scope.msg = data.status;
      for (var i = $scope.usuarios.length - 1; i >= 0; i--) {
        if ($scope.usuarios[i].rol_id==5){
          $scope.usuarios[i].rol_nombre = "ENFERMER0(A)";
        }
      };
    } else {
      $scope.loading = false;
      $scope.msg = false;
    }

  },function () {
      toastr.error("ERROR INESPERADO, POR FAVOR ACTUALICE LA PÁGINA");
      $scope.loading = false;
      $scope.msg = false;
    });

  $scope.ru_id = 0;
  $scope.nick = "";
  $scope.rol = "";
  $scope.roles = [
    { rol_id: 2, rol_nombre: "ADMINISTRADOR ESTABLECIMIENTO", rol_descripcion: "SE ENCARGA DE GESTIONAR TODOS LOS ELEMENTOS A REGISTRAR, ACTUALIZAR Y DAR DE BAJA EN ELE ESTABLECIMIENTO."},
    { rol_id: 9, rol_nombre: "ADMINISTRADOR MEDICO", rol_descripcion: "TIENE LOS ROLES DE ADMINISTRADOR DE ESTABLECIMIENTO Y MEDICO."},
    //{ rol_id: 3, rol_nombre: "ESTADISTICA", rol_descripcion: "SE ENCARGA DE TAREAS ESPECIFICAS, REPORTES Y ESTADISTICAS"},
    { rol_id: 4, rol_nombre: "MEDICO", rol_descripcion: "FUNCIONES ESPECIFICAS: REFERENCIA"},
    { rol_id: 5, rol_nombre: "ENFERMERA", rol_descripcion: "FUNCIONES ESPECIFICAS: REGISTRAR Y HACER SEGUIMIENTO A VACUNAS"},
    { rol_id: 6, rol_nombre: "ADMISIONISTA", rol_descripcion: "COMPLEMENTAR LA INFORMACION FINACIERA DE LAS RECERVAS Y FICHAJE"},
    //{ rol_id: 10, rol_nombre: "ESTADISTICO ADMISIONISTA ENFERMERA", rol_descripcion: "TIENE LOS ROLES DE ESTADISTICO ADMISIONISTA Y ENFERMERA "}
  ]
  $scope.get_usu_id = function (ru_id,nombres,paterno,materno,rol,rol_id,usu_id,per_id) {
    $scope.ru_id = ru_id;
    $scope.nick = nombres + " " + paterno + " " + materno;
    $scope.rol = rol;
    $scope.rol_id = rol_id;
    $scope.usu_id = usu_id;
    $scope.per_id = per_id;
  }

  $scope.usu = {
    rol_id: null,
    ru_estado: "ACTIVO"
  };

/*  $scope.cambiar_rol = function(rol_nuevo){
    console.log($scope.usu);
    RolesUsuarios.update({ru_id:$scope.ru_id}, $scope.usu).$promise.then(function(data){
      if(data.status){
        toastr.success('Los datos fueron actualizados correctamente');
        $route.reload();
      }
    })
  }*/

  $scope.restablecer_contrasenia = function(usu_id,per_id){
    Usuarios.update({usu_id:usu_id, per_id:per_id}).$promise.then(function(data){
      if(data.msg){
        toastr.success('Se reestableció la contraseña correctamente');
      } 
    },function () {
      toastr.error('Error inesperado, vuelva a intentar');
    })
  }

/*  $scope.remove = function(usu_id)
  {
    RolesUsuarios.update({ru_id:id, rol_id:$scope.rol_id, ru_estado:"INACTIVO"}).$promise.then(function(data)
    {
      if(data.status)
      {
        toastr.success('Eliminado correctamente');
        $route.reload();
      }
    })
  }*/
}])


///Para ver el perfil de un usuario, funcionario, persona
.controller('PerfilCtrl', ['CONFIG', '$scope', 'Usuarios', 'Funcionarios', 'Personas', 
  function (CONFIG,$scope, Usuarios, Funcionarios, Personas) {
  $scope.ajustes = {
    menu:{
      titulo: 'Mi Perfil',
      items:[
        {nombre:'Mi Perfil', enlace:'#/perfil', estilo:'active'},
        {nombre:'Cambiar Contraseña', enlace:'#/usuario/edit', estilo:''}]
    },
    pagina:{
      titulo:'Mi Perfil'
    }
  }
  
  var SesionG = localStorage.getItem("Sesion");
  var SesionG = JSON.parse(SesionG);
    
  var per_id1 = SesionG.per_id;

  $scope.clase="col-md-offset-2 col-md-8 col-sm-8";

  if(CONFIG.ROL_CURRENT_USER){
    $scope.clase = "col-md-8 col-sm-8";
    if(CONFIG.ROL_CURRENT_USER!=1 && CONFIG.ROL_CURRENT_USER!=7)
    { var FunG = localStorage.getItem("Funcionario");
      var FunG = JSON.parse(FunG);
      Funcionarios.get({fe_id:FunG.fe_id}, function(data)
      {
        $scope.funcionario = data.funcionario;
      }); 
    }
  }

  Personas.get({per_id:per_id1}, function(data)
  {
    $scope.persona = data.persona;
    $scope.src=$scope.persona.imagen.ima_enlace+'/'+$scope.persona.imagen.ima_nombre;
   
  });
  
  $scope.usuario = SesionG.usu_nick;
  $scope.rol = CONFIG.ROL_CURRENT_USER;
}])

//Permite al usuario editar su contraseña
.controller('EditUsuarioCtrl', ['$scope','toastr','$route', 'Usuarios', function ($scope,toastr,$route, Usuarios) {
  $scope.ajustes = {
    menu:{
      titulo: 'Mi Perfil',
      items:[
        {nombre:'Mi Perfil', enlace:'#/perfil', estilo:''},
        {nombre:'Cambiar Contraseña', enlace:'#/usuario/edit', estilo:'active'}]
    },
    pagina:{
      titulo:'Cambiar Contraseña',
      action:'GUARDAR'
    }
  }
  
  var SesionG = localStorage.getItem("Sesion");
  var SesionG = JSON.parse(SesionG);
  
  Usuarios.get({usu_id:SesionG.id}, function(data)
  {
    $scope.usuario = data.usuario;
  }); 

  $scope.usuario1 = {
    password : null,
    new_password : null
  }

  $scope.submit = function(){
    Usuarios.update({usu_id:$scope.usuario.usuario.id},$scope.usuario1).$promise.then(function(data){
      if(data.msg){
        if(data.usuario == "Las contraseñas no coinciden")
        {
          $scope.mensaje = data.usuario;
          $scope.ajustes.pagina.success = null;
        } 
        else if (data.usuario == "La contraseña debe ser mínimo 8 caracteres"){
          $scope.mensaje = data.usuario;
          $scope.ajustes.pagina.success = null;
        } 
        else if (data.usuario_nuevo.id){
        $scope.ajustes.pagina.success = "SE CAMBIÓ LA CONTRASEÑA DE MANERA CORRECTA";
          $scope.mensaje = null;
          $scope.usuario1 = {
            password : null,
            new_password : null
          }
      
        } else{
          $scope.mensaje = "ERROR, VUELVA A INTENTAR";
          $scope.ajustes.pagina.success = null;
        }
      } 
    },function () {
      console.log(data);
    })
  }
}])

.controller('ActivaCuentaCtrl', ['$scope','$route', '$routeParams', 'CONFIG', 'PersonasUsuarios','UsuariosCuentas','toastr',
  function ($scope, $route, $routeParams, CONFIG, PersonasUsuarios,UsuariosCuentas,toastr){

      $scope.rol_id=CONFIG.ROL_CURRENT_USER;
      if ($scope.rol_id==6 || $scope.rol_id==3 || $scope.rol_id==10){
      $scope.ajustes = {
        menu:{
          titulo: 'Gestión de Pacientes',
          items:[
            {nombre:'Pacientes Registrados', enlace:'#/establecimientos/pacientes', estilo:''},
            {nombre:'Registrar Paciente', enlace:'#/pacientes/create', estilo:''},
            {nombre:'Activar cuenta', enlace:'#/pacientes/activa_cuenta', estilo:'active'}]
        },
        pagina:{
          titulo:'Pacientes Registrados'
        }
      }
    }
    else{
      $scope.ajustes = {
        menu:{
          titulo: 'Gestión de Pacientes',
          items:[
            {nombre:'Pacientes Registrados', enlace:'#/establecimientos/pacientes', estilo:'active'}]
        },
        pagina:{
          titulo:'Pacientes Registrados'
        }
      }
    }

    $scope.id=null;
    $scope.show=false;

    $scope.sw=false;

    $scope.get = function(id){
      console.log("entro a la funcion");
      $scope.id=id;
      $scope.est="";
        PersonasUsuarios.get({ci:id}, function(data)
        {
            $scope.show=true;
            $scope.datos = data;

            $scope.identificador=true;
            if($scope.datos.persona.estado == 0){
                $scope.mensaje = "Usted cumple las condiciones para activar su cuenta";
                $scope.est = "e0";
                $scope.id_per = $scope.datos.persona.personas.per_id;
                $scope.msg=false;
            }
            if($scope.datos.persona.estado == 1){
                $scope.mensaje = "La persona no cumple con las condiciones para activar su cuenta";
                $scope.est = "e1";
            }
            if($scope.datos.persona.estado == -1){
                $scope.mensaje = "Este número de carnet no se encuentra registrado";
                $scope.est = "e-1";
            }
        });
    }

    $scope.submit = function(per_id){
        $scope.sw=false;

        console.log(per_id+" perrr id");
         UsuariosCuentas.get({per_id:per_id}, function(data)
           {
                $scope.estado = data.estado;
                //console.log("estado"+$scope.estado);
                // estado = 0 ya tiene cuenta
                if( $scope.estado == '0'){
                    $scope.sw=true;
                    $scope.msg=false;
                    $scope.show=false;
                    $scope.est = "";
                    $scope.id=null;
                    //$route.reload();
                }
                //estado = 1 crearcuenta
                if( $scope.estado == '1'){
                    $scope.sw=false;
                    toastr.success('CUENTA ACTIVADA CORRECTAMENTE');                    
                    $scope.msg=true;
                    $scope.show=false;
                    $scope.est = "";
                    $scope.id=null;
                   // $route.reload();
                }
                //$scope.sw=true;
           });        
    }
}])