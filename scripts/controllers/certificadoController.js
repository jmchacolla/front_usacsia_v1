'use strict';
angular.module("adminApp")

.controller('CertificadoCtrl', ['CONFIG', /*'authUser',*/ '$scope', 'EmpTra', '$route', '$routeParams', 'toastr', '$location','VerTramCer', function (CONFIG,/*authUser,*/$scope,EmpTra,$route,$routeParams,toastr,$location,VerTramCer) {
/*    if ($scope.user.rol_id == 14) {
    $scope.ajustes = {
      menu:{
        titulo: 'Gestión de Certificado Sanitario',
        items:[ 

          {nombre:'Establecimientos solicitantes', enlace:'#/lista-solicitantes', estilo:''},
           {nombre:'Establecimientos validados', enlace:'#/lista-validacion', estilo:''},
            {nombre:'Establecimientos inspeccionados', enlace:'#/lista-inspeccionados', estilo:''},
            {nombre:'Establecimientos que cancelaron', enlace:'#/lista-cancelaron', estilo:'active'}
          
          ]
      },
      pagina:{
        titulo:'Establecimientos que pagaron arancel'
      }
    }
  }*/
   $scope.user = {
    rol_id: CONFIG.ROL_CURRENT_USER
  }
    var et_id = $routeParams.et_id;
    EmpTra.get({et_id:et_id}, function(data)
    {
        console.log('la data-------',data);
        $scope.empresatramite=data.establecimiento;


        $scope.ajustes = {
          menu:{
            titulo: 'Impresión de certificado sanitario',
            items:[
              {nombre:'Establecimientos que cancelaron', enlace:'#/lista-cancelaron', estilo:''},
              {nombre:'Detalle de trámite', enlace:'', estilo:'active'}
              ]
          },
          pagina:{
            titulo:'Certificado Sanitario trámite N°: '+$scope.empresatramite.empresa_tramite.et_numero_tramite
          }
        }

    if ($scope.empresatramite.propietario.pro_tipo=='J') {
      $scope.propietario=$scope.empresatramite.propietario.pjur_razon_social;
      $scope.documento=$scope.empresatramite.propietario.pjur_nit;
    }
    if ($scope.empresatramite.propietario.pro_tipo=='N') {
      $scope.propietario=$scope.empresatramite.propietario.per_nombres+' '+$scope.empresatramite.propietario.per_apellido_primero+' '+$scope.empresatramite.propietario.per_apellido_segundo;
      $scope.documento=$scope.empresatramite.propietario.per_ci+' '+$scope.empresatramite.propietario.per_ci_expedido;
    }

    })
    /*$scope.ver=false;*/
    VerTramCer.get({et_id:et_id}, function(data)
    {
      
        $scope.tramitecerestado=data.tramitecerestado;
          
      if ($scope.tramitecerestado[6].eta_id==7 && $scope.tramitecerestado[6].te_estado=='APROBADO') {
          $scope.ver=true;
      }
      else{
        $scope.ver=false;
      }
console.log("_______sssssssssssssssssss",$scope.tramitecerestado[6].eta_id);
    })


}])


.controller('DetalleTramiteCtrl', ['CONFIG', /*'authUser',*/ '$scope', 'EmpTra', '$route', '$routeParams', 'toastr', '$location','VerTramCer', function (CONFIG,/*authUser,*/$scope,EmpTra,$route,$routeParams,toastr,$location,VerTramCer) {
    
    var et_id = $routeParams.et_id;
    EmpTra.get({et_id:et_id}, function(data)
    {
        console.log('la data-------',data);
        $scope.empresatramite=data.establecimiento;

        $scope.ajustes = {
          menu:{
            titulo: 'Impresión de certificado sanitario',
            items:[
              {nombre:'Establecimientos inspeccionados', enlace:'#/lista-inspeccionados', estilo:''},
              {nombre:'Detalle de trámite', enlace:'', estilo:'active'}
              ]
          },
          pagina:{
            titulo:'Certificado Sanitario - Trámite N°: '+$scope.empresatramite.empresa_tramite.et_numero_tramite
          }
        }

    if ($scope.empresatramite.propietario.pro_tipo=='J') {
      $scope.propietario=$scope.empresatramite.propietario.pjur_razon_social;
      $scope.documento=$scope.empresatramite.propietario.pjur_nit;
    }
    if ($scope.empresatramite.propietario.pro_tipo=='N') {
      $scope.propietario=$scope.empresatramite.propietario.per_nombres+' '+$scope.empresatramite.propietario.per_apellido_primero+' '+$scope.empresatramite.propietario.per_apellido_segundo;
      $scope.documento=$scope.empresatramite.propietario.per_ci+' '+$scope.empresatramite.propietario.per_ci_expedido;
    }
    })
    
    /*$scope.ver=false;*/
    VerTramCer.get({et_id:et_id}, function(data)
    {
      
        $scope.tramitecerestado=data.tramitecerestado;
          
      if ($scope.tramitecerestado[6].eta_id==7 && $scope.tramitecerestado[6].te_estado=='APROBADO') {
          $scope.ver=true;
      }
      else{
        $scope.ver=false;
      }
console.log("_______sssssssssssssssssss",$scope.tramitecerestado[6].eta_id);
    })


}])



