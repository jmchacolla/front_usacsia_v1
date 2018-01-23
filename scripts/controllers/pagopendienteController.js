'use strict';
angular.module("adminApp")

.controller('BoletaCesCtrl', ['$scope', '$http', 'EmpTra', 'Tramite','PagoPendienteTramite', 'PagoPendiente', 'EmpresaTramite', 'CrearEstados', '$route', '$resource', '$routeParams', 'toastr', '$location', '$timeout', 'CONFIG','Usuarios', function ($scope, $http,EmpTra, Tramite, PagoPendienteTramite, PagoPendiente, EmpresaTramite, CrearEstados, $route, $resource,$routeParams, toastr, $location, $timeout,CONFIG,Usuarios) {
  var et_id=$routeParams.et_id;
  var FunG = localStorage.getItem("Funcionario");
  var FunG = JSON.parse(FunG);
  var fun_id = FunG.fun_id;

      $scope.ajustes = {
        menu:{
          titulo: 'Registro de pago',
          items:[
            {nombre:'Solicitudes de Propietarios Naturales', enlace:'#/tramites_certi', estilo:''},
            {nombre:'Solicitudes de Propietarios Juridicos', enlace:'#/tramites_certiJ', estilo:''},
            {nombre:'Buscar empresa solicitante', enlace:'#/buscar-propietario', estilo:''}/*,
            {nombre:'Registrar pago', enlace:'#/boleta-ces/'+et_id, estilo:'active'}*/
           ]
        },
        pagina:{
          titulo:'Boleta de pago'
        }
      }

      $http.get(CONFIG.DOMINIO_SERVICIOS+'/verestados/'+et_id+'/'+3).success(function(respuesta){
        $scope.tramitecerestado=respuesta.tramitecerestado;
        console.log("_respuesta__",$scope.tramitecerestado);
      });

    EmpTra.get({et_id:et_id}, function (argument) {
      console.log('argument-------', argument);
      $scope.establecimiento=argument.establecimiento;
        
        console.log('$scope.establecimiento.empresa_tramite.tra_id', $scope.establecimiento.empresa_tramite.tra_id);
        Tramite.get({tra_id:$scope.establecimiento.empresa_tramite.tra_id}, function(data){
        $scope.tramite = data.tramite;
        console.log("tramite del get------",$scope.tramite);
          $scope.monto = function(costo){
            console.log("tramite del get",costo);
              $scope.establecimiento.et_monto=costo;  
              // $scope.pagop=costo;
          }
        })
    })

    $scope.save=function (et_id, tra_costo) {
      // var today=moment().format('DD-MM-YYYY');
      var pago={
              fun_id:fun_id,/*-------debe recoger de la sesion*/
              et_estado_pago:'PAGADO',
              et_estado_tramite:'INICIADO',
              et_monto:tra_costo
          };
          console.log('+++++++++pago', pago);
          var tramite={et_id:et_id};
      CrearEstados.save(tramite).$promise.then(function (data) {
        console.log('los estados++++++++', data);
      })

     /* $http.post(CONFIG.DOMINIO_SERVICIOS+'/crearestados/'+et_id).success(function(respuesta){
        console.log("_respuesta__",respuesta);
      });*/

      EmpTra.update({et_id:et_id},pago, function (argument) {
          toastr.success('Pago registrado exitosamente');

          if (argument.mensaje) {


              $scope.usuario={
                usu_identificador:argument.empt.ess_id,
                usu_tipo:"E",
                rol_id:6
              };

              Usuarios.save($scope.usuario).$promise.then(function(data){
                if(data.msg){
                  angular.copy({}, $scope.usuario);

                }
              });

            $timeout(function() {
                $location.path('/boleta-ces-f1/'+et_id);
            },200);
          }
      })
    }
}])

