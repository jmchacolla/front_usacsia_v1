'use-strict';
angular.module("adminApp")
//lista tramites propietarios naturales segun funcionario inspector
.controller('NatInsCtrl', ['$scope', 'NatI', '$route', 'toastr', '$location', function ($scope, NatI, $route, toastr,$location)
{
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de tramites de Certificado Sanitario',
      items:[
        {nombre:'Propietarios Naturales', enlace:'#/tramites_nat', estilo:'active'},
        {nombre:'Propietarios Juridicos', enlace:'#/tramites_jur', estilo:''},
        {nombre:'Establecimientos inspeccionados', enlace:'#/lista-inspeccionados', estilo:''}
        /*,
        {nombre:'Busqueda de personas registradas', enlace:'#/tramite/crear', estilo:''}*/]
    },
    pagina:{
      titulo:'Trámites de Certificado Sanitario'
    }
  }
var FunG = localStorage.getItem("Funcionario");
  var FunG = JSON.parse(FunG);
 var fun_id = FunG.fun_id;

  
  $scope.sortType = 'per_id'; // set the default sort type
  $scope.sortReverse  = true;  // set the default sort order
  $scope.Personas = [];
  $scope.loading=true;//para hacer un loading

  NatI.get({fun_id:fun_id}, function(data){
    console.log('*******empresa_tramite ---------', data);
    $scope.empresa_tramite = data.empresa_tramite;
 
    if(data.empresa_tramite.length>0){
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

  var id=0;
  $scope.nombre_completo = "";
  $scope.get_per_id = function(per_id, per_apellido_primero, per_apellido_segundo, per_nombres){
    id = per_id;
    $scope.nombre_completo = per_apellido_primero + " " + per_apellido_segundo + " " + per_nombres;
  }

  $scope.remove = function(per_id){
    Personas.delete({per_id:id}).$promise.then(function(data){
      if(data.mensaje){
        toastr.success('Eliminado correctamente');
        $route.reload();
      }
    })
  }
}])


 //lista tramites propietarios Juridicos
.controller('JurInsCtrl', ['$scope', 'JurI', '$route', 'toastr', '$location', function ($scope, JurI, $route, toastr,$location)
{
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de tramites de Certificado Sanitario',
      items:[
        {nombre:'Propietarios Naturales', enlace:'#/tramites_nat', estilo:''},
        {nombre:'Propietarios Juridicos', enlace:'#/tramites_jur', estilo:'active'},
        {nombre:'Establecimientos inspeccionados', enlace:'#/lista-inspeccionados', estilo:''}/*,
        {nombre:'Busqueda de personas registradas', enlace:'#/tramite/crear', estilo:''}*/]
    },
    pagina:{
      titulo:'Trámites de Certificado Sanitario'
    }
  }
  var FunG = localStorage.getItem("Funcionario");
  var FunG = JSON.parse(FunG);
  var fun_id = FunG.fun_id;
  $scope.sortType = 'et_id'; // set the default sort type
  $scope.sortReverse  = true;  // set the default sort order
  $scope.Personas = [];

  
  $scope.loading=true;//para hacer un loading

  JurI.get({fun_id:fun_id}, function(data){
    console.log('*******empresa_tramite ---------', data);
    $scope.empresa_tramite = data.empresa_tramite;
 
    if(data.empresa_tramite.length>0){
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

  var id=0;
  $scope.nombre_completo = "";
  $scope.get_per_id = function(per_id, per_apellido_primero, per_apellido_segundo, per_nombres){
    id = per_id;
    $scope.nombre_completo = per_apellido_primero + " " + per_apellido_segundo + " " + per_nombres;
  }

  $scope.remove = function(per_id){
    Personas.delete({per_id:id}).$promise.then(function(data){
      if(data.mensaje){
        toastr.success('Eliminado correctamente');
        $route.reload();
      }
    })
  }
}])

.controller('CrearFichaInsCtrl', ['$http','CONFIG','$scope','FichaIn', '$route', 'toastr','EmpTra','Funcionarios','$timeout','$location','$routeParams','EstadoIns', function ($http,CONFIG,$scope,FichaIn, $route, toastr,EmpTra,Funcionarios,$timeout,$location,$routeParams,EstadoIns){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Fichas de Inspección',
      items:[
      {nombre:'Propietarios Naturales', enlace:'#/tramites_nat', estilo:''},
        {nombre:'Propietarios Juridicos', enlace:'#/tramites_jur', estilo:''},
        {nombre:'Establecimientos inspeccionados', enlace:'#/lista-inspeccionados', estilo:''},
        {nombre:'Crear Ficha', enlace:'#/numero-ficha/crear', estilo:'active'}]
    },
    pagina:{
      titulo:'Crear Ficha'
    }
  }
 var et_id=$routeParams.et_id;
 $scope.CurrentDate = new Date();
 var mes=$scope.CurrentDate.getMonth()+1;
 
 
 var fecha=$scope.CurrentDate.getDate()+"-"+mes+"-"+$scope.CurrentDate.getFullYear();

  var FunG = localStorage.getItem("Funcionario");
  var FunG = JSON.parse(FunG);
  var fun_id = FunG.fun_id;
  console.log("__HORA__",fecha);


  $scope.propietario='';

  EmpTra.get({et_id:et_id},function(data){
    $scope.emp_tra=data.establecimiento;

    if ($scope.emp_tra.propietario.pro_tipo=='J') {
      $scope.propietario=$scope.emp_tra.propietario.pjur_razon_social;
    }
    if ($scope.emp_tra.propietario.pro_tipo=='N') {
      $scope.propietario=$scope.emp_tra.propietario.per_nombres+' '+$scope.emp_tra.propietario.per_apellido_primero+' '+$scope.emp_tra.propietario.per_apellido_segundo;   
    }
    $scope.direccion=$scope.emp_tra.establecimiento_sol.ess_avenida_calle+' #'+$scope.emp_tra.establecimiento_sol.ess_numero+' '+$scope.emp_tra.establecimiento_sol.ess_stand
   
  });
  Funcionarios.get({fun_id:fun_id},function(data){
    $scope.funcionarios=data.funcionario;
    $scope.nombre=$scope.funcionarios.persona.per_nombres+' '+$scope.funcionarios.persona.per_apellido_primero+' '+$scope.funcionarios.persona.per_apellido_segundo;

  });

  $scope.ficha = {

      et_id :null,
      fun_id :null,
      fi_fecha_asignacion:fecha,
      fi_fecha_realizacion:fecha,
      fi_observacion:'',
      fi_estado:'',
      fi_foco_insalubridad:false,
      fi_exibe_certificado:false,
      fi_exibe_carne:false,
      fi_extinguidor:false,
      fi_botiquin:false
    
    
    };

    $scope.patternCadena = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$/;
    $scope.patternCadenaNumero = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ 0-9.]*$/;

    $scope.datos={
            fun_id:null,
            te_estado:'',
            te_observacion:'',
            te_fecha:''
        }
    
    $scope.submit = function(b)
    {
      console.log("llega a funcion submit.....",b);
        $scope.ficha.fun_id=fun_id;
        $scope.ficha.et_id=et_id;
        $scope.ficha.fi_estado='INSPECCIONADO';
        if ($scope.checkedI) {
             $scope.datos={
                fun_id:fun_id,
                te_estado:'OBSERVADO',
                te_observacion:$scope.datos.te_observacion,
                te_fecha:fecha
            }
            $scope.ficha.fi_observacion=$scope.datos.te_observacion;
          }
          else{
             $scope.datos={
                fun_id:fun_id,
                te_estado:'APROBADO',
                te_observacion:'NINGUNA',
                te_fecha:fecha
            }
            $scope.ficha.fi_observacion='NINGUNA';
          }
      EstadoIns.update({et_id:et_id}, $scope.datos).$promise.then(function(data)
      {
        console.log("__datos tramitecer__",$scope.datos);
          if(data.status) {
            angular.copy({}, $scope.datos);
          }
         

      })
     

       
     console.log("_______GURDANDO_______",$scope.ficha);
    
      FichaIn.save($scope.ficha).$promise.then(function(data)
      {
        console.log("------GUARDADO.---------",data);
        if(data.msg)
        {
          console.log("data",data);
          angular.copy({}, $scope.ficha1);
          $scope.ajustes.pagina.success = "FICHA REGISTRADA CORRECTAMENTE";
          toastr.success('FICHA REGISTRADA CORRECTAMENTE');
          /*$route.reload();*/
           $timeout(function() {
            $location.path('/inspeccion/categoria/crear/'+data.ficha_inspeccion.fi_id+'/'+et_id);
          },10);

  
        }
      },function () {
        toastr.error("Error inesperado");
      })
    }
    $scope.reset = function(form) {
      $scope.ficha1 = {};
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
    };




/*  $scope.recarga=function(){
    $route.reload();
  }*/

}])