.controller('PdfCertificadoCtrl', ['CONFIG', /*'authUser',*/ '$scope', 'EmpTra', '$route', '$routeParams', 'toastr', '$location','FichaInspc','FichaCat','VcertS', function (CONFIG,/*authUser,*/$scope,EmpTra,$route,$routeParams,toastr,$location,FichaInspc,FichaCat,VcertS) {


  var et_id = $routeParams.et_id;
  var FunG = localStorage.getItem("Funcionario");
  var FunG = JSON.parse(FunG);
  var fun_id=FunG.fun_id;//remplaar con la sesion

  $scope.CurrentDate = new Date();
 var mes=$scope.CurrentDate.getMonth()+1;
 var fecha=$scope.CurrentDate.getDate()+"-"+mes+"-"+$scope.CurrentDate.getFullYear();

  
  EmpTra.get({et_id:et_id},function (argument) {
    console.log(argument);
    $scope.empresatra=argument.establecimiento;
    var razon_socialq=$scope.empresatra.establecimiento_sol.ess_razon_social;
    
    if ($scope.empresatra.propietario.pro_tipo=='J') {
      $scope.propietario=$scope.empresatra.propietario.pjur_razon_social;
      $scope.documento=$scope.empresatra.propietario.pjur_nit;
    }
    if ($scope.empresatra.propietario.pro_tipo=='N') {
      $scope.propietario=$scope.empresatra.propietario.per_nombres+' '+$scope.empresatra.propietario.per_apellido_primero+' '+$scope.empresatra.propietario.per_apellido_segundo;
      $scope.documento=$scope.empresatra.propietario.per_ci+' '+$scope.empresatra.propietario.per_ci_expedido;
    }
    $scope.direccion=$scope.empresatra.establecimiento_sol.ess_avenida_calle+' #'+$scope.empresatra.establecimiento_sol.ess_numero+' '+$scope.empresatra.establecimiento_sol.ess_stand
    FichaInspc.get({et_id:et_id},function (argument) { 
      $scope.ficha=argument.ficha_inspeccion;
      FichaCat.get({fi_id:$scope.ficha.fi_id},function (argument) { 
        $scope.fichac=argument.ficha_categoria;//falta sacar categorias
        console.log("__ficha cat___",$scope.fichac);
        VcertS.get({et_id:et_id},function (argument) { 
        $scope.cs=argument.certificado_sanitario;
        console.log("__certif san___",$scope.cs);
       /* var imagenfirma1=$scope.cs.ces_fir_url1+'/'+$scope.cs.ces_fir_nombre1;
        var imagenfirma2=$scope.cs.ces_fir_url2+'/'+$scope.cs.ces_fir_nombre2;
        var imagenfirma3=$scope.cs.ces_fir_url3+'/'+$scope.cs.ces_fir_nombre3;*/
   

       
         var vencimiento=$scope.cs.ces_fecha_fin/*moment($scope.empresatra.empresa_tramite.et_vigencia_documento, 'YYYY-MM-DD').format('DD-MM-YYYY')*/;
            var gober='';
            var sedes='';
            var ifirma1='';
            var ifirma2='';
            var ifirma3='';
            var watermark='';
            var tituloqr='';
            //aumentar datos en textoqr
           
            var razon_social='';
            var clasificacion='';
            var clasificacion2='';
            var clasificacion3='';
            var tipotramite=$scope.empresatra.empresa_tramite.et_tipo_tramite;
            var item='';
            var item2='';
            var item3='';
            var propietario='';
            var direccion='';
            var gestion='';
           
            var nroregistro='';
            var kardex='';

            for (var i = $scope.fichac.length - 1; i >= 0; i--) {
              console.log("este es el i___________",$scope.fichac.length);
              if (i==0) {
                clasificacion =$scope.fichac[i].cat_area+''+$scope.fichac[i].cat_categoria;
                item=$scope.fichac[i].cat_codigo;
                
              }
              if (i==1) {
                var j=i--;
                clasificacion =$scope.fichac[i].cat_area+''+$scope.fichac[i].cat_categoria;
                clasificacion2 =$scope.fichac[j].cat_area+''+$scope.fichac[j].cat_categoria;
                item=$scope.fichac[i].cat_codigo;
                item2=$scope.fichac[j].cat_codigo;
              }
              if (i==2) {
                var j=i--;
                var k=j--;
                clasificacion =$scope.fichac[i].cat_area+''+$scope.fichac[i].cat_categoria;
                clasificacion2 =$scope.fichac[j].cat_area+''+$scope.fichac[j].cat_categoria;
                clasificacion3 =$scope.fichac[k].cat_area+''+$scope.fichac[k].cat_categoria;
                item=$scope.fichac[i].cat_codigo;
                item2=$scope.fichac[j].cat_codigo;
                item3=$scope.fichac[k].cat_codigo;
              }
               var textoqr='USACSIA-CERTIFICADO-SANITARIO '+' '+razon_socialq+' - '+$scope.direccion+' - '+$scope.propietario+' - '+$scope.documento+' /Venc: '+vencimiento+' /Fun: '+$scope.ficha.fun_id+' /Krdx: '+$scope.empresatra.empresa.emp_kardex+'/Cat: '+clasificacion+''+item+''+clasificacion2+''+item2+''+clasificacion3+''+item3;
              
          
/*waterlogoSEDES*/
        var img2 =convertImgToDataURLviaCanvas("./scripts/escudo-gober.png", function(base64Img) {
          gober =base64Img;
          var img3 =convertImgToDataURLviaCanvas("./scripts/logoSEDES.png", function(base64Img) {
            sedes =base64Img;
/*            var img4 =convertImgToDataURLviaCanvas( imagenfirma1, function(base64Img) {
              ifirma1 =base64Img;
             var img4_2 =convertImgToDataURLviaCanvas( imagenfirma2, function(base64Img) {
              ifirma2 =base64Img;
               var img4_3 =convertImgToDataURLviaCanvas( imagenfirma3, function(base64Img) {
              ifirma3 =base64Img;*/
                var img5 =convertImgToDataURLviaCanvas("./images/waterlogoSEDES.png", function(base64Img) {
                  watermark =base64Img;

                var docDefinition = {
                  pageOrientation: 'portrait',
                  pageSize: 'letter',
                  pageMargins: [ 30, 30, 30, 30 ],

                  info: {/*Metadatos*/
                    title: textoqr,
                    author: 'USACSIA-SEDES LA PAZ',
                    subject: 'certificado sanitario'+tituloqr,
                    keywords: 'certificado sanitario',
                    creator: 'USACSIA',
                    producer: 'USACSIA',
                  },
                  content:[
                    {
                      image:gober, width:125, height:125, absolutePosition:{x:30, y:50}
                    },
                    {
                      image:sedes, width:80, height:125, absolutePosition:{x:480, y:50}
                    },
                    {
                      image: watermark, width: 300, height:500, absolutePosition:{x:150, y: 200}
                    },
                    {
                      text:'GOBIERNO AUTÓNOMO DEPARTAMENTAL DE LA PAZ', fontSize: 22, alignment: 'center', color:'#BA0000', bold: true,
                    },
                    {
                      text:'SERVICIO DEPARTAMENTAL DE SALUD', fontSize: 18, alignment: 'center', color:'#BA0000', margin:[0,20,0,0], bold: true,
                    },
                    {
                      text:'UNIDAD DE SALUD AMBIENTAL, CONTROL SANITARIO\n E INOCUIDAD ALIMENTARIA ', fontSize: 13, alignment: 'center', color:'#BA0000', margin:[0,20,0,0]
                    },
                    {
                      text:'CERTIFICADO SANITARIO ', fontSize: 45, bold:true, alignment: 'center', color:'#007E31', margin:[0,30,0,0]
                    },
                    {
                      text: 'Que de conformidad a alos Art. 57 al 70 Capítulo V, del Control Sanitario de Establecimientos Públicos y de alimentos en actual vigencia, El Servicio Departamental de Salud, Autoriza el Funcionamiento de:', fontSize:10, alignment:'center', bold:true, margin:[40,0,40,0]
                    },
                    {
                      table:{
                        
                        widths:[120, 120, 120, 120],
                        body:[
                              [
                                {text: razon_socialq , colSpan:3, alignment:'center', fontSize:34, bold:true,italics: true},
                                {},
                                {},
                                {qr: textoqr, fit:100, alignment: 'right'}
                              ],
                              [
                                {text:'DENOMINACIÓN', colSpan:4, alignment:'center', fontSize:13, bold:true},
                                {},
                                {},
                                {}
                              ],
                              [
                                {text:'CLASIFICACIÓN: ', alignment:'left', bold:true, fontSize:13},

                               {text:clasificacion+' '+clasificacion2+' '+clasificacion3, alignment:'center', bold:true, fontSize:15},
                                {text:'DERECHO DE: ', alignment:'left', bold:true, fontSize:13},
                                {text:tipotramite, alignment:'center', bold:true, fontSize:15},
                              ],
                              [
                                {text:'ITEM: ',alignment:'left', bold:true, fontSize:13},
                                {text:item+' '+item2+' '+item3, alignment:'center', bold:true, colSpan:3, fontSize:15},
                                {},
                                {},
                              ],
                              [
                                {text:'PROPIETARIO: ',alignment:'left', bold:true, fontSize:13},
                                {text:$scope.propietario, alignment:'center', bold:true, colSpan:3, fontSize:15},
                                {},
                                {},
                              ],
                              [
                                {text:'DIRECCIÓN: ',alignment:'left', bold:true, fontSize:13},
                                {text:$scope.direccion, alignment:'center', bold:true, colSpan:3, fontSize:15},
                                {},
                                {},
                              ],
                              [
                                {text:'GESTIÓN: ',alignment:'left', bold:true, fontSize:13},
                                {text:$scope.CurrentDate.getFullYear(), alignment:'center', bold:true, fontSize:15},
                                {text:'VENCIMIENTO: ',alignment:'left', bold:true, fontSize:13},
                                {text:vencimiento, alignment:'center', bold:true, fontSize:15},
                              ],
                              [
                                {text:'N° DE REGISTRO: ',alignment:'left', bold:true, fontSize:13},
                                {text:/*'nroregistro'*/ 1245, alignment:'center', bold:true, fontSize:15},
                                {text:'KARDEX: ',alignment:'left', bold:true, fontSize:13},
                                {text:$scope.empresatra.empresa.emp_kardex, alignment:'center', bold:true, fontSize:15},
                              ],

                        ]
                      },
                      margin:[20, 30, 10, 0],
                      layout: 'noBorders',
                      // layout: 'lightHorizontalLines',
                      border: [false, false, false, false]
                    },
                    {
                      table:{
                        body:[
                              [
                                {text:'NOTA: ',alignment:'left', bold:true, fontSize:13},
                                {text:'Señor Propietario este Certificado deberá estar en un lugar visible Según el Art. 57 del Código de Salud, la renovación es anual y de caracter obligatorio. Se debe prestar la colaboración a los funcionarios del SEDES, debidamente identificados las veces que lo requieran.', alignment:'justify'}
                              ]
                        ]
                      },
                      margin:[20, 30, 10, 0],
                      layout: 'noBorders',
                      border: [false, false, false, false]
                    },
                    /*{
                      table:{
                        widths:[160,160,160],
                        body:[
                                [

                                  {
                                    image:ifirma1, width: 80,  height: 30
                                  },
                                  {
                                    image:ifirma2, width: 60,  height: 30
                                  },
                                  {
                                    image:ifirma3, width: 60,  height: 30
                                  },
                                ]

                        ]
                      },
                      absolutePosition:{x:85, y:690},
                      layout: 'noBorders',
                      border: [false, false, false, false]
                    },*/
                    {
                      table:{
                        widths:[160,160,160],
                        body:[
                                
                                [

                                  {text:'RESPONSABLE\n CERTIFICADO SANITARIO', fontSize:8, bold:true, alignment:'center'},
                                  {text:'JEFE UNIDAD DE SALUD AMBIENTAL, CONTROL SANITARIO E INOCUIDAD ALIMENTARIA', fontSize:8, bold:true, alignment:'center'},
                                  {text:'JEFE DE UNIDAD\n ADMINISTRATIVA FINANCIERA', fontSize:8, bold:true, alignment:'center'}
                                ]

                        ]
                      },
                      absolutePosition:{x:50, y:720},
                      layout: 'noBorders',
                      border: [false, false, false, false]
                    }
                  ]


                }

                $scope.openPdfCES = function() {
                  pdfMake.createPdf(docDefinition).open();
                };

                $scope.downloadPdfCES = function() {
                  pdfMake.createPdf(docDefinition).download();
                };

              });//-----/img5
/*});//----/img4_2
});//----/img4_3

            });//----/img4*/
          });//------/img3
        });//--------/img2

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
}//fin de for
 });/*-----/certificado sanitario*/
 });/*-----/fichaCat*/
 });/*-----/fichaInspc*/
  });/*-----/EmpTra.get*/

   



}])