.controller('BoletaCesVerCtrl', ['CONFIG', /*'authUser',*/ '$scope', 'PagoPendiente', '$route', '$routeParams', 'toastr', '$location', function (CONFIG,/*authUser,*/$scope,PagoPendiente,$route,$routeParams,toastr,$location) {
    var pp_id=$routeParams.pp_id;
    $scope.ajustes = {
      menu:{
        titulo: 'Gestión de Trámites',
        items:[
          {nombre:'Buscar empresa solicitante', enlace:'#/buscar-propietario', estilo:''},
          // {nombre:'Lista de pagos', enlace:'#/', estilo:''},
          // {nombre:'Imprimir boleta de pago', enlace:'#/pago-pendiente/'+pp_id, estilo:'active'}
          ]
      },
      pagina:{
        titulo:'Boleta de pago'
      }
    }
    PagoPendiente.get({pp_id:pp_id}, function (argument) {
        $scope.pagop=argument.pagop;
        console.log('pagop----',$scope.pagop);
    })
}])//---/BoletaCesVerCtrl
.controller('BoletaF1Ctrl', ['$scope', 'CONFIG', '$route', '$routeParams', 'toastr', '$location', 'Tramite', 'EmpresaTramite', function ($scope,CONFIG,$route,$routeParams,toastr,$location,Tramite, EmpresaTramite) {
  var et_id=$routeParams.et_id;
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Trámites',
      items:[
        {nombre:'Buscar empresa solicitante', enlace:'#/buscar-propietario', estilo:''},
        // {nombre:'Lista de pagos', enlace:'#/', estilo:''},
        {nombre:'Imprimir boleta de pago', enlace:'', estilo:'active'}
        ]
    },
    pagina:{
      titulo:'Comprobante de pago'
    }
  }
  EmpresaTramite.get({et_id:et_id}, function (argument) {
    $scope.establecimiento=argument.establecimiento;
    console.log('et_id++++++++', argument);
    console.log('establecimiento++++++++', $scope.establecimiento);
    Tramite.get({tra_id:$scope.establecimiento.empresa_tramite.tra_id}, function (data) {
      $scope.tramite=data.tramite;
    })
    var nombre="";
    var monto=null;
    var identificador="";
    var textoqr="";
    var fecha_pago=moment($scope.establecimiento.empresa_tramite.et_fecha_ini, "YYYY-MM-DD") .format("DD-MM-YYYY");
    // var horaC=fecha_cont[1];
    // var fechaCONT = moment(fecha_cont,"DD-MM-YYYY").format("DD-MM-YYYY");
    var firma_acomp = "FIRMA USUARIO";
    var bolivia="";
    var gober="";
    var sedes="";
    if( $scope.establecimiento.propietario.per_id){
      nombre=$scope.establecimiento.propietario.per_nombres+' '+$scope.establecimiento.propietario.per_apellido_primero+' '+$scope.establecimiento.propietario.per_apellido_segundo;
    identificador=$scope.establecimiento.propietario.per_ci+'  '+$scope.establecimiento.propietario.per_ci_expedido;
    }
    if( $scope.establecimiento.propietario.pjur_id){
      nombre=$scope.establecimiento.propietario.pjur_razon_social;
      identificador= $scope.establecimiento.propietario.pjur_nit;
    }
    textoqr='CERTIFICADO SANITARIO-'+identificador+'-'+nombre+' '+ $scope.establecimiento.empresa_tramite.et_monto+'-FORMULARIO DE INICIO DE TRÁMITE CERTIFICADO SANITARIO'+fecha_pago;
    var img2 =convertImgToDataURLviaCanvas("./scripts/escudo-gober.png", function(base64Img) {
      gober =base64Img;
      var img3 =convertImgToDataURLviaCanvas("./scripts/logoSEDES.png", function(base64Img) {
        sedes =base64Img;

        var docDefinition = {
                
                pageOrientation: 'landscape',
                pageSize: 'A5',
                pageMargins: [ 40,40,40,40 ],

                content: [

                        {
                          image: gober,
                          width: 68,
                          height: 73
                        },
                        {
                          image: sedes, width: 35, height: 55, alignment:'right', absolutePosition:{x:450, y:40}
                        },
                        {
                          text: "GOBIERNO AUTONOMO DEPARTAMENTAL DE LA PAZ\nSERVICIO DEPARTAMENTAL DE SALUD\nUNIDAD DE SALUD AMBIENTAL CONTROL SANITARIO E INOCUIDAD ALIMENTARIA\nCAJA RECAUDADORA DE USACSIA",
                          alignment: 'center', fontSize:8, absolutePosition:{x:80, y:40}
                        },
                        {text: 'REVISADO', bold: true, fontSize:10 , absolutePosition:{x:110, y:350}},
                        {text: 'FIRMA USUARIO', bold: true, fontSize:10 , absolutePosition:{x:400, y:350}},
                        {
                          text: " BOLETA DE PAGO FORMULARIO DE INICIO DE TRÁMITE CERTIFICADO SANITARIO\n\n\n\n\n",
                          alignment: 'center', bold: true
                        },
                        {
                            table: {
                              widths: [400, 100],
                              body: [
                                      [{text: 'UNIDAD DE:  CERTIFICADO SANITARIO'}, { rowSpan:6, qr: textoqr, fit:100, alignment: 'right'},],
                                      [{text: "C.I./NIT:  "+ identificador}],
                                      [{text: 'HEMOS RECIBIDO DEL SR:  '+ nombre}],
                                      [{text: 'LA SUMA DE:  '+ $scope.establecimiento.empresa_tramite.et_monto+" BOLIVIANOS"}],
                                      [{text: 'POR CONCEPTO DE:  FORMULARIO DE INICIO DE TRÁMITE CERTIFICADO SANITARIO'}],
                                      [{text: 'FECHA:  '+fecha_pago}]
                              ],
                              style: 'cuerpo' 
                            } ,
                              layout: 'noBorders',
                              style: 'cuerpo',
                              border: [false, false, false, false]
                               
                        },



                  
                ]
             };       



        $scope.openPdfF1 = function() {
          console.log('llego maricas');
          pdfMake.createPdf(docDefinition).open();
        };

        $scope.downloadPdfF1 = function() {
          console.log('llego maricas');
          pdfMake.createPdf(docDefinition).download();
        };


      });//-----img3
    });//----img2
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





  })//-----empresa_tramite
  
}])//--------/BoletaF1Ctrl

