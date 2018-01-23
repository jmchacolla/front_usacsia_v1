'use strict';
angular.module("adminApp")

/*CRAEAR PERSONA TRAMITE---- BUSQUEDA POR CI*/
/*.controller('CrearCarnetSanitarioCtrl', ['$scope', '$route','CarnetSanitario','Tramite' ,'toastr', '$location', function ($scope, $route, CarnetSanitario,Tramite,toastr, $location){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestion de Carnés Sanitario',
      items:[
      {nombre:'Solicitudes de Carné Sanitario', enlace:'#/tramites-car', estilo:''}]
    },
    pagina:{
      titulo:'Registrar Pago'
    }
  }
 
    $scope.persona_tramite={
      tra_id:null, 
      per_id:null,
      // pt_fecha_ini :"",
      pt_monto:null,
      pt_tipo_tramite:""
    };

    $scope.CurrentDate = new Date();
    Tramite.get(function(data){
    $scope.tramite = data.tramites;
    console.log("tramite del get",$scope.tramite);

      $scope.monto = function(costo){
          $scope.persona_tramite.pt_monto=costo;  
      }
    })

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
    console.log('la persona-tramite que se va a cerar', $scope.persona_tramite);
    PersonaTramite.save($scope.persona_tramite).$promise.then(function(data)
    {
      console.log('el data', data);

        if(data.mensaje){
          toastr.success('Pago registrado correctamente'+data.persona_tramite.pt_id+' es');
               $location.path('/boleta-pago/'+data.persona_tramite.pt_id);

        }
    })
  }

   $scope.ver=false;
}])*/


.controller('CarneSanitarioCtrl', ['$scope', 'PersonaTramite', '$route', 'toastr', '$location', '$routeParams', function ($scope, PersonaTramite, $route, toastr,$location, $routeParams) {

        

        var pt_id = $routeParams.pt_id;
        PersonaTramite.get({pt_id:pt_id}, function(data)
        {
            console.log(data);
            $scope.personatramite=data.pertramite;

            $scope.ajustes = {
              menu:{
                titulo: 'Impresión de carné sanitario',
                items:[
                  {nombre:'Ciudadanos Registrados', enlace:'#/persona-usacsia', estilo:'active'}]
              },
              pagina:{
                titulo:'Registro de Carné Sanitario trámite N°: '+$scope.personatramite.persona_tramite.pt_id
              }
            }

        })

}])