.controller('CrearCateCtrl', ['EstadoIns','$scope','$routeParams','EmpTra','Categoria','FichaCat','Zonas',  '$location', '$timeout', 'toastr','Rubro','Cle','BusSub','BusCat','VerFicha6',
 function (EstadoIns,$scope,$routeParams, EmpTra,Categoria,FichaCat,Zonas,  $location, $timeout, toastr,Rubro,Cle,BusSub,BusCat,VerFicha6){

 $scope.ajustes = {
    //Configuraciones del menu:
    menu:{
      titulo: 'Gestión de Fichas de Inspección',
      items:[
        /*{nombre:'Establecimientos', enlace:'#/establecimientossol', estilo:''},*/
        {nombre:'Propietarios Naturales', enlace:'#/tramites_nat', estilo:''},
        {nombre:'Propietarios Juridicos', enlace:'#/tramites_jur', estilo:''},
        {nombre:'Establecimientos inspeccionados', enlace:'#/lista-inspeccionados', estilo:''},
        {nombre:'Asignar categoria', enlace:'#/inspeccion/categoria/crear', estilo:'active'}]
    },
    //Configuraciones de la página
    pagina:{
      titulo:'Registrar Categoria',
      action: "CREAR"
    }
  }
 var et_id=$routeParams.et_id;
  var fi_id=$routeParams.fi_id;
    var FunG = localStorage.getItem("Funcionario");
  var FunG = JSON.parse(FunG);
  var fun_id = FunG.fun_id;
  console.log("_______llego al controlador asignar________",fi_id)
EmpTra.get({et_id:et_id},function(data){
    $scope.emp_tra=data.establecimiento;

    if ($scope.emp_tra.propietario.pro_tipo=='J') {
      $scope.propietario=$scope.emp_tra.propietario.pjur_razon_social;
    }
    if ($scope.emp_tra.propietario.pro_tipo=='N') {
      $scope.propietario=$scope.emp_tra.propietario.per_nombres+' '+$scope.emp_tra.propietario.per_apellido_primero+' '+$scope.emp_tra.propietario.per_apellido_segundo;   
    }
    $scope.direccion=$scope.emp_tra.establecimiento_sol.ess_avenida_calle+' #'+$scope.emp_tra.establecimiento_sol.ess_numero+' '+$scope.emp_tra.establecimiento_sol.ess_stand
    Rubro.get({emp_id:$scope.emp_tra.empresa.emp_id},function(data){
        $scope.rubro=data.rubro;
    });
  });
$scope.ver=false;
$scope.sancion=false;
Cle.get(function(data){
    $scope.subclacificacion=data.cle;
});

  $scope.buscarS=function(cle_id){
      console.log(cle_id+"<<< cle_ID");
    if (cle_id==17) {
      $scope.sancion=true;
      $scope.ver=false;
       BusCat.get({sub_id:93}, function(data){
          $scope.subcla=data.categoria;
          console.log("ZOnasss",$scope.buscas);
          //Agregando 26/10/17
          
      })
    }
    else{
      $scope.ver=true;
      $scope.sancion=false;
      
    }
BusSub.get({cle_id:cle_id}, function(data){
          $scope.buscas=data.subcla;
          console.log("busca subclasificacion",$scope.buscas);
         
      })
      
  };

  $scope.buscarC=function(sub_id){

      console.log(sub_id+"<<< sub_ID");

      BusCat.get({sub_id:sub_id}, function(data){
          $scope.subcla=data.categoria;
          console.log("ZOnasss",$scope.buscas);
          //Agregando 26/10/17
          
      })

  };




  $scope.CurrentDate=new Date();

  $scope.items = [];
  Categoria.get(function(data){
      $scope.subcla2=data.categoria;
      console.log($scope.subcla);

/*agregar categorias a la empresa*/
    var aux=null;
    
    $scope.agregar = function (sub_id,sub_nombre, item) {

      //console.log("______este es el cat_id____",sub_id);
      if (item){
        $scope.items.push(item);

        for (var i = $scope.subcla.length - 1; i >= 0; i--) {

         // console.log("______antes del segundo if____",$scope.subcla[i].cat_id);
          if($scope.subcla[i].cat_id==sub_id){

            aux=$scope.subcla[i];
            $scope.subcla.splice(i,1);
           console.log("______agregando categoria__-___",aux);
          }
        };
        // console.log('este es el vector reducido', $scope.subcla);
        // console.log('este es el vector de items', $scope.items);
      }
    };

/*quitar rubros en la empresa*/
    $scope.quitar = function (sub_id,item) {
      if (sub_id){
        $scope.subcla.push(item);
        for (var i = $scope.items.length - 1; i >= 0; i--) {
          if($scope.items[i].cat_id==sub_id){
            aux=$scope.items[i];
            $scope.items.splice(i,1);
          }
        };
      }
    };
  });
$scope.checkedI=false;


    $scope.todo1={
      fi_id:fi_id,
      vector:$scope.items
    };


    $scope.todo=JSON.stringify($scope.todo1);
    $scope.CurrentDate = new Date();
    var mes=$scope.CurrentDate.getMonth()+1;
    var fecha=$scope.CurrentDate.getDate()+"-"+mes+"-"+$scope.CurrentDate.getFullYear();
   $scope.pregunta=false;
   VerFicha6.get({fi_id:fi_id}, function(data){
          $scope.suma=data.suma;
         
         
      })
      
  

  $scope.submit = function(){
    console.log('estdo de pregunta', $scope.pregunta);
    if ($scope.pregunta) {
            $scope.datos={
                fun_id:fun_id,
                te_estado:'APROBADO',
                te_observacion:'NINGUNA',
                te_fecha:fecha
            }
            
          }
          else{
             
             $scope.datos={
                fun_id:fun_id,
                te_estado:'OBSERVADO',
                te_observacion:'NO PROCEDE',
                te_fecha:fecha
            }
          }
          console.log('TRAMITE_CER ESTADO____', $scope.datos);
      EstadoIns.update({et_id:et_id}, $scope.datos).$promise.then(function(data)
      {
        console.log("__datos tramitecer__",$scope.datos);
          if(data.status) {
            angular.copy({}, $scope.datos);
          }
         

      })
    console.log('categorias_______', $scope.todo1);
    FichaCat.save($scope.todo1).$promise.then(function(data){
      if(data.status) {
        
          
      angular.copy({}, $scope.todo1);
        $scope.ajustes.pagina.success = "Categoria añadida correctamente";
        toastr.success('Categoria añadida correctamente');
         $timeout(function() {
            $location.path('/tramites_certi');
          },10);
      }
    });
  };

    $scope.submitS = function(){
    console.log('EL OBJETO QUE S VA A CREAR', $scope.todo1);
    FichaCat.save($scope.todo1).$promise.then(function(data){
      if(data.status) {
        angular.copy({}, $scope.todo1);
        $scope.ajustes.pagina.success = "Categoria añadida correctamente";
        toastr.success('Categoria añadida correctamente');
         $timeout(function() {
            $location.path('/');
          },10);
      }
    });
  };

  $scope.reset = function(form) {
    $scope.todo1 = {};
    if (form) {
      //console.log(form);
      form.$setPristine();
      form.$setUntouched();
    }
  };
}])
.controller('VerFichaCtrl', [/*'authUser',*/ '$scope', 'FichaIn','EmpTra', '$routeParams', '$location','Rubro','CONFIG','Categoria','BusCat','CrearFichaCatSan','toastr','VerFcs','Categoria','VerSanciones','$route', 
  function (/*authUser,*/ $scope, FichaIn,EmpTra, $routeParams, $location,Rubro,CONFIG,Categoria,BusCat,CrearFichaCatSan,toastr,VerFcs,Categoria,VerSanciones,$route){
 /* if(authUser.isLoggedIn()){*/
   if(CONFIG.ROL_CURRENT_USER == 1 || CONFIG.ROL_CURRENT_USER == 14 || CONFIG.ROL_CURRENT_USER == 15)
    {
      $scope.ajustes = {
        menu:{
          titulo: 'Gestión de Empresas Solicitantes',
          items:[
            {nombre:'Establecimientos solicitantes', enlace:'#/lista-solicitantes', estilo:''},
           {nombre:'Establecimientos validados', enlace:'#/lista-validacion', estilo:''},
            {nombre:'Establecimientos inspeccionados', enlace:'#/lista-inspeccionados', estilo:''},
            {nombre:'Establecimientos que cancelaron', enlace:'#/lista-cancelaron', estilo:''}]
        },
        pagina:{
          titulo:'Información General del Establecimiento'
        }
      }
    }
    else  if(CONFIG.ROL_CURRENT_USER == 16)
    {
      $scope.ajustes = {
      menu:{
        titulo: 'Gestión de Fichas de Inspección',
        items:[
        {nombre:'Establecimientos validados', enlace:'#/lista-validacion', estilo:''},
           {nombre:'Establecimientos inspeccionados', enlace:'#/lista-inspeccionados', estilo:''}
           ]
      },
      pagina:{
        titulo:'Detalle de ficha de inspeccion'
      }
    }
    }
    
     $scope.user = {
    rol_id: CONFIG.ROL_CURRENT_USER
  }
    $scope.loading=true;
    var fi_id = $routeParams.fi_id;

    /*$scope.rec=function(fc_id,cat_id){

    id=fc_id;

    Categoria.get({cat_id:cat_id}, function(data)
    {
        $scope.categoria = data.categoria;
        $scope.nombre=$scope.categoria.cat_descripcion+' de monto '+$scope.categoria.cat_monto+' Bs';
    });
  };*/

  var sancion =93;
  BusCat.get({sub_id:sancion}, function(data){
      $scope.subcla=data.categoria;
      console.log("sanciones",$scope.subcla); 

  })
  FichaIn.get({fi_id:fi_id}, function(data){
      $scope.ficha_inspeccion = data.ficha_inspeccion;
      console.log("ficha de ins______-",$scope.ficha_inspeccion);
        $scope.loading = false;
      $scope.msg = data.mensaje;
      EmpTra.get({et_id:$scope.ficha_inspeccion.ficha_inspeccion.et_id},function(data){
          $scope.emp_tra=data.establecimiento;

          if ($scope.emp_tra.propietario.pro_tipo=='J') {
            $scope.propietario=$scope.emp_tra.propietario.pjur_razon_social;
          }
          if ($scope.emp_tra.propietario.pro_tipo=='N') {
            $scope.propietario=$scope.emp_tra.propietario.per_nombres+' '+$scope.emp_tra.propietario.per_apellido_primero+' '+$scope.emp_tra.propietario.per_apellido_segundo;   
          }
          $scope.direccion=$scope.emp_tra.establecimiento_sol.ess_avenida_calle+' #'+$scope.emp_tra.establecimiento_sol.ess_numero+' '+$scope.emp_tra.establecimiento_sol.ess_stand
          Rubro.get({emp_id:$scope.emp_tra.empresa.emp_id},function(data){
              $scope.rubro=data.rubro;
          });
      });
 


    
      

    });

   


    /*$scope.ficha_san={
      fc_id:null,
      cat_id:null
    }*/
    $scope.ficha_san={
      fi_id:null,
      cat_id:null
    }

    $scope.submit=function(san){

       //console.log(id,"__esta es la obs__",san);
 
    $scope.ficha_san.fi_id=fi_id;
    $scope.ficha_san.cat_id=san;
    
    CrearFichaCatSan.save($scope.ficha_san).$promise.then(function(data)
    {
      console.log("entra a save");
      if(data.status)
      {
          console.log("lo logro...",data);
          toastr.success('Sancion registrada correctamente');
          $route.reload();
        
      }

    });
    
  };
$scope.ver=false;
 VerSanciones.get({fi_id:fi_id}, function(data){
      $scope.fichasancion=data.fichasancion;
      console.log("san asig__________",$scope.fichasancion); 
      if ($scope.fichasancion!=null) {
        $scope.ver=true;
      }

  })
  /*} else {
    $location.path('/inicio');
  }*/
}])
.controller('SancionesCtrl', ['$scope', 'VerFcs','$routeParams',   function($scope, VerFcs,$routeParams)
{
  var nom=$routeParams.nom;
  var fc_id=$routeParams.fc_id;
  $scope.ajustes = {
    menu:{
      titulo: 'Lista de Sanciones',
      items:[ 
        {nombre:'Sanciones', enlace:'#/sancion/ver/'+fc_id+'/'+nom},
        {nombre:'Establecimientos inspeccionados', enlace:'#/lista-inspeccionados', estilo:''}
        ]
        },
    pagina:{
      titulo:'Sancion de: '+nom
      
    }
  }
   $scope.sortType = 'created_at'; // ESTABLECIENDO EL TIPO DE ORDENAMIENTO
  $scope.sortReverse  = true;  // PARA ORDENAR ASCENDENTEMENTO O DESCENDENTEMENTE
  $scope.loading=true;//PARA HACER UN LOADING EN EL TEMPLATE


var fc_id=$routeParams.fc_id;

  VerFcs.get({fc_id:fc_id},function(data)
  {
    $scope.ficha_cat_san = data.ficha_cat_san;
   
    //PARA HACER UN LOADING EN EL TEMPLATE
    if(data.status){
      $scope.loading = false;
      $scope.msg = data.status;
    }
  })

}])
.controller('InspeccionesCtrl', ['$scope', 'FichasInsEt','$routeParams','CONFIG',   function($scope, FichasInsEt,$routeParams,CONFIG)
{
  var et_id=$routeParams.et_id;
    $scope.user = {
    rol_id: CONFIG.ROL_CURRENT_USER
  }
  if ($scope.user.rol_id == 16) {
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Fichas de inspección',
      items:[ 
          {nombre:'Inspecciones', enlace:'#/inspecciones/'+et_id, estilo:'active'},
          {nombre:'Establecimientos inspeccionados', enlace:'#/lista-inspeccionados', estilo:''}
        
        ]
    },
    pagina:{
      titulo:'Gestión de Inspecciones'
    }
  }
  } else if ($scope.user.rol_id == 14) {
    $scope.ajustes = {
      menu:{
        titulo: 'Gestión de Certificado Sanitario',
        items:[ 
          {nombre:'Inspecciones', enlace:'#/inspecciones/'+et_id, estilo:'active'},
          {nombre:'Establecimientos validados', enlace:'#/lista-validacion', estilo:''},
          {nombre:'Establecimientos inspeccionados', enlace:'#/lista-inspeccionados', estilo:''},
          {nombre:'Establecimientos que cancelaron', enlace:'#/lista-cancelaron', estilo:''}
          
          ]
      },
      pagina:{
        titulo:'Gestión de Inspecciones'
      }
    }
  }
   else {
    $scope.ajustes = {
    menu:{
      titulo: 'Lista de Fichas de inspección',
      items:[ 
      {nombre:'Establecimientos inspeccionados', enlace:'#/lista-inspeccionados', estilo:''},
        {nombre:'Fichas de inspección', enlace:'#/inspecciones/'+et_id, estilo:'active'}
        ]
    },
    pagina:{
      titulo:'Gestión de Inspecciones'
    }

  }
}
  $scope.sortType = 'created_at'; // ESTABLECIENDO EL TIPO DE ORDENAMIENTO
  $scope.sortReverse  = true;  // PARA ORDENAR ASCENDENTEMENTO O DESCENDENTEMENTE
  $scope.loading=true;//PARA HACER UN LOADING EN EL TEMPLATE

  FichasInsEt.get({et_id:et_id},function(data)
  {
    $scope.ficha_inspeccion = data.ficha_inspeccion;

    //PARA HACER UN LOADING EN EL TEMPLATE
    if(data.status){
      $scope.loading = false;
      $scope.msg = data.status;
      angular.forEach($scope.ficha_inspeccion, function(value, key){
            console.log( 'fecha:',value.created_at);
            value.created_at=moment(value.created_at,"YYYY-MM-DD").format("DD-MM-YYYY");
         });
    }
  })

}])
//lista de fichas de inspeccion propietarios juridicos
.controller('InspeccionesJCtrl', ['$scope', 'FichasInsEtJ','$routeParams','CONFIG',   function($scope, FichasInsEtJ,$routeParams,CONFIG)
{
  var et_id=$routeParams.et_id;
    $scope.user = {
    rol_id: CONFIG.ROL_CURRENT_USER
  }
  if ($scope.user.rol_id == 16) {
  $scope.ajustes = {
    menu:{
      titulo: 'Lista de Fichas de inspección',
      items:[ 
        {nombre:'Establecimientos validados', enlace:'#/lista-validacion', estilo:''},
        {nombre:'Establecimientos inspeccionados', enlace:'#/lista-inspeccionados', estilo:''},
        {nombre:'Inspecciones', enlace:'#/inspecciones/'+et_id, estilo:'active'}
        ]
    },
    pagina:{
      titulo:'Gestión de Inspecciones'
    }
  }
  }else if ($scope.user.rol_id == 14) {
    $scope.ajustes = {
      menu:{
        titulo: 'Gestión de Certificado Sanitario',
        items:[ 
          {nombre:'Inspecciones', enlace:'#/inspecciones/'+et_id, estilo:'active'},
          {nombre:'Establecimientos validados', enlace:'#/lista-validacion', estilo:''},
          {nombre:'Establecimientos inspeccionados', enlace:'#/lista-inspeccionados', estilo:''},
          {nombre:'Establecimientos que cancelaron', enlace:'#/lista-cancelaron', estilo:''}
          
          ]
      },
      pagina:{
        titulo:'Gestión de Inspecciones'
      }
    }
  }
   else {
    $scope.ajustes = {
    menu:{
      titulo: 'Lista de Fichas de inspección',
      items:[ 
        {nombre:'Establecimientos inspeccionados', enlace:'#/lista-inspeccionados', estilo:'active'},
        {nombre:'Fichas de inspección', enlace:'#/inspeccionesJ/'+et_id, estilo:'active'}
        ]
    },
    pagina:{
      titulo:'Gestión de Inspecciones'
    }

  }
}
  $scope.sortType = 'created_at'; // ESTABLECIENDO EL TIPO DE ORDENAMIENTO
  $scope.sortReverse  = true;  // PARA ORDENAR ASCENDENTEMENTO O DESCENDENTEMENTE
  $scope.loading=true;//PARA HACER UN LOADING EN EL TEMPLATE

  FichasInsEtJ.get({et_id:et_id},function(data)
  {
    $scope.ficha_inspeccion = data.ficha_inspeccionJ;
   
    //PARA HACER UN LOADING EN EL TEMPLATE
    if(data.status){
      angular.forEach($scope.ficha_inspeccion, function(value, key){
            console.log( 'fecha:',value.created_at);
            value.created_at=moment(value.created_at,"YYYY-MM-DD").format("DD-MM-YYYY");
         });
      $scope.loading = false;
      $scope.msg = data.status;
    }
  })

}])