.controller('OrdenPagoCrearCtrl', ['$scope', 'FichaInspc', 'FichaCat', 'FichaCatSancion', 'EmpresaTramite', 'Zonas', 'OrdenPago', 'PagoArancel', 'PagoSancion', 'VerEs', 'CONFIG', '$route', '$http', '$routeParams', '$location', 'toastr', function ($scope,FichaInspc, FichaCat, FichaCatSancion, EmpresaTramite, Zonas, OrdenPago, PagoArancel, PagoSancion, VerEs, CONFIG,$route, $http, $routeParams, $location, toastr) {
   $scope.user = {
    rol_id: CONFIG.ROL_CURRENT_USER
  }
  if ($scope.user.rol_id == 15) {
    $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Trámites',
      items:[
      {nombre:'Establecimientos solicitantes', enlace:'#/lista-solicitantes', estilo:''},
      {nombre:'Establecimientos validados', enlace:'#/lista-validacion', estilo:''},
      {nombre:'Establecimientos inspeccionados', enlace:'#/lista-inspeccionados', estilo:''},
      {nombre:'Imprimir boleta de pago', enlace:'', estilo:'active'}
      ]
    },
    pagina:{
      titulo:'Orden de Pago'
    }
  }
  }else{

    $scope.ajustes = {
      menu:{
        titulo: 'Gestión de Trámites',
        items:[
          {nombre:'Buscar empresa solicitante', enlace:'#/buscar-propietario', estilo:''},
          // {nombre:'Lista de pagos', enlace:'#/', estilo:''},
          {nombre:'Imprimir boleta de pago', enlace:'', estilo:'active'}
          ]
      },
      pagina:{
        titulo:'Orden de Pago'
      }
    }
  }
    var et_id=$routeParams.et_id;
    var FunG = localStorage.getItem("Funcionario");
    var FunG = JSON.parse(FunG);
    var fun_id = FunG.fun_id;
    var arancel=0;
    var sancion=0;
    var et_id=$routeParams.et_id;


    $http.get(CONFIG.DOMINIO_SERVICIOS+'/verestados/'+et_id+'/'+3).success(function(respuesta){
      console.log("_respuesta__",respuesta);
      $scope.tramitecerestado=respuesta.tramitecerestado;
    });

    FichaInspc.get({et_id:et_id}, function (argument) {
      $scope.fichas=argument.ficha_inspeccion;
      console.log('datos ficha+++++', $scope.fichas);
      FichaCat.get({fi_id:$scope.fichas.fi_id}, function (argument) {
        $scope.categorias=argument.ficha_categoria;
        console.log('argument fichacate++++', argument);
          angular.forEach($scope.categorias, function (value, key) {
              $scope.parciales.arancel=$scope.parciales.arancel+Number(value.cat_monto);
          })
          FichaCatSancion.get({fi_id:$scope.fichas.fi_id}, function (argument) {
            $scope.fichasancion=argument.fichasancion;
            $scope.cantsancion=$scope.fichasancion.length;
            console.log('$scope.fichasancion++++',  $scope.fichasancion);
              angular.forEach($scope.fichasancion, function (value, key) {
                  $scope.parciales.sancion=$scope.parciales.sancion+Number(value.fcs_total);
              })

              $scope.total=$scope.parciales.arancel+$scope.parciales.sancion;
              var orden={
                et_id:et_id,
                fun_id:fun_id,
                op_monto_total:$scope.total,

              }
              $scope.genordenpago=function () {
                  /*generando orden de pago--------------------------*/
                  // console.log('orden++++++', orden);
                  OrdenPago.save(orden).$promise.then(function (data) {
                    var opago=data.ordenpago;
                    // console.log('opago++++++', opago);
                    if(data.msg){
                      if($scope.categorias.length>0){
                      /*generando pagocategoria----------------------*/
                        angular.forEach($scope.categorias, function (value, key) {
                          var pagoar={
                              op_id:opago.op_id,
                              fc_id:value.fc_id,
                              pa_monto:value.cat_monto,
                              pa_descripcion:value.cat_codigo
                          }
                          // console.log('pagoar------', pagoar);
                          PagoArancel.save(pagoar).$promise.then(function (dataarancel) {
                            // console.log('dataarancel', dataarancel.pagoa);
                          })
                        });
                        
                        if ($scope.fichasancion.length>0) {
                          angular.forEach($scope.fichasancion, function (value, key) {
                            var pagosan={
                                op_id:opago.op_id,
                                fcs_id:value.fcs_id,
                                ps_monto:value.fcs_total,
                                ps_descripcion:value.cat_codigo
                            }
                            // console.log('pagosancion------', pagosan);
                            PagoSancion.save(pagosan).$promise.then(function (datasan) {
                              // console.log('datasan', datasan.pagos);
                            })
                          });
                        }
                        toastr.success('Orden de pago registrada exitosamente')
                        var req={
                          te_estado:'ASIGNADO',
                          fun_id:fun_id,
                          te_fecha:new Date(),
                          }
                        $http.put(CONFIG.DOMINIO_SERVICIOS+'/wen2/'+et_id+'/'+3, req).success(function(respuesta){
                          console.log("_respuesta__",respuesta);
                          $scope.tramitecerestado=respuesta.tramitecerestado;
                        });
                      }
                    }

                  })
              };
          })
      })
    })
    EmpresaTramite.get({et_id:et_id},function (argument) {
      $scope.establecimiento=argument.establecimiento;
      console.log('$scope.establecimiento+++++++',$scope.establecimiento);
      $scope.establecimiento.empresa_tramite.et_fecha_ini=moment($scope.establecimiento.empresa_tramite.et_fecha_ini, 'YYYY-MM-DD').format('DD-MM-YYYY');

      if ($scope.establecimiento.propietario.pro_tipo=='J') {
        $scope.propietario=$scope.establecimiento.propietario.pjur_razon_social;

      }
      if ($scope.establecimiento.propietario.pro_tipo=='N') {
        $scope.propietario=$scope.establecimiento.propietario.per_nombres+' '+$scope.establecimiento.propietario.per_apellido_primero+' '+$scope.establecimiento.propietario.per_apellido_segundo;

      }

    })

    
    $scope.parciales={
      arancel:0,
      sancion:0,
    };

}])