.controller('pdf_carneCtrl',['$scope', 'PersonaTramite', 'CONFIG','$routeParams', '$http','FirmaFun','VerCas', function ($scope, PersonaTramite, CONFIG, $routeParams, $http,FirmaFun,VerCas){
  // prepare the document definition using declarative approach
    var id = $routeParams.pt_id;
    console.log("IDEDESS",id);
   /* var id=8;*/
    var FunG = localStorage.getItem("Funcionario");
  var FunG = JSON.parse(FunG);
  var fun_id=FunG.fun_id;//remplaar con la sesion
    PersonaTramite.get({pt_id:id}, function(data)
    {
      $scope.persona = data.pertramite;
      $scope.per = data.pertramite;
      console.log('persona-----------', $scope.persona);
      console.log('imagen-----------', $scope.persona.imagen/*[0]*/.ima_enlace+'/'+$scope.persona.imagen/*[0]*/.ima_nombre);
      VerCas.get({pt_id:id}, function(data)
    {
      $scope.carnet = data.carnet_sanitario;
      // var ff=$scope.carnet.cas_fecha_fin;
      // console.log(data.carnet_sanitario,"___________________________________________________________Fecha____",ff)
      var fechapago= $scope.persona.persona_tramite.pt_fecha_ini;
      var fecha_cont=moment(new Date(), "YYYY-MM-DD") .format("DD-MM-YYYY");
      var horaC=fecha_cont[1];
      var fechaCONT = moment(fecha_cont,"DD-MM-YYYY").format("DD-MM-YYYY");
      var firma_acomp = "FIRMA USUARIO";
      var ipersona="";
      var gober="";
      var sedes="";
      var ifirma="";
      var vigencia=moment($scope.persona.persona_tramite.pt_vigencia_documento, 'YYYY-MM-DD').format('DD-MM-YYYY');
      var nacimiento=moment( $scope.persona.persona.per_fecha_nacimiento, 'YYYY-MM-DD').format('DD-MM-YYYY');
      var imagenpersona=$scope.persona.imagen/*[0]*/.ima_enlace+'/'+$scope.persona.imagen/*[0]*/.ima_nombre;
      /*FirmaFun.get({fun_id:fun_id}, function(data)
      {
        $scope.firmas=data.firma;
        var imagenfirma=$scope.firmas.firma.fir_url+'/'+$scope.firmas.firma.fir_name;
        console.log('imagen firma-----------', imagenfirma);
*/

      var img1 =convertImgToDataURLviaCanvas( imagenpersona, function(base64Img) {
        ipersona =base64Img;
        var img2 =convertImgToDataURLviaCanvas("./scripts/escudo-gober.png", function(base64Img) {
          gober =base64Img;
          var img3 =convertImgToDataURLviaCanvas("./scripts/logoSEDES.png", function(base64Img) {
            sedes =base64Img;
             // var img4 =convertImgToDataURLviaCanvas( imagenfirma, function(base64Img) {
               // ifirma =base64Img;
            console.log("entro al controlador pdf---------",$scope.persona,$scope.firmas);

            var tituloqr= 'Nro. Trámite: '+$scope.persona.persona_tramite.pt_numero_tramite;
            var textoqr= 'USACSIA-CARNÉ-SANITARIO-'+$scope.persona.persona.per_nombres+" "+$scope.persona.persona.per_apellido_primero+" "+$scope.persona.persona.per_apellido_segundo+'-'+$scope.persona.persona.per_ci+'-'+$scope.persona.persona.per_ci_expedido+'/T'+$scope.persona.persona_tramite.pt_numero_tramite+'/Venc:'+vigencia;

            var docDefinition = {
                
                pageOrientation: 'landscape',
                pageSize: 'A8',
                pageMargins: [ 5, 5, 5, 5 ],
                info: {/*Metadatos*/
                  title: textoqr,
                  author: 'USACSIA-SEDES LA PAZ',
                  subject: 'carne sanitario'+tituloqr,
                  keywords: 'carne sanitario',
                  creator: 'USACSIA',
                  producer: 'USACSIA',
                  },
                content: [
                        {
                          table: {
                            widths: [30, 125, 30],
                            body: [
                              [
                                {
                                  image: gober,
                                  width: 40,
                                  height: 40
                                },
                                {
                                  text: "\n GOBIERNO AUTONOMO DEPARTAMENTAL DE LA PAZ \n SERVICIO DEPARTAMENTAL DE SALUD \n UNIDAD DE SALUD AMBIENTAL \n CONTROL SANITARIO E INOCUIDAD ALIMENTARIA ",
                                  alignment: 'center',
                                  style: 'header',
                                  color:'#0B8300' 
                                },
                                {
                                  image: sedes,
                                  width: 22,
                                  height: 40
                                }
                              ],
                            ],
                          },
                          layout: 'noBorders',
                          style: 'cuerpo',
                          border: [false, false, false, false]

                        },
                        {
                            table:{
                                widths:[25, 110, 40],
                                body:[
                                        [
                                            {
                                                text:''
                                            },
                                            {
                                               text: '      CARNÉ SANITARIO', fontSize: 9, alignment: 'center', color:'#BA0000'
                                            },
                                            {
                                                text:'Bs. 25,00', fontSize:9, alignment:'right', color:'#BA0000'
                                            }
                                        ],
                                ],
                            },
                            layout: 'noBorders',
                            border: [false, false, false, false]
                        },

                        {
                            table:{
                                widths:[50, 85, 35],
                                heights: [20, 100],
                                body:[
                                    [
                                        {
                                          rowSpan:2,
                                          image: ipersona,
                                          width: 50,
                                          height: 60
                                        },
                                        {
                                          text:[
                                                  {
                                                      text:'Nombres: ', bold:true, fontSize:6
                                                  },
                                                  {
                                                      text:$scope.persona.persona.per_nombres+" "+$scope.persona.persona.per_apellido_primero+" "+$scope.persona.persona.per_apellido_segundo+'\n ', fontSize:6
                                                  },
                                                  {
                                                      text:'C.I.: ', bold:true, fontSize:6
                                                  },
                                                  {
                                                     text: $scope.persona.persona.per_ci+'  '+$scope.persona.persona.per_ci_expedido+'\n', fontSize: 6
                                                  },
                                                  {
                                                      text:'Nacimiento: ', bold:true, fontSize:6
                                                  },
                                                  {
                                                     text:nacimiento+'\n', fontSize: 6
                                                  },
                                                  {
                                                      text:'Vigencia:  ', bold:true, fontSize:6
                                                  },
                                                  {
                                                      text: vigencia /*ff*/, bold:true, fontSize:5
                                                  },
                                          ]
                                        },
                                        {
                                            rowSpan:2,
                                            qr: textoqr, fit:65,
                                            alignment: 'right'
                                        },
                                    ],
                                    [ '',
                                      // {
                                      //   image: ifirma,
                                      //   width: 60,
                                      //   height: 30,
                                      //   align:'center',
                                      //   absolutePosition: {x: 85, y: 110}
                                      // }
                                      ''
                                    ],
                                ],
                            },
                            layout: 'noBorders',
                            border: [false, false, false, false]
                        },
                        {
                          text:'Firma Jefe Unidad',
                          align:' center',
                          absolutePosition:{x:100, y:135},
                          fontSize: 3
                        }
                ],
                styles: {
                  header: {
                    bold: true,
                    color: '#000',
                    fontSize: 5
                  },
                  cuerpo: {
                    color: '#000',
                    fontSize: 6
                  },
                  cuerpo1: {
                    color: '#000',
                    fontSize: 5
                  },
                  demoTable: {
                    color: '#666',
                    fontSize: 8
                  },
                  tableHeader: {
                    bold: true,
                    fontSize: 8,
                    color: 'black'
                  },
                  tableExample: {
                    margin: [0, 5, 0, 10]
                  }
                }
             };       

              $scope.openPdf = function() {
                pdfMake.createPdf(docDefinition).open();
              };

              $scope.downloadPdf = function() {
                pdfMake.createPdf(docDefinition).download();
              };
 
            // });//fin imagen firma
          });//fin imagen logoSEDES
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
      /*});//fin firma funcionario get*/
});// ============  FIN carnet.get
    });// ============  FIN persona tramite.get

}])