.controller('CreaCtrl', ['$http','CONFIG','$scope','Ficha3', '$route', 'toastr','EmpTra','Funcionarios','$routeParams','$timeout','$location', function ($http,CONFIG,$scope,Ficha3, $route, toastr,EmpTra,Funcionarios,$routeParams,$timeout,$location){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Fichas de Inspección',
      items:[
        {nombre:'Crear Ficha', enlace:'#/numero-ficha/crear', estilo:'active'}]
    },
    pagina:{
      titulo:'Formulario Inspección'
    }
  }
  var et_id=$routeParams.et_id;
  $scope.CurrentDate = new Date();
  var mes=$scope.CurrentDate.getMonth()+1;
  //var mess=mes+1;
  var fecha=$scope.CurrentDate.getDate()+"-"+mes+"-"+$scope.CurrentDate.getFullYear();

  var FunG = localStorage.getItem("Funcionario");
  var FunG = JSON.parse(FunG);
  var fun_id = FunG.fun_id;
  console.log("__HORA__",fecha);


  $scope.propietario='';

  EmpTra.get({et_id:et_id},function(data){
    $scope.emp_tra=data.establecimiento;
  console.log("__aaaaaaa_", $scope.emp_tra);
    if ($scope.emp_tra.propietario.pro_tipo=='J') {
      $scope.propietario=$scope.emp_tra.propietario.pjur_razon_social;
    }
    if ($scope.emp_tra.propietario.pro_tipo=='N') {
      $scope.propietario=$scope.emp_tra.propietario.per_nombres+' '+$scope.emp_tra.propietario.per_apellido_primero+' '+$scope.emp_tra.propietario.per_apellido_segundo;   
    }
    $scope.direccion=$scope.emp_tra.establecimiento_sol.ess_avenida_calle+' #'+$scope.emp_tra.establecimiento_sol.ess_numero+' '+$scope.emp_tra.establecimiento_sol.ess_stand
   
  });
 Funcionarios.get({fun_id:fun_id},function(data){
    $scope.funcionarios=data.funcionario;
    $scope.nombre=$scope.funcionarios.persona.per_nombres+' '+$scope.funcionarios.persona.per_apellido_primero+' '+$scope.funcionarios.persona.per_apellido_segundo;

  });
  $scope.patternCadena = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$/;
    $scope.patternCadenaNumero = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ 0-9.]*$/;
 
 

}])