.controller('PagoOrdenPagoCtrl', ['$scope', '$http', '$routeParams', '$location', 'CONFIG', 'EmpresaTramite', 'OrdenPago', 'OrdenPagoEstado', function ($scope, $http, $routeParams, $location, CONFIG, EmpresaTramite, OrdenPago, OrdenPagoEstado) {
    var et_id=$routeParams.et_id;
    var FunG = localStorage.getItem("Funcionario");
    var FunG = JSON.parse(FunG);
    var fun_id = FunG.fun_id;
    $http.get(CONFIG.DOMINIO_SERVICIOS+'/verestados/'+et_id+'/'+3).success(function(respuesta){
      console.log("_respuesta__",respuesta);
      $scope.tramitecerestado=respuesta.tramitecerestado;
    });
    EmpresaTramite.get({et_id:et_id},function (argument) {
      $scope.establecimiento=argument.establecimiento;
      console.log('$scope.establecimiento+++++++',$scope.establecimiento);
      $scope.establecimiento.empresa_tramite.et_fecha_ini=moment($scope.establecimiento.empresa_tramite.et_fecha_ini, 'YYYY-MM-DD').format('DD-MM-YYYY');
     
      if ($scope.establecimiento.propietario.pro_tipo=='J') {
        $scope.propietario=$scope.establecimiento.propietario.pjur_razon_social;
      }
      if ($scope.establecimiento.propietario.pro_tipo=='N') {
        $scope.propietario=$scope.establecimiento.propietario.per_nombres+' '+$scope.establecimiento.propietario.per_apellido_primero+' '+$scope.establecimiento.propietario.per_apellido_segundo;
      }

    })
    var estado={op_estado_pago:'PENDIENTE', et_id:et_id};
    OrdenPagoEstado.get(estado, function (data) {
      $scope.ordenpago=data.ordenpago;
      // console.log('$scope.ordenpago', $scope.ordenpago);
      $scope.ordenpago.op_fecha_emision=moment($scope.ordenpago.op_fecha_emision, 'YYYY-MM-DD').format('DD-MM-YYYY');
    })
    $scope.detalle=function (op_id) {
      $location.path('/orden-detalle/'+op_id);
    }

}])
.controller('OrdenDetalleCtrl', ['$scope', '$routeParams', '$location', 'CONFIG', 'EmpresaTramite', 'OrdenPago', 'OrdenPagoEstado', 'EstabSols', '$http', function ($scope, $routeParams, $location, CONFIG, EmpresaTramite, OrdenPago, OrdenPagoEstado, EstabSols, $http) {
    $scope.ajustes = {
      menu:{
        titulo: 'Gestión de Trámites',
        items:[
          {nombre:'Buscar empresa solicitante', enlace:'#/buscar-propietario', estilo:''},
          // {nombre:'Lista de pagos', enlace:'#/', estilo:''},
          {nombre:'Imprimir boleta de pago', enlace:'', estilo:'active'}
          ]
      },
      pagina:{
        titulo:'Orden de Pago'
      }
    }

    var op_id=$routeParams.op_id;
    var FunG = localStorage.getItem("Funcionario");
    var FunG = JSON.parse(FunG);
    var fun_id = FunG.fun_id;

    $http.get(CONFIG.DOMINIO_SERVICIOS+'/verordenpago/'+op_id).success(function(data){
        $scope.emptra=data.emptra;
        console.log('$scope.emptra',$scope.emptra);
        $http.get(CONFIG.DOMINIO_SERVICIOS+'/verestados/'+$scope.emptra.et_id+'/'+3).success(function(respuesta){
          console.log("_respuesta__",respuesta);
          $scope.tramitecerestado=respuesta.tramitecerestado;
        });
        $scope.emptra.et_fecha_ini=moment($scope.emptra.et_fecha_ini, 'YYYY-MM-DD').format('DD-MM-YYYY');
        $scope.ordenpago=data.ordenpago;
        console.log('$scope.ordenpago',$scope.ordenpago);
        $scope.pagoa=data.pagoa;
        console.log('$scope.pagoa',$scope.pagoa);
        $scope.pagos=data.pagos;
        $scope.cantsancion=$scope.pagos.length;
        console.log('$scope.pagos',$scope.pagos);
        EstabSols.get({ess_id:$scope.emptra.ess_id}, function (argument) {
          $scope.establecimiento=argument.establecimiento;
          console.log(' $scope.establecimiento', $scope.establecimiento);
        })

        $scope.pagarorden=function (data) {
          var req={
            fun_cajero_id:fun_id,
            op_estado_pago:'PAGADO',
            op_fecha_pagado:new Date()
          };
          $http.put(CONFIG.DOMINIO_SERVICIOS+'/orden_pago/'+$scope.ordenpago.op_id,req).success(function(respuesta){
            console.log("_respuesta__",respuesta);
            $scope.tramitecerestado=respuesta.tramitecerestado;
          });
          var req2={
            te_estado:'APROBADO',
            fun_id:fun_id,
            te_fecha:new Date(),
            }
          $http.put(CONFIG.DOMINIO_SERVICIOS+'/wen2/'+$scope.ordenpago.et_id+'/'+3, req2).success(function(respuesta){
            console.log("_respuesta__",respuesta);
            $scope.tramitecerestado=respuesta.tramitecerestado;
          });
        }
    });
    
    $scope.openOrdenPDF=function (data) {
      console.log('llego maricas');
      pdfMake.createPdf(docDefinition).open();
    };
    $scope.downloadOrdenPDF = function() {
      console.log('llego maricas');
      pdfMake.createPdf(docDefinition).download();
    };




    var docDefinition = {
                
                pageOrientation: 'landscape',
                pageSize: 'A5',
                pageMargins: [ 30, 10, 30, 10 ],

                content: [

                //   {
                //   table: {
                //   widths: [110, 310, 100],
                //   body: [
                //       [
                //         {
                //           image: gober,
                //           width: 68,
                //           height: 73
                //         },
                //         {
                //           /*image: gober,
                //           width: 64,
                //           height: 62*/
                //           text: "\n \n \n GOBIERNO AUTONOMO DEPARTAMENTAL DE LA PAZ \n SERVICIO DEPARTAMENTAL DE SALUD \n UNIDAD DE SALUD AMBIENTAL \n CONTROL SANITARIO E INOCUIDAD ALIMENTARIA \n \n CAJA RECAUDADORA DE USACSIA",
                //           alignment: 'center',
                //           style: 'header' 
                //         },
                //         {
                //           image: sedes,
                //           width: 35,
                //           height: 55,
                //           alignment:'right'
                //         }
                //       ],
                //   ],

                //   },
                //   layout: 'noBorders',
                //   style: 'cuerpo',
                //   border: [false, false, false, false]

                // },
                // header(tituloqr),
                //     {
                //       qr: textoqr,
                //       fit:50,
                //       alignment: 'right'
                //     },
                {
                   text: "C.I./NIT:  "+'identificador', fontSize: 12, alignment: 'right'
                },
                {
                  text: " \nBOLETA DE PAGOS\n\n",
                  alignment: 'center',
                  style: 'header'  
                },
                {
                    table: {
                    widths: [530],

                      body: [
                        [
                          {
                            table: {
                              headerRows: 1,
                              body: [
                                 [{text: 'UNIDAD DE:', bold: true},'$scope.pagop.tramite.tra_nombre',{text: 'FECHA: ', bold: true},'fechaCONT',{text: 'HORA: ', bold: true},'horaC'],
                                  [{text: 'HEMOS RECIBIDO DEL SR:', bold: true}, 'nombre', {text: ''},'',{text: ' '},''],
                                   [{text: 'LA SUMA DE:', bold: true},'$scope.pagop.pagop.pp_monto_total'+" BOLIVIANOS",{text: ''},'',{text: ' '},''],
                                   [{text: 'POR CONCEPTO DE:', bold: true},'$scope.pagop.pagop.pp_descripcion',{text: ''},'',{text: ' '},''],
                             
                                
                                ]
                              },
                              layout: 'noBorders',
                              style: 'cuerpo',
                              border: [true, true, true, false]
                          }
                        ],
                       
                   
                        [
                          {

                            table: {
                            widths: [130, 130, 130,130],
                            body: [
                                  ['\n \n',''/*,'',''*/],
                                  ['\n \n',''/*,'\n\n',''*/],
                                  ['',''/*,'\n\n',''*/],                                  
                                  [{text: 'REVISADO', bold: true, alignment: 'center'},
                                  {text: 'FIRMA USUARIO', bold: true,alignment: 'center'}/*,{text: '', bold: true,alignment: 'center'},{text: '', bold: true, alignment: 'center' }*/]
                              ]
                            },
                            layout: 'noBorders',
                            style: 'cuerpo1',
                            border: [true, false, true, true]
                          }
                        ],
                      ],
                      style: 'cuerpo' 
                    }     
                },



                  
                ]
             };       



}])

