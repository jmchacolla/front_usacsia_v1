'use-strict';
angular.module("adminApp")
.controller('NumeroFichaController', ['$http','CONFIG','$scope','Ficha', '$route', 'toastr', function ($http,CONFIG,$scope,Ficha, $route, toastr){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Fichas',
      items:[
        {nombre:'Asignación de Número de Ficha', enlace:'#/numero-ficha/crear', estilo:'active'}]
    },
    pagina:{
      titulo:'Asignación de Número de Ficha'
    }
  }
  $scope.CurrentDate=new Date();
  $scope.ficha={
    pt_id:null
  }
  $scope.num_ficha_traido_del_crear=0;

  //guarda la ficha input pt_id
  $scope.savef=function(a)
  {
     $scope.ficha.pt_id=a;
     console.log('hasta aqui llego la funcion',$scope.ficha);
    Ficha.save($scope.ficha).$promise.then(function(data)
    {
      if(data.status)
      {
        $scope.ajustes.pagina.success="Muestra asignada exitosamente";
        $scope.aux1=data.ficha.ficha.fic_id;
        $scope.aux2=data.ficha.consultorio_cod;
        console.log('ESTE ES EL NUMERO DE FICHA QUE SE ASIGNÓ',$scope.aux2);
        verNumeroFicha($scope.aux1,$scope.aux2);
        toastr.success('Número de ficha asignada correctamente');
      }
    });
  }
  function verNumeroFicha(fic_id,con_cod){
      $http.get(CONFIG.DOMINIO_SERVICIOS+'/ficha/'+fic_id).success(function(respuesta){
          $scope.num_ficha_traido_del_crear = respuesta.ficha.fic_numero;
          $scope.num_con_traido_del_crear = con_cod;
          console.log('llamo a la funcion', $scope.num_ficha_traido_del_crear);
      });
  }


  $scope.recarga=function(){
    $route.reload();
  }

}])