.controller('CrearFicha1Ctrl', ['$http','CONFIG','$scope','Ficha1', '$route', 'toastr','EmpTra','$routeParams','$timeout','$location', function ($http,CONFIG,$scope,Ficha1, $route, toastr,EmpTra,$routeParams,$timeout,$location){
/*  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Fichas de Inspección',
      items:[
        {nombre:'Crear Ficha', enlace:'#/numero-ficha/crear', estilo:'active'}]
    },
    pagina:{
      titulo:'Crear Ficha'
    }
  }
var et_id=1;*/
 var et_id=$routeParams.et_id;
 $scope.CurrentDate = new Date();
 var mes=$scope.CurrentDate.getMonth()+1;
 var fecha=$scope.CurrentDate.getDate()+"-"+mes+"-"+$scope.CurrentDate.getFullYear();

  var FunG = localStorage.getItem("Funcionario");
  var FunG = JSON.parse(FunG);
  var fun_id = FunG.fun_id;
/*  console.log("__HORA__",fecha);*/
$scope.checked=true;
/*
  $scope.propietario='';

  EmpTra.get({et_id:et_id},function(data){
    $scope.emp_tra=data.establecimiento;

    if (Object.keys($scope.emp_tra.propietario).length==7) {
      $scope.propietario=$scope.emp_tra.propietario.pjur_razon_social;
    }
    if (Object.keys($scope.emp_tra.propietario).length==22) {
      $scope.propietario=$scope.emp_tra.propietario.per_nombres+' '+$scope.emp_tra.propietario.per_apellido_primero+' '+$scope.emp_tra.propietario.per_apellido_segundo;
    }
    $scope.direccion=$scope.emp_tra.establecimiento_sol.ess_avenida_calle+' #'+$scope.emp_tra.establecimiento_sol.ess_numero+' '+$scope.emp_tra.establecimiento_sol.ess_stand
   
  });*/

  $scope.ficha1 = {

      et_id :null,
      fun_id :null,
      cat_id :null,
      fi_fecha_asignacion:fecha,
      fi_fecha_realizacion:fecha,
      fi_observacion:'',
      fi_estado:'',
      fi_foco_insalubridad:false,
      fi_exibe_certificado:false,
      fi_exibe_carne:false,
      fi_extinguidor:'',
      fi_botiquin:'',
      fi1_fecha_realizacion :fecha,
      fi1_observacion:'',
      fi1_estado :'',
      fi1_foco_insalubridad :false,
      fi1_exibe_certificado :false,
      fi1_exibe_carnes :false,
      fi1_infraestructura :'',
      fi1_servicios_higienicos :0,
      fi1_otros_servicios :0,
      fi1_inodoro :0,
      fi1_jaboncillo :0,
      fi1_lavamanos_porcelana :0,
      fi1_toallas :0,
      fi1_duchas :0,
      fi1_detalle_equipo :'',
      fi1_detalle_utencilios :'',
      fi1_otros :'',
      fi1_recomendaciones :'',
      fi1_aseo_personal:'',
      fi1_residuos_solidos :'',
      fi1_abastecimiento_agua :'',
      fi1_control_insectos_roedores :'',
      fi1_residuos_liquidos :'',
      fi1_distribucion_dependencias :'',
      fi1_conservacion_productos_materia_prima :''
    
    };

    $scope.patternCadena = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$/;
    $scope.patternCadenaNumero = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ 0-9.]*$/;
    
    $scope.submit = function(b)
    {
        $scope.ficha1.fun_id=fun_id;
        $scope.ficha1.et_id=et_id;
        $scope.ficha1.fi_estado='INSPECCIONADO';
        $scope.ficha1.fi1_estado='INSPECCIONADO';
        $scope.ficha1.fi_exibe_certificado=$scope.ficha1.fi1_exibe_certificado;
        $scope.ficha1.fi_exibe_carne=$scope.ficha1.fi1_exibe_carnes;
        $scope.ficha1.fi_foco_insalubridad=$scope.ficha1.fi1_foco_insalubridad; 
        $scope.ficha1.fi_fecha_realizacion= fecha;
        $scope.ficha1.fi1_fecha_realizacion=fecha;
        $scope.ficha1.fi_observacion=$scope.ficha1.fi1_observacion;
        console.log("_______GURDANDO_______",$scope.ficha1);

        Ficha1.save($scope.ficha1).$promise.then(function(data)
        {
          console.log("------GUARDADO.---------",data);
          if(data.msg)
          {
            console.log("data",data);
            angular.copy({}, $scope.ficha1);
            $scope.ajustes.pagina.success = "FICHA REGISTRADA CORRECTAMENTE";
            toastr.success('FICHA REGISTRADA CORRECTAMENTE');
            /*$route.reload();*/
            $timeout(function() {
              $location.path('/inspeccion/categoria/crear/'+data.ficha1_inspeccion.ficha_inspeccion.fi_id+'/'+et_id);
            },10);
          }
        },function () {
          toastr.error("Error inesperado");
        })
    }
    $scope.reset = function(form) {
      $scope.ficha1 = {};
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
    };

/*  $scope.recarga=function(){
    $route.reload();
  }*/

}])