.controller('pdf_pagopF_Ctrl',['$scope', 'PagoPendiente', 'CONFIG','$routeParams', '$http', function ($scope, PagoPendiente, CONFIG, $routeParams, $http){
  // prepare the document definition using declarative approach
    var id = $routeParams.pp_id;
    console.log("IDEDESS",id);
   /* var id=8;*/
    PagoPendiente.get({pp_id:id}, function(data)
    {
      $scope.pagop = data.pagop;
      console.log('pagopp---', $scope.pagop);
      var nombre='';
      var identificador='';
      // if ($scope.pagop.propietario.pjur_id) {
      //       nombre=$scope.pagop.propietario.pjur_nombre;
      //       identificador=$scope.pagop.propietario.pjur_nit;
      // }
      if ($scope.pagop.propietario.per_id) {
            nombre=$scope.pagop.propietario.per_nombres+' '+$scope.pagop.propietario.per_apellido_primero+' '+$scope.pagop.propietario.per_apellido_segundo;
            identificador=$scope.pagop.propietario.per_ci+'  '+$scope.pagop.propietario.per_ci_expedido;
      }
      // if()
      var fechapago= $scope.pagop.et.pt_fecha_ini;
      var fecha_cont=moment($scope.pagop.pagop.pp_fecha_pagado, "YYYY-MM-DD") .format("DD-MM-YYYY");
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
            console.log("entro al controlador pdf",$scope.pagop)

            var tituloqr= 'Nro. Trámite: '+$scope.pagop.et.et_numero_tramite;
            var textoqr= 'USACSIA-CERTIFICADO-SANITARIO-'+$scope.pagop.et.et_numero_tramite+'-'+identificador;
            //estilo, encabezado de QR
            function header(text) {
              return {text: text, margins: [0, 0, 0, 8],alignment: 'right'};
            }
            var docDefinition = {
                
                pageOrientation: 'landscape',
                pageSize: 'A5',
                pageMargins: [ 30, 10, 30, 10 ],

                content: [

                  {
                  table: {
                  widths: [110, 310, 100],
                  body: [
                      [
                        {
                          image: gober,
                          width: 68,
                          height: 73
                        },
                        {
                          /*image: gober,
                          width: 64,
                          height: 62*/
                          text: "\n \n \n GOBIERNO AUTONOMO DEPARTAMENTAL DE LA PAZ \n SERVICIO DEPARTAMENTAL DE SALUD \n UNIDAD DE SALUD AMBIENTAL \n CONTROL SANITARIO E INOCUIDAD ALIMENTARIA \n \n CAJA RECAUDADORA DE USACSIA",
                          alignment: 'center',
                          style: 'header' 
                        },
                        {
                          image: sedes,
                          width: 35,
                          height: 55,
                          alignment:'right'
                        }
                      ],
                  ],

                  },
                  layout: 'noBorders',
                  style: 'cuerpo',
                  border: [false, false, false, false]

                },
                header(tituloqr),
                    {
                      qr: textoqr,
                      fit:50,
                      alignment: 'right'
                    },
                {
                   text: "C.I./NIT:  "+identificador, fontSize: 12, alignment: 'right'
                },
                {
                  text: " \nBOLETA DE PAGOS\n\n",
                  alignment: 'center',
                  style: 'header'  
                },
                {
                    table: {
                    widths: [530],

                      body: [
                        [
                          {
                            table: {
                              headerRows: 1,
                              body: [
                                 [{text: 'UNIDAD DE: CERTIFICADO SANITARIO', bold: true},{text: 'FECHA: ', bold: true},fecha_cont],
                                  [{text: 'HEMOS RECIBIDO DEL SR:', bold: true}, nombre, {text: ''},'',{text: ' '},''],
                                   [{text: 'LA SUMA DE:', bold: true},$scope.pagop.pagop.pp_monto_total+" BOLIVIANOS",{text: ''},'',{text: ' '},''],
                                   [{text: 'POR CONCEPTO DE:', bold: true},$scope.pagop.pagop.pp_descripcion,{text: ''},'',{text: ' '},''],
                             
                                
                                ]
                              },
                              layout: 'noBorders',
                              style: 'cuerpo',
                              border: [true, true, true, false]
                          }
                        ],
                       
                   
                        [
                          {

                            table: {
                            widths: [130, 130, 130,130],
                            body: [
                                  ['\n \n',''/*,'',''*/],
                                  ['\n \n',''/*,'\n\n',''*/],
                                  ['',''/*,'\n\n',''*/],                                  
                                  [{text: 'REVISADO', bold: true, alignment: 'center'},
                                  {text: 'FIRMA USUARIO', bold: true,alignment: 'center'}/*,{text: '', bold: true,alignment: 'center'},{text: '', bold: true, alignment: 'center' }*/]
                              ]
                            },
                            layout: 'noBorders',
                            style: 'cuerpo1',
                            border: [true, false, true, true]
                          }
                        ],
                      ],
                      style: 'cuerpo' 
                    }     
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

              $scope.openPdfCESF1 = function() {
                console.log('llego maricas');
                pdfMake.createPdf(docDefinition).open();
              };

              $scope.downloadPdfCESF1 = function() {
                console.log('llego maricas');
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