/*LISTAR FICHAS DE ATENCION*/
.controller('AtencionCtrl', ['$scope', 'FichasfechaService', 'Ficha', '$route', 'toastr', 'Horario', '$timeout', '$location', 'CONFIG', function ($scope, FichasfechaService, Ficha, $route, toastr, Horario,$timeout, $location, CONFIG) 
{
    
    var FunG = localStorage.getItem("Funcionario");
    var FunG = JSON.parse(FunG);
    console.log("MENUCONTROLLER DATOS FUNCIONARIO jajjajaj", FunG);


    $scope.today=moment(new Date(), "YYYY-MM-DD") .format("DD-MM-YY");
    $scope.ajustes = {
      menu:{
        titulo: 'Atencion de Pacientes',
        items:[
        {nombre:'Fichas de atención', enlace:'#/atencion', estilo:'active'},
        {nombre:'Atención consulta', enlace:'#/atencion-consulta', estilo:''}
        ]
      },
      pagina:{
        titulo:'Atención para el Carné Sanitario '+$scope.today
      }
    };

    console.log("MENUCONTROLLER DATOS FUNCIONARIO jajjajaj", FunG);
    Horario.get({fun_id:FunG.fun_id},function (argument) {
        $scope.horario=argument.horario;
        $scope.funcionario=argument.funcionario;
        $scope.persona=argument.persona;
        $scope.ambiente=argument.ambiente;
        $scope.consultorio=argument.consultorio;

        // console.log('argument----', $scope.consultorio.con_id);
        $scope.fecha={
          fecha1:moment(new Date(), "YYYY-MM-DD") .format("DD-MM-YYYY"),
          fecha2:moment(new Date(), "YYYY-MM-DD") .format("DD-MM-YYYY"),
          fic_estado:'PENDIENTE',
          fun_id:FunG.fun_id,
          con_id:$scope.consultorio.con_id
        };


        FichasfechaService.get($scope.fecha, function(data){
          console.log('*******fichafecha---------', data);
          $scope.fichas = data.fichas;

          if(data.fichas.length>0){
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


    })
    

    $scope.sortType = 'fic_numero'; // set the default sort type
    $scope.sortReverse  = true;  // set the default sort order
    $scope.Personas = [];
    $scope.loading=true;//para hacer un loading
    var tra_id = 1;
    
    var id=0;
    $scope.nombre_completo = "";
    $scope.get_per_id = function(pt_id, per_apellido_primero, per_apellido_segundo, per_nombres){
      id = pt_id;
      $scope.nombre_completo = per_apellido_primero + " " + per_apellido_segundo + " " + per_nombres;
    }
    $scope.atender = function (fic_id/*, pt_id*/) {
      // body...
      var fic_id=fic_id;
      var pt=id;
      $timeout(function() {
       $location.path('/prueba-medica/'+pt);
        },1000);
    }
}])

/*LISTAR FICHAS DE ATENCION*/
.controller('AtencionConsultaCtrl', ['$scope', 'FichasfechaService', 'Ficha', '$route', 'toastr', 'Horario', '$timeout', '$location', 'CONFIG', function ($scope, FichasfechaService, Ficha, $route, toastr, Horario,$timeout, $location, CONFIG) 
{
    
    var FunG = localStorage.getItem("Funcionario");
    var FunG = JSON.parse(FunG);
    console.log("MENUCONTROLLER DATOS FUNCIONARIO jajjajaj", FunG);


    $scope.today=moment(new Date(), "YYYY-MM-DD") .format("DD-MM-YY");
    $scope.ajustes = {
      menu:{
        titulo: 'Atencion de Pacientes',
        items:[
        {nombre:'Fichas de atención', enlace:'#/atencion', estilo:''},
        {nombre:'Atención consulta', enlace:'#/atencion-consulta', estilo:'active'}
        ]
      },
      pagina:{
        titulo:'Atención para el Carné Sanitario '+$scope.today
      }
    };

    console.log("MENUCONTROLLER DATOS FUNCIONARIO jajjajaj", FunG);
    Horario.get({fun_id:FunG.fun_id},function (argument) {
        $scope.horario=argument.horario;
        $scope.funcionario=argument.funcionario;
        $scope.persona=argument.persona;
        $scope.ambiente=argument.ambiente;
        $scope.consultorio=argument.consultorio;

        // console.log('argument----', $scope.consultorio.con_id);
        $scope.fecha={
          fecha1:moment(new Date(), "YYYY-MM-DD") .format("DD-MM-YYYY"),
          fecha2:moment(new Date(), "YYYY-MM-DD") .format("DD-MM-YYYY"),
          fic_estado:'ENFERMERIA',
          fun_id:FunG.fun_id,
          con_id:$scope.consultorio.con_id
        };

        FichasfechaService.get($scope.fecha, function(data){
          // console.log('*******fichafecha---------', data);
          $scope.fichas = data.fichas;

          if(data.fichas.length>0){
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


    })
    

    $scope.sortType = 'fic_numero'; // set the default sort type
    $scope.sortReverse  = true;  // set the default sort order
    $scope.Personas = [];
    $scope.loading=true;//para hacer un loading
    var tra_id = 1;
    
    var id=0;
    $scope.nombre_completo = "";
    $scope.get_per_id = function(pt_id, per_apellido_primero, per_apellido_segundo, per_nombres){
      id = pt_id;
      $scope.nombre_completo = per_apellido_primero + " " + per_apellido_segundo + " " + per_nombres;
    }
    $scope.atender = function (fic_id, pm_id) {
      var fic_id=fic_id;
      var pm_id=pm_id;
      $timeout(function() {
       $location.path('/prueba-medica/prueba/'+pm_id);
        },1000);
    }
}])


.controller('apiAppCtrl_persona_ficha', ['$http', '$scope', 'CONFIG', '$route', buscaPersonaController])
function buscaPersonaController($http, $scope, CONFIG, $route){
  $scope.buscaPersona = function($per_ci){
    console.log('esta buscando persona');
      $scope.tamanio="Cargando...";//////CAMBIADO
      $http.get(CONFIG.DOMINIO_SERVICIOS+'/buscar_persona_tramite_ficha/'+$scope.per_ci).success(function(respuesta){
          $scope.persona_tramite = respuesta.persona_tramite;
          $scope.tamanio="";
          if(respuesta.persona_tramite){
              $scope.tamanio="";
              $scope.ver=true;
              $scope.switch=false;
          } else if(!respuesta.persona_tramite){
              $scope.ver=false;
              $scope.tamanio="La persona con el carnet ingresado, no inició un Trámite";
          }
          if(respuesta.ficha){
              $scope.tamanio="La persona ya cuenta con un numero de ficha";
              $scope.verprueba=true;
          }
      });
  }
}