.controller('CrearFicha2Ctrl', ['$http','CONFIG','$scope','Ficha2', '$route', 'toastr','EmpTra','$routeParams','$timeout','$location', function ($http,CONFIG,$scope,Ficha2, $route, toastr,EmpTra,$routeParams,$timeout,$location){
/*  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Fichas de Inspección',
      items:[
        {nombre:'Crear Ficha', enlace:'#/numero-ficha/crear', estilo:'active'}]
    },
    pagina:{
      titulo:'Crear Ficha'
    }
  }
  var et_id=$routeParams;*/
   var et_id=$routeParams.et_id;
 $scope.CurrentDate = new Date();
var mes=$scope.CurrentDate.getMonth()+1;
 //var mess=mes+1;
 
 var fecha=$scope.CurrentDate.getDate()+"-"+mes+"-"+$scope.CurrentDate.getFullYear();

 var FunG = localStorage.getItem("Funcionario");
  var FunG = JSON.parse(FunG);
  var fun_id = FunG.fun_id;
 /*   console.log("__HORA__",fecha);


  $scope.propietario='';

  EmpTra.get({et_id:et_id},function(data){
    $scope.emp_tra=data.establecimiento;

    if (Object.keys($scope.emp_tra.propietario).length==7) {
      $scope.propietario=$scope.emp_tra.propietario.pjur_razon_social;
    }
    if (Object.keys($scope.emp_tra.propietario).length==22) {
      $scope.propietario=$scope.emp_tra.propietario.per_nombres+' '+$scope.emp_tra.propietario.per_apellido_primero+' '+$scope.emp_tra.propietario.per_apellido_segundo;
    }
    $scope.direccion=$scope.emp_tra.establecimiento_sol.ess_avenida_calle+' #'+$scope.emp_tra.establecimiento_sol.ess_numero+' '+$scope.emp_tra.establecimiento_sol.ess_stand
   
  });*/

  $scope.ficha2 = {

      et_id :null,
      fun_id :null,
      cat_id :null,
      fi_fecha_asignacion:fecha,
      fi_fecha_realizacion:fecha,
      fi_observacion:'',
      fi_estado:'',
      fi_foco_insalubridad:false,
      fi_exibe_certificado:false,
      fi_exibe_carne:false,
      fi_extinguidor:'',
      fi_botiquin:'',
    
      fi2_fecha_realizacion :fecha ,
      fi2_cama :'' ,
      fi2_nro_habitaciones :0 ,
      fi2_nro_almacenes : 0,
      fi2_nro_salones : 0,
      fi2_salones_bueno :0 ,
      fi2_salones_regular :0 ,
      fi2_piscina_o_sauna : 0,
      fi2_piscina_regular : 0,
      fi2_piscina_bueno :0 ,
      fi2_nro_cocina :0 ,
      fi2_nro_cocinas_apart_hotel :0 ,
      fi2_total_gambusas : 0,
      fi2_recepcion : '',
      fi2_nro_restautant :0 ,
      fi2_aire_acondicionado :'' ,
      fi2_agua_caliente : '',
      fi2_calefaccion :'' ,
      fi2_frigobar: '',
      fi2_room_service :'' ,
      fi2_telefono_hab : '',
      fi2_tv : '',
      fi2_cubrecolchones :'' ,
      fi2_mesa : '',
      fi2_tocador :'' ,
      fi2_lampara :'' ,
      fi2_sillones :'' ,
      fi2_espejo : '',
      fi2_cesto_basura :'' ,
      fi2_portamaletas :'' ,
      fi2_ropero :'' ,
      fi2_lavanderia :'' ,
      fi2_cortina :'' ,
      fi2_pisos_bano :'' ,
      fi2_azulejos :'' ,
      fi2_depiso :'' ,
      fi2_inodoro :'' ,
      fi2_lavamanos:'' ,
      fi2_porta_papel :'' ,
      fi2_basura_bano : '',
      fi2_ducha :'' ,
      fi2_pieducha :'' ,
      fi2_colgador :'' ,
      fi2_sala_maquina :'' ,
      fi2_refrigeracion :'' ,
      fi2_grasas :'' ,
      fi2_iluminacion :'' ,
      fi2_mantenimieno :'' ,
      fi2_depositos :'' ,
      fi2_area_lavado_planchado :'' ,
      fi2_extinguidor : '',
      fi2_vectores : '',
      fi2_observacion :'' ,
      fi2_estado :'' 
    
    };

    $scope.patternCadena = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$/;
    $scope.patternCadenaNumero = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ 0-9.]*$/;
    
    $scope.submitf2 = function(b)
    {
      console.log("__________entor__________");
        $scope.ficha2.fun_id=fun_id;
        $scope.ficha2.et_id=et_id;
        $scope.ficha2.fi_estado='INSPECCIONADO';
       /* $scope.ficha2.fi1_estado='INSPECCIONADO';*/
     /*   $scope.ficha2.fi_exibe_certificado=$scope.ficha2.fi2_exibe_certificado;*/ 
     if ($scope.ficha2.fi2_exibe_carnes!=null) {
      $scope.ficha2.fi_exibe_carne=true;
     }
     if ($scope.ficha2.fi2_exibe_certificado!=null) {
      $scope.ficha2.fi_exibe_certificado=true;
     } 
        
        $scope.ficha2.fi_foco_insalubridad=$scope.ficha2.fi2_foco_insalubridad;
        $scope.ficha2.fi_fecha_realizacion= fecha;
        $scope.ficha2.fi2_fecha_realizacion=fecha;
        $scope.ficha2.fi_observacion=$scope.ficha2.fi2_observacion;


     console.log("_______GURDANDO_______",$scope.ficha1);
    
      Ficha2.save($scope.ficha2).$promise.then(function(data)
      {
        console.log("------GUARDADO.---------",data);
        if(data.msg)
        {
          console.log("data",data);
          angular.copy({}, $scope.ficha2);
          $scope.ajustes.pagina.success = "FICHA REGISTRADA CORRECTAMENTE";
          toastr.success('FICHA REGISTRADA CORRECTAMENTE');
         $timeout(function() {
              $location.path('/inspeccion/categoria/crear/'+data.ficha2_inspeccion.ficha_inspeccion.fi_id+'/'+et_id);
            },10);
        }
      },function () {
        toastr.error("Error inesperado");
      })
    }
    $scope.reset = function(form) {
      $scope.ficha2 = {};
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
    };
//1 true



/*  $scope.recarga=function(){
    $route.reload();
  }*/

}])


