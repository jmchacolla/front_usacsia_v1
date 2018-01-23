'use strict';
angular.module("adminApp")

.controller('PlantillaPDFCtrl', ['CONFIG', /*'authUser',*/ '$scope', 'EmpTra', '$route', '$routeParams', 'toastr', '$location', function (CONFIG,/*authUser,*/$scope,EmpTra,$route,$routeParams,toastr,$location) {



$scope.ajustes = {
      menu:{
        titulo: 'Gestion de Pruebas Medicas',
        items:[
          {nombre:'Ver tutorial', enlace:'http://pdfmake.org/playground.html'}]
      },
      pagina:{
        titulo:'http://pdfmake.org/playground.html'
      }
    }
  var et_id = $routeParams.et_id;
  var FunG = localStorage.getItem("Funcionario");
  var FunG = JSON.parse(FunG);
  var fun_id=FunG.fun_id;//remplaar con la sesion

  
  EmpTra.get({et_id:et_id},function (argument) {
    console.log(argument);
    $scope.empresatra=argument.establecimiento;


        var gober='';
        var sedes='';
        var ifirma='';
        var watermark='';
        var tituloqr='';
        var textoqr='';
        var razon_social='';
        var clasificacion='';
        var tipotramite='';
        var item='';
        var propietario='';
        var direccion='';
        var gestion='';
        var vencimiento='';
        var nroregistro='';
        var kardex='';

        var autor='';
        var fecha='';
        var periodo='';


        var img2 =convertImgToDataURLviaCanvas("./scripts/escudo-gober.png", function(base64Img) {
          gober =base64Img;
          var img3 =convertImgToDataURLviaCanvas("./scripts/logoSEDES.png", function(base64Img) {
            sedes =base64Img;
            /*var img4 =convertImgToDataURLviaCanvas( 'imagenfirma', function(base64Img) {
              ifirma =base64Img;*/
                var img5 =convertImgToDataURLviaCanvas("./images/waterlogoSEDES.png", function(base64Img) {
                  watermark =base64Img;

                var docDefinition = {
                  pageOrientation: 'portrait',
                  pageSize: 'letter',
                  pageMargins: [ 30, 30, 30, 30 ],

                  info: {/*Metadatos*/
                    title: 'textoqr',
                    author: 'USACSIA-SEDES LA PAZ',
                    subject: 'certificado sanitario'+tituloqr,
                    keywords: 'certificado sanitario',
                    creator: 'USACSIA',
                    producer: 'USACSIA',
                  },
                  content:[
                    {
                      image:gober, width:50,/* height:125,*/ absolutePosition:{x:30, y:30}
                    },
                    {
                      image:sedes, width:30, /*height:125,*/ absolutePosition:{x:550, y:30}
                    },
                    {
                      image: watermark, width: 300, height:500, absolutePosition:{x:150, y: 200}
                    },
                    {
                      text:'GOBIERNO AUTÓNOMO DEPARTAMENTAL DE LA PAZ', fontSize: 12, alignment: 'center', color:'#BA0000', bold: true,
                    },
                    {
                      text:'SERVICIO DEPARTAMENTAL DE SALUD', fontSize: 12, alignment: 'center', color:'#BA0000', margin:[0,0,0,0], bold: true,
                    },
                    {
                      text:'UNIDAD DE SALUD AMBIENTAL, CONTROL SANITARIO E INOCUIDAD ALIMENTARIA ', fontSize: 12, alignment: 'center', color:'#BA0000', margin:[0,0,0,0]
                    },
                    {
                      text:'ÁREA DE CERTIFICADO SANITARIO ', fontSize: 12, bold:true, alignment: 'center', color:'#007E31', margin:[0,0,0,0]
                    },
                    {
                      table:{
                        widths:[120, 120, 120, 120],
                        body:[
                                [
                                  {text:'Nombre:'},
                                  {text:'autor'},
                                  {text:'Fecha:'},
                                  {text:'fecha'}
                                ],
                                [
                                  {text:'Periodo:'},
                                  {text:'periodo'},
                                  {text:''},
                                  {text:''}
                                ],
                        ]
                      },
                      margin:[20, 30, 10, 0],
                      layout: 'noBorders',
                      border: [false, false, false, false]
                    },
                    {
                      table:{
                        
                        widths:[120, 120, 120, 120],//------anchode las columnas
                        body:[
                              [
                                {text:'RAZON SOCIAL RAZON SOCIAL RAZON SOCIAL', alignment:'right', fontSize:12, bold:true,italics: true},
                                {text:'text'},
                                {text:'text'},
                                {text:'right'}
                              ],
                              [
                                {text:'DENOMINACIÓN', colSpan:4, alignment:'center', fontSize:12, bold:true},
                                {text:'text'},
                                {text:'text'},
                                {text:'text'}
                              ],
                              [
                                {text:'CLASIFICACIÓN: ', alignment:'left', bold:true, fontSize:12},
                                {text:'clasificacion', alignment:'center', bold:true, fontSize:12},
                                {text:'DERECHO DE: ', alignment:'left', bold:true, fontSize:12},
                                {text:'tipotramite', alignment:'center', bold:true, fontSize:12},
                              ],
                              [
                                {text:'ITEM: ',alignment:'left', bold:true, fontSize:12},
                                {text:'item', alignment:'center', bold:true, colSpan:3, fontSize:12},
                                {},
                                {},
                              ],
                              [
                                {text:'PROPIETARIO: ',alignment:'left', bold:true, fontSize:12},
                                {text:'propietario', alignment:'center', bold:true, colSpan:3, fontSize:12},
                                {},
                                {},
                              ],
                              [
                                {text:'DIRECCIÓN: ',alignment:'left', bold:true, fontSize:12},
                                {text:'direccion', alignment:'center', bold:true, colSpan:3, fontSize:12},
                                {},
                                {},
                              ],
                              [
                                {text:'GESTIÓN: ',alignment:'left', bold:true, fontSize:12},
                                {text:'gestion', alignment:'center', bold:true, fontSize:12},
                                {text:'VENCIMIENTO: ',alignment:'left', bold:true, fontSize:12},
                                {text:'vencimiento', alignment:'center', bold:true, fontSize:12},
                              ],
                              [
                                {text:'N° DE REGISTRO: ',alignment:'left', bold:true, fontSize:12},
                                {text:'nroregistro', alignment:'center', bold:true, fontSize:12},
                                {text:'KARDEX: ',alignment:'left', bold:true, fontSize:12},
                                {text:'kardex', alignment:'center', bold:true, fontSize:12},
                              ],

                        ]
                      },
                      margin:[20, 30, 10, 0],
                      // layout: 'noBorders',
                      // layout: 'lightHorizontalLines',
                      // border: [false, false, false, false]
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

                $scope.openPlantillapdf = function() {
                  pdfMake.createPdf(docDefinition).open();
                };

                $scope.dowPlantillapdf = function() {
                  pdfMake.createPdf(docDefinition).download();
                };

              });//-----/img5
            /*});//----/img4*/
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



  });/*-----/EmpTra.get*/

   



}])