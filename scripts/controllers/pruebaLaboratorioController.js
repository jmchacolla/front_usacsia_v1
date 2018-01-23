'use-strict';
angular.module("adminApp")
.controller('PruebaLaboratorioCtrl', ['$scope', 'PruebaLaboratorioService', '$route', 'toastr', function ($scope, PruebaLaboratorioService, $route, toastr){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Pruebas de Laboratorio',
      items:[
        {nombre:'Pruebas de Laboratorio', enlace:'#/prueba-laboratorio', estilo:'active'}]
    },
    pagina:{
      titulo:'Lista de Pruebas de Laboratorio'
    }
  }
  
  $scope.sortType = 'pl_id'; // set the default sort type
  $scope.sortReverse  = true;  // set the default sort order
  $scope.Personas = [];

  $scope.loading=true;//para hacer un loading
  PruebaLaboratorioService.get(function(data){
    console.log(data);
    $scope.prueba_laboratorio = data.prueba_laboratorio;
    if(data.prueba_laboratorio.length>0){
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


.controller('CrearPruebaLaboratorioCtrl', ['$scope', '$routeParams','ParasitosPrueba','Parasito','ParasitosNoPrueba','PruebaLaboratorioService','PruebaPar','ParasitosPrueba', 'Muestra','$route', 'toastr','$location','$timeout',
  function ($scope,$routeParams,ParasitosPrueba,Parasito,ParasitosNoPrueba,PruebaLaboratorioService,PruebaPar,ParasitosPrueba,Muestra, $route, toastr,$location,$timeout){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Pruebas de Laboratorio',
      items:[
        {nombre:'Buscar número de muestra', enlace:'#/buscar-numero-muestra', estilo:'active'}
        ]
    },
    pagina:{
      titulo:'Busca Número de Muestra'
    }
  }
  var FunG = localStorage.getItem("Funcionario");
  var FunG = JSON.parse(FunG);

  $scope.sortType = 'per_id'; // set the default sort type
  $scope.sortReverse  = true;  // set the default sort order
  var mue_id = $routeParams.mue_id;
  var fun_id=FunG.fun_id;//remplaar con la sesion
  /*

  prueba laboratiosio deberia tener presencia de moco, y presencia de sangre*/
  $scope.CurrentDate=new Date();
  // usu=per_id
  // rol,nombre


  $scope.ver=false;
  $scope.loading=true;//para hacer un loading
  PruebaLaboratorioService.get(function(data){
    console.log(data);
    $scope.prueba_laboratorio = data.prueba_laboratorio;
    if(data.prueba_laboratorio.length>0){
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
    /*tambien deberia enviar en fun_id del laboratorisr que realiza la prueba*/
  $scope.pruebalaboratorio={
    mue_id:null
  }
  $scope.pruebapar={
      pl_id:null,
      par_id:null
    }
  
  var pl_id=null;
  $scope.negcreado=false;
  $scope.saveplnegativo=function(mue_id){
    $scope.pruebalaboratorio.mue_id=mue_id;
    $scope.pruebalaboratorio.fun_id=fun_id;
    console.log("prueba laboratorio creada",$scope.pruebalaboratorio);
    PruebaLaboratorioService.save($scope.pruebalaboratorio).$promise.then(function(data)
    {
      if(data.status){
        $scope.negcreado=true;
        $scope.pruebapar.pl_id=data.prueba_laboratorio.pl_id;
         pl_id=data.prueba_laboratorio.pl_id;
        console.log("id_ de la prueba labortorio creada" , $scope.pruebapar.pl_id);
        toastr.success('Muestra Negativa');
      }
    })
  }

   $scope.recarga=function(){
    $route.reload();
  }


  /*se crea la prueba laboratorio positiva*/
 
  $scope.savepl=function(mue_id){
    $scope.pruebalaboratorio.mue_id=mue_id;
    $scope.pruebalaboratorio.fun_id=fun_id;
    PruebaLaboratorioService.save($scope.pruebalaboratorio).$promise.then(function(data)
    {
      if(data.status){
        $scope.pruebapar.pl_id=data.prueba_laboratorio.pl_id;
        $timeout(function() {
          $location.path('/prueba-laboratorio/crear/'+$scope.pruebapar.pl_id);
        },10);
        toastr.success('Prueba Laboratorio guardada correctamente');
      }
    })
  }
  
    $scope.cancelar=function(){
    PruebaLaboratorioService.delete({pl_id:pl_id}).$promise.then(function(data)
    {
      if(data.status)
      {
        $timeout(function() {
          $location.path('/buscar-numero-muestra');
        },1);
        $route.reload();
      }
    })
  }

}])

//crear prueba laboratorio parasitos y otros
.controller('EditarPruebaLaboratorioCtrl', ['$http','CONFIG','$scope', '$routeParams','ParasitosPrueba','Parasito','ParasitosNoPrueba','PruebaLaboratorioService','PruebaPar','ParasitosPrueba', 'Muestra','$route', 'toastr','$location','$timeout',
  function ($http,CONFIG,$scope,$routeParams,ParasitosPrueba,Parasito,ParasitosNoPrueba,PruebaLaboratorioService,PruebaPar,ParasitosPrueba,Muestra, $route, toastr,$location,$timeout){

    var pl_id=$routeParams.pl_id;
    $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Pruebas de Laboratorio',
      items:[
       {nombre:'Crear Prueba de laboratorio', enlace:'#/prueba-laboratorio/crear/'+pl_id, estilo:'active'}]
    },
    pagina:{
      titulo:'Prueba de laboratorio:'
    }
  }
  
  var FunG = localStorage.getItem("Funcionario");
  var FunG = JSON.parse(FunG);

  $scope.sortType = 'per_id'; // set the default sort type
  $scope.sortReverse  = true;  // set the default sort order
  var fun_id=FunG.fun_id;//remplaar con la sesion
  $scope.CurrentDate=new Date();
  

  /*para ver el numero de muestra*/
  PruebaLaboratorioService.get({pl_id:pl_id},function(data){
    $scope.numero_muestra=data.prueba_laboratorio;
    console.log('numero de muetra traido',$scope.numero_muestra, data.prueba_laboratorio.mue_num_muestra,data);
  })


  /*lista de parasitos que no estan asignados en la prueba*/
    ParasitosNoPrueba.get({pl_id:pl_id},function(data){
     $scope.parasitosno = data.pruebaparasito;
     console.log("llega al parasito no ---",$scope.parasitosno);

  })
    $scope.pruebapar={
      pl_id:pl_id,
      par_id:null
    }
  /*se crea la prueba parasito, solo recibe pl_id y par_id*/
    $scope.agregar=function(a){
     $scope.pruebapar.par_id=a; 
    console.log("parasitos encontrados en la prueba.....",$scope.pruebapar);
    PruebaPar.save($scope.pruebapar).$promise.then(function(data)
    {
      if(data.status)
        {
          $scope.ajustes.pagina.success="Parasito agregado exitosamente";
          actualiza_parasitos_no_prueba($scope.pruebapar.pl_id);
          actualiza_parasitos_prueba($scope.pruebapar.pl_id);
        }else{
        toastr.error("ERROR INESPERADO, POR FAVOR VUELVA A INTENTAR");
      }
    })
  }

    $scope.tam=1;
  /*lista de parasitos que estan asignados en la prueba*/
    ParasitosPrueba.get({pl_id:pl_id},function(data){
     $scope.parasitos = data.pruebaparasito;
     console.log("llega al parasito---",data.pruebaparasito);
     if(data.pruebaparasito.length==0){
          $scope.tam=0;   
     }else{
       $scope.tam=1;
     }
  })
    $scope.retirar = function(pp_id) {
    PruebaPar.delete({pp_id:pp_id}).$promise.then(function(data){
        if(data.status) {
         actualiza_parasitos_no_prueba($scope.pruebapar.pl_id);
         actualiza_parasitos_prueba($scope.pruebapar.pl_id);
        }else{
        toastr.error("ERROR INESPERADO, POR FAVOR VUELVA A INTENTAR");
      }
      })
  }

  function actualiza_parasitos_no_prueba(pl_id){
     $http.get(CONFIG.DOMINIO_SERVICIOS+'/parasitos_no_prueba/'+pl_id).success(function(respuesta){
                $scope.parasitosno = respuesta.pruebaparasito;
            });
  }
  function actualiza_parasitos_prueba(pl_id){
    $http.get(CONFIG.DOMINIO_SERVICIOS+'/parasitosprueba/'+pl_id).success(function(respuesta){
                $scope.parasitos = respuesta.pruebaparasito;
                if(respuesta.pruebaparasito.length==0){
                  $scope.tam=0;
                    }else{
                      $scope.tam=1;
                    }
            });
  }

/*ultimo cambio*/
  /*para l editar de la prueba laboratorio*/
    $scope.prueba_labo={
    fun_id:fun_id,
    pl_estado:"",
    pl_tipo:"",
    pl_color:"",
    pl_aspecto:"",
    pl_moco:false,
    pl_sangre:false,
    pl_estado:"",
    pl_observaciones:""
  }

$scope.checkmoco=false;
$scope.checksangre=false;
$scope.moco=function(){
  if($scope.checkmoco){
    $scope.checkmoco=false;
  }
  else{
    $scope.checkmoco=true;
  }
  console.log('check1',$scope.checkmoco);
}

$scope.sangre=function(){
  if($scope.checksangre){
    $scope.checksangre=false;
  }
  else{
    $scope.checksangre=true;
  }
  console.log('check2',$scope.checksangre);
}
      

  /*se editan los datos de la prueba laboratorio*/
  $scope.guardar=function(par_id){
    $scope.prueba_labo.pl_moco=$scope.checkmoco;
    $scope.prueba_labo.pl_sangre=$scope.checksangre;
    console.log("prueba laboratorio que hay ue guardar.....",$scope.prueba_labo);
    PruebaLaboratorioService.update({pl_id:$scope.pruebapar.pl_id}, $scope.prueba_labo).$promise.then(function(data){
    {
      if(data.status){
        toastr.success('Prueba de laboratorio Guardada correctamente');
        $timeout(function() {
          $location.path('/prueba-laboratorio/ver/'+pl_id);
        },1000);
        }
      }
    })
}

  $scope.cancelar=function(){
    PruebaLaboratorioService.delete({pl_id:pl_id}).$promise.then(function(data)
    {
      if(data.status)
      {
        $timeout(function() {
          $location.path('/buscar-numero-muestra');
        },1);
        $route.reload();
      }
    })
  }

}])



.controller('VerPruebaLaboratorioCtrl', ['$http','CONFIG','$scope', '$routeParams','ParasitosPrueba','Parasito','ParasitosNoPrueba','PruebaLaboratorioService','PruebaPar','ParasitosPrueba', 'Muestra','$route', 'toastr','$location','$timeout',
  function ($http,CONFIG,$scope,$routeParams,ParasitosPrueba,Parasito,ParasitosNoPrueba,PruebaLaboratorioService,PruebaPar,ParasitosPrueba,Muestra, $route, toastr,$location,$timeout){
     var pl_id=$routeParams.pl_id;
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Pruebas de Laboratorio',
      items:[
        {nombre:'Detalle de Prueba de Laboratorio', enlace:'#/prueba-laboratorio/ver/'+pl_id, estilo:'active'},
        {nombre:'Pruebas de Laboratorio', enlace:'#/prueba-laboratorio', estilo:''}]
    },
    pagina:{
      titulo:'Detalle de Prueba Laboratorio'
    }
  }
  var FunG = localStorage.getItem("Funcionario");
  var FunG = JSON.parse(FunG);

  $scope.sortType = 'per_id'; // set the default sort type
  $scope.sortReverse  = true;  // set the default sort order
  var fun_id=FunG.fun_id;//remplaar con la sesion
  $scope.CurrentDate=new Date();
 

  /*para ver el numero de muestra*/
  PruebaLaboratorioService.get({pl_id:pl_id},function(data){
    $scope.prueba_laboratorio =data.prueba_laboratorio;
    $scope.funcionario =data.funcionario;
    $scope.parasitos =data.parasitos;
  })
}])


.controller('apiAppCtrl_numeromuestra', ['$http', '$scope', 'CONFIG', buscaNumeroMuestraCtrl])
function buscaNumeroMuestraCtrl($http, $scope, CONFIG){
  $scope.buscaNumeroMuestra = function(){

    console.log('esta buscando numero de muestra', $scope.numero_muestra);
      $scope.tamanio="Cargando...";//////CAMBIADO
      $http.get(CONFIG.DOMINIO_SERVICIOS+'/buscar_numero_muestra/'+$scope.numero_muestra).success(function(respuesta){
          $scope.muestra = respuesta.muestra;
          if(respuesta.muestra){
              $scope.tamanio="";
              $scope.ver=true;
              $scope.switch=false;
          } else if(!respuesta.muestra){
              $scope.ver=false;
              $scope.tamanio="El numero de muestra ingresado no fue asignado";
          }
          if(respuesta.pruebalabo){
              $scope.tamanio="La muestra ya fue analizada";
              $scope.verprueba=true;
          }
      });
  }
};