.controller('CrearFicha3Ctrl', ['$http','CONFIG','$scope','Ficha3', '$route', 'toastr','EmpTra','Funcionarios','$routeParams','$timeout','$location', function ($http,CONFIG,$scope,Ficha3, $route, toastr,EmpTra,Funcionarios,$routeParams,$timeout,$location){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Fichas de Inspección',
      items:[
        {nombre:'Crear Ficha', enlace:'#/numero-ficha/crear', estilo:'active'}]
    },
    pagina:{
      titulo:'Formulario Inspección'
    }
  }
  var et_id=$routeParams.et_id;
  $scope.CurrentDate = new Date();
  var mes=$scope.CurrentDate.getMonth()+1;
  //var mess=mes+1;
  var fecha=$scope.CurrentDate.getDate()+"-"+mes+"-"+$scope.CurrentDate.getFullYear();

  var FunG = localStorage.getItem("Funcionario");
  var FunG = JSON.parse(FunG);
  var fun_id = FunG.fun_id;
  console.log("__HORA__",fecha);

/* 
  $scope.propietario='';

 EmpTra.get({et_id:et_id},function(data){
    $scope.emp_tra=data.establecimiento;

    if (Object.keys($scope.emp_tra.propietario).length==7) {
      $scope.propietario=$scope.emp_tra.propietario.pjur_razon_social;
    }
    if (Object.keys($scope.emp_tra.propietario).length==22) {
      $scope.propietario=$scope.emp_tra.propietario.per_nombres+' '+$scope.emp_tra.propietario.per_apellido_primero+' '+$scope.emp_tra.propietario.per_apellido_segundo;
    }
    $scope.direccion=$scope.emp_tra.establecimiento_sol.ess_avenida_calle+' #'+$scope.emp_tra.establecimiento_sol.ess_numero+' '+$scope.emp_tra.establecimiento_sol.ess_stand
   
  });
    Funcionarios.get({fun_id:fun_id},function(data){
    $scope.funcionarios=data.funcionario;
    $scope.nombre=$scope.funcionarios.persona.per_nombres+' '+$scope.funcionarios.persona.per_apellido_primero+' '+$scope.funcionarios.persona.per_apellido_segundo;

  });*/

  $scope.ficha3 = {

        et_id :null,
        fun_id :null,
        cat_id :null,
        fi_fecha_asignacion:fecha,
        fi_fecha_realizacion:fecha,
        fi_observacion:'',
        fi_estado:'',
        fi_foco_insalubridad:false,
        fi_exibe_certificado:false,
        fi_exibe_carne:false,
        fi_extinguidor:'',
        fi_botiquin:'',
        
        fi3_superficie_util :'' ,
        fi3_muros_pintados :'' ,
        fi3_muros_pintados_obs :'' ,
        fi3_zocalos :'' ,
        fi3_zocalos_obs :'' ,
        fi3_piso :'' ,
        fi3_piso_obs :'' ,
        fi3_sumidero_desague :'' ,
        fi3_sumidero_desague_obs :'' ,
        fi3_cielo_raso :'' ,
        fi3_cielo_raso_obs :'' ,
        fi3_ventilacion_inyeccion :false ,
        fi3_ventilacion_extraccion :false ,
        fi3_ventilacion_electrica :false ,
        fi3_ventilacion_eolico :false ,
        fi3_abastecimiento_agua :'' ,
        fi3_abastecimiento_agua_obs :'' ,
        fi3_eliminacion_agua :'' ,
        fi3_eliminacion_agua_obs :'' ,
        fi3_agua_piso :'' ,
        fi3_agua_piso_obs :'' ,
        fi3_serv_higienicos :'' ,
        fi3_serv_higienicos_obs :'' ,
        fi3_disp_desperdicios :'' ,
        fi3_disp_desperdicios_obs :'' ,
        fi3_roedores_insectos :'' ,
        fi3_roedores_insectos_obs :'' ,
        fi3_establecimiento :'' ,
        fi3_establecimiento_obs :'' ,
        fi3_paredes_pisos :'' ,
        fi3_paredes_pisos_obs :'' ,
        fi3_menaje :'' ,
        fi3_menaje_obs :'' ,
        fi3_personal :'' ,
        fi3_personal_obs :'' ,
        fi3_ropa :'' ,
        fi3_ropa_obs :'' ,
        fi3_detergente :'' ,
        fi3_detergente_obs :'' ,
        fi3_man_alimento :'' ,
        fi3_man_alimento_obs :'' ,
        fi3_con_alimento :'' ,
        fi3_con_alimento_obs :'' ,
        fi3_producto_registro :'' ,
        fi3_producto_registro_obs :'' ,
        fi3_almacenamiento :'' ,
        fi3_almacenamiento_obs :'' ,
        fi3_observacion :'',
        fi3_foco_insalubridad_obs :'' ,
        fi3_comunicacion :'' ,
        fi3_comunicacion_obs : '',
        fi3_superficie_obs : '',
        fi3_iluminacion :'' ,
        fi3_iluminacion_obs : '',
        fi3_almacenes :'' ,
        fi3_almacenes_obs :'' ,
        fi3_fumigacion : ''
    };

    $scope.patternCadena = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$/;
    $scope.patternCadenaNumero = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ 0-9.]*$/;
    
    $scope.submit = function(b)
    {
        $scope.ficha3.fun_id=fun_id;
        $scope.ficha3.et_id=et_id;
        $scope.ficha3.fi_estado='INSPECCIONADO';

        /* if ($scope.ficha2.fi2_exibe_carnes!=null) {
          $scope.ficha2.fi_exibe_carne=true;
         }
         if ($scope.ficha2.fi2_exibe_certificado!=null) {
          $scope.ficha2.fi_exibe_certificado=true;
         } */
        
        $scope.ficha3.fi_foco_insalubridad=$scope.ficha3.fi3_foco_insalubridad;
        $scope.ficha3.fi_fecha_realizacion= fecha;
        $scope.ficha3.fi3_fecha_realizacion=fecha;
        $scope.ficha3.fi_observacion=$scope.ficha3.fi3_observacion;
    
      Ficha3.save($scope.ficha3).$promise.then(function(data)
      {
        console.log("------GUARDADO.---------",data);
        if(data.msg)
        {
          console.log("data",data);
          angular.copy({}, $scope.ficha1);
          $scope.ajustes.pagina.success = "FICHA REGISTRADA CORRECTAMENTE";
          toastr.success('FICHA REGISTRADA CORRECTAMENTE');
          /*$route.reload();*/
           $timeout(function() {
            $location.path('/inspeccion/categoria/crear/'+data.ficha3_inspeccion.ficha_inspeccion.fi_id+'/'+et_id);
          },10);
        }
      },function () {
        toastr.error("Error inesperado");
      })
    }
    $scope.reset = function(form) {
      $scope.ficha2 = {};
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
    };

}])

