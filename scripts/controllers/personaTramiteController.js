'use strict';
angular.module("adminApp")
//lista tramites
.controller('PersonaTramiteController', ['$scope', 'ListarTramitesService', '$route', 'toastr', '$location', function ($scope, ListarTramitesService, $route, toastr,$location)
{
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de tramites de Carné Sanitario',
      items:[
        {nombre:'Solicitudes de Carné Sanitario', enlace:'#/tramites-car', estilo:'active'},
        {nombre:'Busqueda de personas registradas', enlace:'#/tramite/crear', estilo:''}]
    },
    pagina:{
      titulo:'Tramites de Carné Sanitario'
    }
  }
  var FunG = localStorage.getItem("Funcionario");
  var FunG = JSON.parse(FunG);
  var fun_id = FunG.fun_id;

  
  $scope.sortType = 'per_id'; // set the default sort type
  $scope.sortReverse  = true;  // set the default sort order
  $scope.Personas = [];

  
  $scope.loading=true;//para hacer un loading
  var tra_id = 1;
  ListarTramitesService.get({tra_id:1}, function(data){
    console.log('*******persona_tramite ---------', data);
    $scope.persona_tramite = data.persona_tramite;
    angular.forEach($scope.persona_tramite, function (value, key) {
       value.per_fecha_nacimiento=moment(value.per_fecha_nacimiento, 'YYYY-MM-DD').format('DD-MM-YYYY');
    });
    // for (var i=0; i=$scope.persona_tramite.length; i++)
    // {
    // 	 if ($scope.persona_tramite[i].per_genero=='F' || $scope.persona_tramite[i].per_genero=='f'){
    //     $scope.persona_tramite[i].per_genero='FEMENINO';
    //   }
    //   else if($scope.persona_tramite[i].per_genero=='M' || $scope.persona_tramite[i].per_genero=='m'){
    //     $scope.persona_tramite[i].per_genero='MASCULINO';
    //   }
    // }

    
    if(data.persona_tramite.length>0){
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



/*CREAR PERSONA TRAMITE---- BUSQUEDA POR CI*/
.controller('CrearPersonaTramiteCtrl', ['$scope', '$route','PersonaTramite','Tramite' ,'toastr', '$location', function ($scope, $route, PersonaTramite,Tramite,toastr, $location){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestion de solicitudes de trámite',
      items:[
      {nombre:'Solicitudes de Carné Sanitario', enlace:'#/tramites-car', estilo:''},
      {nombre:'Busqueda de personas registradas', enlace:'#/tramite/crear', estilo:'active'}]
    },
    pagina:{
      titulo:'Registrar Pago'
    }
  }

 
    $scope.persona_tramite={
      tra_id:null, 
      per_id:null,
      fun_id:null,
      // pt_fecha_ini :"",
      pt_monto:null,
      pt_tipo_tramite:""
    };

    $scope.CurrentDate = new Date();
    Tramite.get({tra_id:1}, function(data){
    $scope.tramite = data.tramite;
    console.log("tramite del get",$scope.tramite);

      $scope.monto = function(costo){
          $scope.persona_tramite.pt_monto=costo;  
      }
    })

    var FunG = localStorage.getItem("Funcionario");
    var FunG = JSON.parse(FunG);
    var fun_id = FunG.fun_id;
    $scope.bloqueo=true;
    /**/
      $scope.tramiteselect={
        tra_id:null,
        tra_nombre:"",
        tr_costo:null,
        tra_vigencia:"",
      };
  $scope.save = function(a, per_id,tra_id,tra_costo){
    $scope.persona_tramite.per_id=per_id;
    $scope.persona_tramite.tra_id=tra_id;
    $scope.persona_tramite.pt_monto=tra_costo;
    $scope.persona_tramite.fun_id=fun_id;
    console.log('la persona-tramite que se va a cerar', $scope.persona_tramite);
    PersonaTramite.save($scope.persona_tramite).$promise.then(function(data)
    {
      console.log('el data', data);
      $scope.bloqueo=false;
        if(data.mensaje){
          toastr.success('Pago registrado correctamente.');
               $location.path('/boleta-pago/'+data.persona_tramite.pt_id);

        }
    })
  }

   $scope.ver=false;
}])



/*VER PAGO*/
.controller('BoletaCtrl', ['$scope', 'PersonaTramite', 'Ficha', '$route', 'toastr', '$timeout', '$location', '$routeParams', function ($scope, PersonaTramite, Ficha, $route, toastr,$timeout, $location, $routeParams) {

  
    
    var pt_id = $routeParams.pt_id;
    var nt;
    PersonaTramite.get({pt_id:pt_id}, function(data)
    {
      $scope.pertramite = data.pertramite;
      console.log('-----', $scope.pertramite);
      nt=$scope.pertramite.persona_tramite.pt_numero_tramite;
      $scope.day=moment($scope.pertramite.persona_tramite.pt_fecha_ini, "YYYY-MM-DD") .format("DD-MM-YYYY");
      $scope.monto='Numeros a Letras';
      // if ($scope.pertramite.persona.per_genero=='F' || $scope.pertramite.persona.per_genero=='f'){
      //   $scope.pertramite.persona.per_genero='FEMENINO';
      // }
      // else if($scope.pertramite.persona.per_genero=='M' || $scope.pertramite.persona.per_genero=='m'){
      //   $scope.pertramite.persona.per_genero='MASCULINO';
      // }

    $scope.ajustes = {
      menu:{
        titulo: 'Gestión de pagos',
        items:[
        {nombre:'Busqueda de personas registradas', enlace:'#/tramite/crear', estilo:''},
        {nombre:'Solicitudes de Carné Sanitario', enlace:'#/tramites-car', estilo:''},
        {nombre:'Detalle pago', enlace:'#/boleta-pago/'+pt_id, estilo:'active'}
        ]
      },
      pagina:{
        titulo:'Comprobante de pago Trámite N°: '+nt/*$scope.pertramite.persona_tramite.pt_numero_tramite*/
      }
    };


    });

}])


.controller('ListaFinalCtrl', ['$scope','CONFIG', 'Final', '$route', 'toastr', '$location','Personas','TramiteEstado','CarnetSanitario','FirmaFun', function ($scope,CONFIG, Final, $route, toastr,$location,Personas,TramiteEstado,CarnetSanitario,FirmaFun)
{
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de tramites Concluidos de Carné Sanitario',
      items:[
        {nombre:'Tramites Concluidos', enlace:'#/tramites_concluidos', estilo:'active'}]
    },
    pagina:{
      titulo:'Tramites de Carné Sanitario'
    }
  }
  $scope.user = {
    rol_id: CONFIG.ROL_CURRENT_USER
  }
  
  $scope.sortType = 'pt_id'; // set the default sort type
  $scope.sortReverse  = true;  // set the default sort order
  $scope.Personas = [];


  $scope.loading=true;//para hacer un loading

  Final.get(function(data){
  
    $scope.persona_tramite = data.persona_tramite;

    if(data.persona_tramite.length>0){
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
  var FunG = localStorage.getItem("Funcionario");
  var FunG = JSON.parse(FunG);
  var fun_id=FunG.fun_id;//remplaar con la sesion

  $scope.CurrentDate = new Date();
  var mes=$scope.CurrentDate.getMonth()+1;
  var fecha=$scope.CurrentDate.getDate()+"-"+mes+"-"+$scope.CurrentDate.getFullYear();
  
  var anio2=$scope.CurrentDate.getFullYear()+1;
  var fecha2=$scope.CurrentDate.getDate()+"-"+mes+"-"+anio2;
  console.log("__para la fecha CADUCIDAD__",fecha2);

 console.log("esta en el controlador"); 
    var id = 0;
    var ci=0;
   $scope.rec=function(pt_id, per_id){
    console.log("LLEGA A LA FUNCION",pt_id);
    id=pt_id;
    Personas.get({per_id:per_id}, function(data)
      {
        $scope.persona = data.persona;
        $scope.nombre=$scope.persona.persona.per_nombres+' '+$scope.persona.persona.per_apellido_primero+' '+$scope.persona.persona.per_apellido_segundo;
        ci=$scope.persona.persona.per_ci;

      });
    
  };
  console.log('este es el pt fuera de la funcion',id);

  $scope.recepcionar=function(){
    $scope.estado={
      pt_estado_tramite:'APROBADO'
    }
    console.log('el pt_id para cambiar estado',id);
    TramiteEstado.update({pt_id:id}, $scope.estado).$promise.then(function(data)
    {
      console.log("entra a update")
      if(data.status)
      {
          console.log("lo logro...");
          toastr.success('Aprobacion correcta');
          //tengo que obtener la firma del funcionario que se logueo y guardar en carnet recien
          console.log("PARA VER LA FIRMA", fun_id);
          /*FirmaFun.get({fun_id:fun_id}, function(data)
          {*/
            /*$scope.firmas=data.firma;
            console.log("obteniendo la firma del fucnionario loguaado", $scope.firmas);*/
            console.log("__el ci de la persona__",ci);
            $scope.carnet={
                pt_id:id,
                cas_numero:ci,
                cas_fecha_inicio:fecha,
                cas_fecha_fin:fecha2/*,
                cas_url:$scope.firmas.firma.fir_url,
                cas_nombre:$scope.firmas.firma.fir_name*/
            }
            console.log("PARA GUARDAR EL CARNET",$scope.carnet);
            CarnetSanitario.save($scope.carnet).$promise.then(function(data)
            {
               if(data.msg){
                angular.copy({}, $scope.carnet);
                console.log("se registro carnet correctamente",data);
              
              }

            });//fin carnetsanitario
          /*} );//FIN DE FIRMAFUNCIONARIO*/
          $route.reload();
      }

    });//FIN TRAMITE ESTADO





    console.log($scope.estado);
    
  };
   
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
.controller('VerFinalCtrl', ['$scope', 'VerPT',  '$route', 'toastr', '$timeout', '$location', '$routeParams', function ($scope, VerPT, $route, toastr,$timeout, $location, $routeParams) {
   var pt_id = $routeParams.pt_id;

  $scope.ajustes = {
      menu:{
        titulo: 'Gestión de tramites Concluidos de Carné Sanitario',
        items:[
            {nombre:'Tramites concluidos', enlace:'#/tramites_concluidos', estilo:''},
            {nombre:'Detalle de Trámite concluido', enlace:'#/tramites_concluidos/ver/'+pt_id, estilo:'active'}]
      },
      pagina:{
        titulo:'Detalle trámite concluido: '/*$scope.pertramite.persona_tramite.pt_numero_tramite*/
      }
    };
  

    VerPT.get({pt_id:pt_id}, function(data)
    {
      $scope.pertramite = data.pertramite;
      $scope.numero=$scope.pertramite.persona_tramite.pt_numero_tramite;
     console.log('pertramite-----', $scope.pertramite);
       /*nt=$scope.pertramite.persona_tramite.pt_numero_tramite;
      $scope.today=moment(new Date(), "YYYY-MM-DD") .format("DD-MM-YY");
      $scope.monto='Numeros a Letras';*/
     
    
    });

}])

.controller('PersonaTramiteCertificadoCtrl', ['$scope', 'ListarTramitesService', '$route', 'toastr', '$location', 
function ($scope, ListarTramitesService, $route, toastr,$location)
{
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de tramites de Carné Sanitario',
      items:[
        {nombre:'Solicitudes de Carné Sanitario', enlace:'#/persona-usacsia', estilo:'active'}]
    },
    pagina:{
      titulo:'Tramites de Certificado Sanitario'
    }
  }

  console.log('PersonaTramiteCertificado---------');
  
  $scope.sortType = 'per_id'; // set the default sort type
  $scope.sortReverse  = true;  // set the default sort order
  $scope.Personas = [];

 
  $scope.loading=true;//para hacer un loading
  var tra_id = 2;
  ListarTramitesService.get({tra_id:tra_id}, function(data){
    console.log('*******persona_tramite de certificadp ---------', data);
    $scope.persona_tramite = data.persona_tramite;
    
    if(data.persona_tramite.length>0){
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


.controller('pdf_pago_Ctrl',['$scope', 'PersonaTramite', 'CONFIG','$routeParams', '$http', function ($scope, PersonaTramite, CONFIG, $routeParams, $http){
  // prepare the document definition using declarative approach
    var id = $routeParams.pt_id;
    console.log("IDEDESS",id);
   /* var id=8;*/
    PersonaTramite.get({pt_id:id}, function(data)
    {
      $scope.persona = data.pertramite;
      console.log('persona++++', $scope.persona);
      var fechapago= $scope.persona.persona_tramite.pt_fecha_ini;
      var fecha_cont=moment(new Date(), "YYYY-MM-DD") .format("DD-MM-YYYY");
      var horaC=fecha_cont[1];
      var fechaCONT = moment(fecha_cont,"DD-MM-YYYY").format("DD-MM-YYYY");
      var firma_acomp = "FIRMA USUARIO";
      var bolivia="";
      var gober="";
      var sedes="";
      var img1 =convertImgToDataURLviaCanvas("./scripts/escudo_bolivia.png", function(base64Img) {
        bolivia =base64Img;
        //console.log("BASE 64"+bolivia);
        var img2 =convertImgToDataURLviaCanvas("./scripts/escudo-gober.png", function(base64Img) {
          gober =base64Img;
          var img3 =convertImgToDataURLviaCanvas("./scripts/logoSEDES.png", function(base64Img) {
            sedes =base64Img;
            console.log("entro al controlador pdf",$scope.persona)

            var tituloqr= 'Nro. Trámite: '+$scope.persona.persona_tramite.pt_numero_tramite;
            var textoqr= 'USACSIA-CARNÉ-SANITARIO-'+$scope.persona.tramite.tra_nombre+'-'+$scope.persona.persona_tramite.pt_numero_tramite+/*'-'$scope.persona.persona.per_nombres+"-"+$scope.persona.persona.per_apellido_primero+"-"+$scope.persona.persona.per_apellido_segundo+*/'-'+$scope.persona.persona.per_ci+'-'+$scope.persona.tramite.tra_costo;
            //estilo, encabezado de QR
            function header(text) {
              return {text: text, margins: [0, 0, 0, 8],alignment: 'right'};
            }
            var docDefinition = {
                
                pageOrientation: 'landscape',
                // pageSize: {width:100, height:100},
                pageSize: 'A6',
                pageMargins: [ 30, 20, 30, 20 ],
                info: {/*Metadatos*/
                  title: 'Boleta de pago',
                  author: 'USACSIA-SEDES LA PAZ',
                  subject: 'Boleta de Pago',
                  keywords: 'carne sanitario',
                  creator: 'USACSIA',
                  producer: 'USACSIA',
                  },

                content: [

                    {
                      image: gober, width: 50, height: 50,  absolutePosition:{x:15, y:15}
                    },
                    {
                      image: sedes, width: 30, height: 50, absolutePosition:{x:360, y:15}
                    },
                    {
                      text: "GOBIERNO AUTONOMO DEPARTAMENTAL DE LA PAZ\nSERVICIO DEPARTAMENTAL DE SALUD\nUNIDAD DE SALUD AMBIENTAL CONTROL SANITARIO E INOCUIDAD ALIMENTARIA\nCAJA RECAUDADORA DE USACSIA",
                      alignment: 'center', fontSize:8
                    },
                    {text: 'REVISADO', bold: true, fontSize:10 , absolutePosition:{x:90, y:250}},
                    {text: 'FIRMA USUARIO', bold: true, fontSize:10 , absolutePosition:{x:210, y:250}},
                    
                    
                
                {
                  text: " BOLETA DE PAGO",
                  alignment: 'center',
                  style: 'header'  
                },

                {

                    table: {
                      widths: [230, 100],

                      body: [
                                [
                                  { text: 'UNIDAD DE: '+$scope.persona.tramite.tra_nombre, text: 'FECHA: '+fechaCONT},
                                  { rowSpan:6, qr: textoqr, fit:100, alignment: 'right'},
                                ],
                                [
                                  {text: 'HEMOS RECIBIDO DEL SR:  '+$scope.persona.persona.per_nombres+" "+$scope.persona.persona.per_apellido_primero+" "+$scope.persona.persona.per_apellido_segundo}
                                ],
                                [
                                  {text: "C.I. N°: "+$scope.persona.persona.per_ci+'  '+$scope.persona.persona.per_ci_expedido}
                                ],
                                [
                                  {text: 'LA SUMA DE:  '+$scope.persona.tramite.tra_costo+" BOLIVIANOS"}
                                ],
                                [
                                  {text: 'POR CONCEPTO DE: '+$scope.persona.tramite.tra_nombre}
                                ],
                                [
                                  {text: 'TRÁMITE N°: '+ $scope.persona.persona_tramite.pt_numero_tramite}
                                ]
                            ],
                    },
                    margin:[20, 30, 10, 0],
                    layout: 'noBorders',
                    border: [false, false, false, false],
                },




                  
                ],
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
                  cuerpo1: {
                    color: '#000',
                    fontSize: 7
                  },
                  demoTable: {
                    color: '#666',
                    fontSize: 10
                  },
                  tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black'
                  },
                  tableExample: {
                    margin: [0, 5, 0, 15]
                  }
                }
             };       

              $scope.openPdf1 = function() {
                
                pdfMake.createPdf(docDefinition).open();
              };

              $scope.downloadPdf1 = function() {
                pdfMake.createPdf(docDefinition).download();
              };
 

        });//fin imagen escudo bolivia
        });//fin imagen gober
        });//fin imagen sedes

         function convertImgToDataURLviaCanvas(url, callback, outputFormat) {
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function() {
              var canvas = document.createElement('CANVAS');
              var ctx = canvas.getContext('2d');
              var dataURL;
              canvas.height = this.height;
              canvas.width = this.width;
              ctx.drawImage(this, 0, 0);
              dataURL = canvas.toDataURL(outputFormat);
              callback(dataURL);
              canvas = null;
            };
            img.src = url;
        };
    });// ============  FIN persona tramite.get

}])//=================  FIN pdf_pago_Ctrl


// 





























/*BUSCA PERSONA POR CI*/
.controller('BuscaPersonaCtrl', ['$http', '$scope', 'CONFIG', buscaPersonaController])
function buscaPersonaController($http, $scope, CONFIG){
  $scope.buscaPersona = function(){
    /*console.log('esta buscando persona',$scope.per_ci);*/
      $scope.resultado="Cargando...";
      $http.get(CONFIG.DOMINIO_SERVICIOS+'/personas_ci/'+$scope.per_ci).success(function(respuesta){
          
          if(!respuesta.persona || respuesta.persona==null){
              $scope.ver=false;
              $scope.resultado=" La persona no se encuentra registrada";    
              /*console.log("_respuesta__",$scope.resultado); */         
          } else if(respuesta.persona){
            $scope.persona = respuesta.persona.persona;
              $scope.ver=true;
              $scope.resultado='';
          }  
      });
  }
}



// rgb(213, 48, 50)

// @component-active-bg

// @component-active-bg