.controller('CrearFicha6Ctrl', ['$http','CONFIG','$scope','Ficha6', '$route', 'toastr','EmpTra','Funcionarios','$routeParams','$timeout','$location', function ($http,CONFIG,$scope,Ficha6, $route, toastr,EmpTra,Funcionarios,$routeParams,$timeout,$location){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Fichas de Inspección',
      items:[
        {nombre:'Crear Ficha', enlace:'#/numero-ficha/crear', estilo:'active'}]
    },
    pagina:{
      titulo:'Formulario Inspección'
    }
  }
  var et_id=$routeParams.et_id;
  $scope.CurrentDate = new Date();
  var mes=$scope.CurrentDate.getMonth()+1;
  //var mess=mes+1;
  var fecha=$scope.CurrentDate.getDate()+"-"+mes+"-"+$scope.CurrentDate.getFullYear();

  var FunG = localStorage.getItem("Funcionario");
  var FunG = JSON.parse(FunG);
  var fun_id = FunG.fun_id;
  console.log("__HORA__",fecha);

/*
  $scope.propietario='';

  EmpTra.get({et_id:et_id},function(data){
    $scope.emp_tra=data.establecimiento;

    if (Object.keys($scope.emp_tra.propietario).length==7) {
      $scope.propietario=$scope.emp_tra.propietario.pjur_razon_social;
    }
    if (Object.keys($scope.emp_tra.propietario).length==22) {
      $scope.propietario=$scope.emp_tra.propietario.per_nombres+' '+$scope.emp_tra.propietario.per_apellido_primero+' '+$scope.emp_tra.propietario.per_apellido_segundo;
    }
    $scope.direccion=$scope.emp_tra.establecimiento_sol.ess_avenida_calle+' #'+$scope.emp_tra.establecimiento_sol.ess_numero+' '+$scope.emp_tra.establecimiento_sol.ess_stand
   
  });
  Funcionarios.get({fun_id:fun_id},function(data){
    $scope.funcionarios=data.funcionario;
    $scope.nombre=$scope.funcionarios.persona.per_nombres+' '+$scope.funcionarios.persona.per_apellido_primero+' '+$scope.funcionarios.persona.per_apellido_segundo;
  });*/

  $scope.ficha6 = {

        et_id :null,
        fun_id :null,
        cat_id :null,
        fi_fecha_asignacion:fecha,
        fi_fecha_realizacion:fecha,
        fi_observacion:'',
        fi_estado:'',
        fi_foco_insalubridad:false,
        fi_exibe_certificado:false,
        fi_exibe_carne:false,
        fi_extinguidor:'',
        fi_botiquin:'',
        
        fi6_ubicacion:null ,
        fi6_exibicion_certificado:null ,
        fi6_capacidad_dependencias:null ,
        fi6_piso:null ,
        fi6_cielo_raso:null ,
        fi6_muralla:null ,
        fi6_puerta_ventana:null ,
        fi6_ventilacion:null ,
        fi6_iluminacion:null ,
        fi6_abastecimiento_agua:null ,
        fi6_purificacion_agua:null ,
        fi6_eliminacion_agua:null ,
        fi6_servicios_higienicos:null ,
        fi6_facilidad_aseo:null ,
        fi6_guardaropa:null ,
        fi6_eliminacion_basura:null ,
        fi6_aseo_dependencias:null ,
        fi6_maquinaria_artefactos:null ,
        fi6_fitros:null ,
        fi6_transfugadora:null ,
        fi6_lavado_envases:null ,
        fi6_desinfeccion_envases:null ,
        fi6_materia_prima:null ,
        fi6_eliminacion_productos:null ,
        fi6_proteccion_contaminacion:null ,
        fi6_deposito:null ,
        fi6_manipulador_salud:null ,
        fi6_manipulador_aseo:null ,
        fi6_manipulador_habitos:null ,
        fi6_manipulador_carne:null ,
        fi6_overoles:null ,
        fi6_botiquin:null ,
        fi6_extinguidor:null ,
        fi6_control_vectores:'' ,
        fi6_observaciones:'',
        fi6_hombres:0,
        fi6_mujeres:0
    };

    $scope.patternCadena = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$/;
    $scope.patternCadenaNumero = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ 0-9.]*$/;
    
    $scope.submit = function(b)
    {
        $scope.ficha6.fun_id=fun_id;
        $scope.ficha6.et_id=et_id;
        $scope.ficha6.fi_estado='INSPECCIONADO';

        /* if ($scope.ficha2.fi2_exibe_carnes!=null) {
          $scope.ficha2.fi_exibe_carne=true;
         }
         if ($scope.ficha2.fi2_exibe_certificado!=null) {
          $scope.ficha2.fi_exibe_certificado=true;
         } */
        
        $scope.ficha6.fi_foco_insalubridad=$scope.ficha6.fi6_foco_insalubridad;
        $scope.ficha6.fi_fecha_realizacion= fecha;
        $scope.ficha6.fi6_fecha_realizacion=fecha;
        $scope.ficha6.fi_observacion=$scope.ficha6.fi6_observacion;
    
      Ficha6.save($scope.ficha6).$promise.then(function(data)
      {
        console.log("------GUARDADO.---------",data);
        if(data.msg)
        {
          console.log("data",data);
          angular.copy({}, $scope.ficha1);
          $scope.ajustes.pagina.success = "FICHA REGISTRADA CORRECTAMENTE";
          toastr.success('FICHA REGISTRADA CORRECTAMENTE');
          /*$route.reload();*/
           $timeout(function() {
            $location.path('/inspeccion/categoria/crear/'+data.ficha6_inspeccion.ficha_inspeccion.fi_id+'/'+et_id);
          },10);
        }
      },function () {
        toastr.error("Error inesperado");
      })
    }
    $scope.reset = function(form) {
      $scope.ficha2 = {};
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
    };

}])




// VERONIC   -- FICHAS SAUNA Y HORNO

.controller('CrearFichaHornoCtrl', ['$http','CONFIG','$scope','Ficha4', '$route', 'toastr','EmpTra','Funcionarios','$routeParams','$timeout','$location',
function ($http,CONFIG,$scope,Ficha4, $route, toastr,EmpTra,Funcionarios,$routeParams,$timeout,$location){
 
   var et_id=$routeParams.et_id;
  $scope.CurrentDate = new Date();
  var mes=$scope.CurrentDate.getMonth()+1;
  //var mess=mes+1;
  var fecha=$scope.CurrentDate.getDate()+"-"+mes+"-"+$scope.CurrentDate.getFullYear();

  var FunG = localStorage.getItem("Funcionario");
  var FunG = JSON.parse(FunG);
  var fun_id = FunG.fun_id;
  console.log("__HORA__",fecha);

  $scope.ficha4 = {

        et_id :null,
        fun_id :null,
        cat_id :null,
        
        fi_observacion:'',
        fi_estado:'',
        fi_foco_insalubridad:false,
        fi_exibe_certificado:false,
        fi_exibe_carne:false,
        fi_extinguidor:'',
        fi_botiquin:1,
        
        fi4_ubicacion :null,
        fi4_certificado :null,
        fi4_dependencias :null,
        fi4_pisos :null,
        fi4_cielo :null,
        fi4_murallas :null,
        fi4_muralla_altura:null,
        fi4_muralla_puntaje:null,
        fi4_puerta_ventana :null,
        fi4_iluminacion :null,
        fi4_ventilacion :null,
        fi4_abastecimiento :null,
        fi4_servicio_higienico :null,
        fi4_lavamanos :null,
        fi4_jabocillo :null,
        fi4_ducha :null,
        fi4_desagues :null,
        fi4_desgrasadores :null,
        fi4_basurero :null,
        fi4_insectos :null,
        fi4_roedores :null,
        fi4_artezas :null,
        fi4_enfriadores :null,
        fi4_clavijeras :null,
        fi4_mesones :null,
        fi4_maquinarias :null,
        fi4_lavado_envases :null,
        fi4_depositos :null,
        fi4_heridas :null,
        fi4_dinero :null,
        fi4_botiquin_extinguidor :null,
        fi4__recomendaciones:"",
        fi4_estado :"",
        fi4_total :null
    };

    $scope.patternCadena = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$/;
    $scope.patternCadenaNumero = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ 0-9.]*$/;
    
    $scope.submit = function()
    {
        $scope.ficha4.fun_id=fun_id;
        $scope.ficha4.et_id=et_id;
        $scope.ficha4.fi_estado='INSPECCIONADO';
        
        
        $scope.ficha4.fi_fecha_realizacion= fecha;
        $scope.ficha4.fi4_fecha_realizacion=fecha;        
    
        console.log('Lo que va a guarfar', $scope.ficha4);
      Ficha4.save($scope.ficha4).$promise.then(function(data)
      {
        console.log("------GUARDADO.---------",data);
        if(data.msg)
        {
          console.log("data",data);
          $scope.ajustes.pagina.success = "FICHA REGISTRADA CORRECTAMENTE";
          toastr.success('FICHA REGISTRADA CORRECTAMENTE');
           $timeout(function() {
            $location.path('/inspeccion/categoria/crear/'+data.ficha4_inspeccion.ficha_inspeccion.fi_id+'/'+et_id);
          },10);
        }
      },function () {
        toastr.error("Error inesperado");
      })
    }
    $scope.reset = function(form) {
      $scope.ficha2 = {};
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
    };

}])




.controller('CrearFichaSaunaCtrl', ['$http','CONFIG','$scope','Ficha6', '$route', 'toastr','EmpTra','Funcionarios','$routeParams','$timeout','$location', function ($http,CONFIG,$scope,Ficha6, $route, toastr,EmpTra,Funcionarios,$routeParams,$timeout,$location){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Fichas de Inspección',
      items:[
        {nombre:'Crear Ficha', enlace:'#/numero-ficha/crear', estilo:'active'}]
    },
    pagina:{
      titulo:'Formulario Inspección'
    }
  }
  var et_id=$routeParams.et_id;
  $scope.CurrentDate = new Date();
  var mes=$scope.CurrentDate.getMonth()+1;
  //var mess=mes+1;
  var fecha=$scope.CurrentDate.getDate()+"-"+mes+"-"+$scope.CurrentDate.getFullYear();

  var FunG = localStorage.getItem("Funcionario");
  var FunG = JSON.parse(FunG);
  var fun_id = FunG.fun_id;
  console.log("__HORA__",fecha);


  $scope.ficha6 = {

        et_id :null,
        fun_id :null,
        cat_id :null,
        fi_fecha_asignacion:fecha,
        fi_fecha_realizacion:fecha,
        fi_observacion:'',
        fi_estado:'',
        fi_foco_insalubridad:false,
        fi_exibe_certificado:false,
        fi_exibe_carne:false,
        fi_extinguidor:'',
        fi_botiquin:'',
        
        fi6_ubicacion:null ,
        fi6_exibicion_certificado:null ,
        fi6_capacidad_dependencias:null ,
        fi6_piso:null ,
        fi6_cielo_raso:null ,
        fi6_muralla:null ,
        fi6_puerta_ventana:null ,
        fi6_ventilacion:null ,
        fi6_iluminacion:null ,
        fi6_abastecimiento_agua:null ,
        fi6_purificacion_agua:null ,
        fi6_eliminacion_agua:null ,
        fi6_servicios_higienicos:null ,
        fi6_facilidad_aseo:null ,
        fi6_guardaropa:null ,
        fi6_eliminacion_basura:null ,
        fi6_aseo_dependencias:null ,
        fi6_maquinaria_artefactos:null ,
        fi6_fitros:null ,
        fi6_transfugadora:null ,
        fi6_lavado_envases:null ,
        fi6_desinfeccion_envases:null ,
        fi6_materia_prima:null ,
        fi6_eliminacion_productos:null ,
        fi6_proteccion_contaminacion:null ,
        fi6_deposito:null ,
        fi6_manipulador_salud:null ,
        fi6_manipulador_aseo:null ,
        fi6_manipulador_habitos:null ,
        fi6_manipulador_carne:null ,
        fi6_overoles:null ,
        fi6_botiquin:null ,
        fi6_extinguidor:null ,
        fi6_control_vectores:'' ,
        fi6_observaciones:'',
        fi6_hombres:0,
        fi6_mujeres:0
    };

    $scope.patternCadena = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$/;
    $scope.patternCadenaNumero = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ 0-9.]*$/;
    
    $scope.submit = function(b)
    {
        $scope.ficha6.fun_id=fun_id;
        $scope.ficha6.et_id=et_id;
        $scope.ficha6.fi_estado='INSPECCIONADO';

        /* if ($scope.ficha2.fi2_exibe_carnes!=null) {
          $scope.ficha2.fi_exibe_carne=true;
         }
         if ($scope.ficha2.fi2_exibe_certificado!=null) {
          $scope.ficha2.fi_exibe_certificado=true;
         } */
        
        $scope.ficha6.fi_foco_insalubridad=$scope.ficha6.fi6_foco_insalubridad;
        $scope.ficha6.fi_fecha_realizacion= fecha;
        $scope.ficha6.fi6_fecha_realizacion=fecha;
        $scope.ficha6.fi_observacion=$scope.ficha6.fi6_observacion;
    
      Ficha6.save($scope.ficha6).$promise.then(function(data)
      {
        console.log("------GUARDADO.---------",data);
        if(data.msg)
        {
          console.log("data",data);
          angular.copy({}, $scope.ficha1);
          $scope.ajustes.pagina.success = "FICHA REGISTRADA CORRECTAMENTE";
          toastr.success('FICHA REGISTRADA CORRECTAMENTE');
          /*$route.reload();*/
           $timeout(function() {
            $location.path('/inspeccion/categoria/crear/'+data.ficha6_inspeccion.ficha_inspeccion.fi_id+'/'+et_id);
          },10);
        }
      },function () {
        toastr.error("Error inesperado");
      })
    }
    $scope.reset = function(form) {
      $scope.ficha2 = {};
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
    };
}])



.controller('RegistrarUbicacionInspeccionCtrl', ['$http','CONFIG','$scope','Ficha6', '$route', 'toastr','EmpTra','Funcionarios','$routeParams','$timeout','$location',
  function ($http,CONFIG,$scope,Ficha6, $route, toastr,EmpTra,Funcionarios,$routeParams,$timeout,$location){
 
/*---------- DEL MAPA ----*/
$scope.ver_mapita=false;


$scope.latitud=-16.489689;
$scope.longitud=-68.11929359999999;
// $scope.initMap = function(){
//   if(!$scope.ver_mapita){
//     $scope.ver_mapita=true;
//         var infowindow = new google.maps.InfoWindow();
//         var marker, i;
//         navigator.geolocation.getCurrentPosition(function(pos) {
//         $scope.position = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
//           // console.log(JSON.stringify($scope.position));
//           // Creamos un objeto mapa y lo situamos en coordenadas actuales
//         /* */   var map = new google.maps.Map(document.getElementById('mapa_inspeccion'),{
//             center: {lat: pos.coords.latitude, lng: pos.coords.longitude},
//             scrollwheel: false,
//             zoom: 16
//             });
            
//             //marcador solito
//             var marker = new google.maps.Marker({
//               position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
//               map: map,
//               draggable: true,
//     //        animation: google.maps.Animation.BOUNCE,
//             title: ''
//             });   
            
//             var markerLatLng = marker.getPosition();
//             $scope.markerLatLng=markerLatLng;
//             $scope.latitud=markerLatLng.lat();
//             $scope.longitud=markerLatLng.lng();
//             console.log("el objeto con la posicion completa",$scope.markerLatLng);
//             console.log("latitud por defecto",$scope.latitud);
//             console.log("longitud por defecto",$scope.longitud);
//             //console.log("POSITIONmmmmm",marker.position.lat.[[Scopes]].0.a);  
//             infowindow.setContent('<h4 class="text-primary">Tú estas aquí <br><small>Esta es tu ubicación aproximada</small></h4>');
//             infowindow.open(map, marker);

//             google.maps.event.addListener(marker, 'click', (function(marker) {
//                 // return function() {
//                 // var markerLatLng1 = marker.getPosition();
//                 // document.getElementById("establecimientolatitud").value=markerLatLng1.lat();
//                 // document.getElementById("establecimientolongitud").value=markerLatLng1.lng();
//                 // infowindow.open(map, marker);
//                 // }
//             })(marker));

//          })   
//       }else{
//         $scope.ver_mapita=false;
//         // document.getElementById("establecimientolatitud").value=0;
//         // document.getElementById("establecimientolongitud").value=0;
//       };
//   }





}])



/*
.controller('apiAppCtrl_estadoCar', ['$http', '$scope', 'CONFIG', buscaEstadoCarCtrl])
function buscaEstadoCarCtrl($http, $scope, CONFIG){
  $scope.buscaEstadoCar = function(){

    console.log('esta buscando numero de pertramite', $scope.per_ci);
      $scope.tamanio="Cargando...";//////CAMBIADO
      $http.get(CONFIG.DOMINIO_SERVICIOS+'/estado_carnet/'+$scope.per_ci).success(function(respuesta){
        console.log("_ERROR__",respuesta.errors);
          $scope.pertra = respuesta.pertramite;
          if(respuesta.pertramite){
              $scope.tamanio="";
              $scope.ver=true;
              $scope.switch=false;
          } else if(!respuesta.pertramite){
              $scope.ver=false;
              $scope.tamanio="El numero de pertramite ingresado no fue asignado";
          }
          if(respuesta.pruebalabo){
              $scope.tamanio="La pertramite ya fue analizada";
              $scope.verprueba=true;
          }
          if(respuesta.errors){

          }
      });
  }
}*/