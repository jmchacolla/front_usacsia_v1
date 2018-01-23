'use strict';
angular.module("adminApp")

.controller('FunPdfController', ['$scope', '$http', 'i18nService','$route','uiGridExporterConstants', function ($scope, $http, i18nService, $route, uiGridExporterConstants) {
 $scope.mensaje="hola";
 
  i18nService.setCurrentLang('es');
  $scope.gridOptions = {};
  $scope.var = false;
  
  $scope.gridOptions = {
     columnDefs: [
              { field: 'per_nombres', name: 'NOMBRES' },
              { field: 'per_apellido_primero', name: 'Apellido Primero' },
              { field: 'per_apellido_segundo', name: 'Apellido Segundo' },
              { field: 'fun_cargo', name: 'CARGO' }
            ],

    enableGridMenu: false,
    exporterPdfHeader :    {
            margin: [50,30,50,0],
            alignment: 'left',

           
            columns: [
              {
                fontSize: 12,
                width: 'auto',
                margin: [0,0,5,0],    
                text: 'LISTA DE FUNCIONARIOS \n INFORMACION',
                image: 'sedes.jpg'
                
              },
              {
                fontSize: 12,
                width: 'auto',
                text: 'RESULTADOS'

              }
            ]
          },
           styles: {
      header: {
        bold: true,
        color: '#000',
        fontSize: 11
      },
      demoTable: {
        color: '#666',
        fontSize: 10
      }

    },
    exporterPdfCustomFormatter: function ( docDefinition ) {
      docDefinition.pageMargins = [ 50, 100, 50, 60 ];
      docDefinition.styles.headerStyle = { fontSize: 16, bold: true , margin: [40,10,0,0]};
      docDefinition.styles.footerStyle = { fontSize: 10, bold: true , margin: [20,0,0,0] };
      return docDefinition;
    },
    enableSorting: false,
    enableRowSelection: false,
    enableFullRowSelection: false,
    multiSelect: false,
    enableRowHeaderSelection: false,
    enableColumnMenus: false,
    enableFiltering: false,
    //minRowsToShow: $scope.gridOptions.length+1,
    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'blue-green'},
    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
    }
  };
  


  /*Funcionarios1.get(function(data){
    $scope.gridOptions.data = data.funcionario;
  });
*/
  $http.get('http://190.181.60.19/api_awebss/public/funcionarios')
  .success(function(data) {
    $scope.gridOptions.data = data.funcionario;
  });


  $scope.exportPdf1 = function () {
    console.log('exporting to pdf...');
    // var myElement = angular.element(document.querySelectorAll(".custom-pdf-link-location"));
    $scope.gridApi.exporter.pdfExport('all', 'all', '');

  };
  
}])

.controller('PacPdfController', ['$scope', '$http', 'i18nService','$route','uiGridExporterConstants', function ($scope, $http, i18nService, $route, uiGridExporterConstants) {
 $scope.mensaje="hola";
 
  i18nService.setCurrentLang('es');
  $scope.gridOptions = {};
  $scope.var = false;
  
  $scope.gridOptions = {
     columnDefs: [
              { field: 'per_nombres', name: 'NOMBRES' },
              { field: 'per_apellido_primero', name: 'Apellido Primero' },
              { field: 'per_apellido_segundo', name: 'Apellido Segundo' },
              { field: 'pac_hist_clinico', name: 'Codigo Historial' }
            ],

    enableGridMenu: false,
    exporterPdfHeader :    {
            margin: [50,30,50,0],
            alignment: 'left',
           
            columns: [
              {
                fontSize: 12,
                //width: 'auto',
                //margin: [0,0,5,0],    
                text: 'LISTA DE PACIENTES \n INFORMACION',
                alignment: 'center'
                
              },
              {
                fontSize: 12,
                width: 'auto',
                text: ''
              }
            ]
          },
           styles: {
      header: {
        bold: true,
        color: '#000',
        fontSize: 11
      },
      demoTable: {
        color: '#666',
        fontSize: 10
      }

    },
    exporterPdfCustomFormatter: function ( docDefinition ) {
      docDefinition.pageMargins = [ 50, 100, 50, 60 ];
      docDefinition.styles.headerStyle = { fontSize: 16, bold: true , margin: [40,10,0,0]};
      docDefinition.styles.footerStyle = { fontSize: 10, bold: true , margin: [20,0,0,0] };
      return docDefinition;
    },
    enableSorting: false,
    enableRowSelection: false,
    enableFullRowSelection: false,
    multiSelect: false,
    enableRowHeaderSelection: false,
    enableColumnMenus: false,
    enableFiltering: false,
    //minRowsToShow: $scope.gridOptions.length+1,
    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'blue-green'},
    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
    }
  };

  $http.get('http://190.181.60.19/api_awebss/public/pacientes')
  .success(function(data) {
    $scope.gridOptions.data = data.paciente;
  });


  $scope.exportPdf1 = function () {
    console.log('exporting to pdf...');
    // var myElement = angular.element(document.querySelectorAll(".custom-pdf-link-location"));
    $scope.gridApi.exporter.pdfExport('all', 'all', '');

  };
  
}])


.controller('EstPdfController', ['$scope', '$http', 'i18nService','$route','uiGridExporterConstants', function ($scope, $http, i18nService, $route, uiGridExporterConstants) {
 $scope.mensaje="hola";
 
  i18nService.setCurrentLang('es');
  $scope.gridOptions = {};
  $scope.var = false;
  
  $scope.gridOptions = {
     columnDefs: [
              { field: 'es_nombre', name: 'Nombre' },
              { field: 'es_nivel', name: 'Nivel' },
              { field: 'es_nit', name: 'NIT' }
            ],

    enableGridMenu: false,
    exporterPdfHeader :    {
            margin: [50,30,50,0],
            alignment: 'left',
           
            columns: [
              {
                fontSize: 12,
                //width: 'auto',
                //margin: [0,0,5,0],    
                text: 'LISTA DE ESTABLECIMIENTOS DE SALUD \n INFORMACION',
                alignment: 'center'
                
              },
              {
                fontSize: 12,
                width: 'auto',
                text: ''
              }
            ]
          },
           styles: {
      header: {
        bold: true,
        color: '#000',
        fontSize: 11
      },
      demoTable: {
        color: '#666',
        fontSize: 10
      }

    },
    exporterPdfCustomFormatter: function ( docDefinition ) {
      docDefinition.pageMargins = [ 50, 100, 50, 60 ];
      docDefinition.styles.headerStyle = { fontSize: 16, bold: true , margin: [40,10,0,0]};
      docDefinition.styles.footerStyle = { fontSize: 10, bold: true , margin: [20,0,0,0] };
      return docDefinition;
    },
    enableSorting: false,
    enableRowSelection: false,
    enableFullRowSelection: false,
    multiSelect: false,
    enableRowHeaderSelection: false,
    enableColumnMenus: false,
    enableFiltering: false,
    //minRowsToShow: $scope.gridOptions.length+1,
    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'blue-green'},
    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
    }
  };

  $http.get('http://190.181.60.19/api_awebss/public/establecimiento_salud')
  .success(function(data) {
    $scope.gridOptions.data = data.establecimiento;
  });


  $scope.exportPdf1 = function () {
    console.log('exporting to pdf...');
    // var myElement = angular.element(document.querySelectorAll(".custom-pdf-link-location"));
    $scope.gridApi.exporter.pdfExport('all', 'all', '');

  };
  
}])




/*.controller('f_pdf', ['$scope', 'Funcionario', '$route', function($scope, Funcionario, $route){
var generatePDF = function() {
  kendo.drawing.drawDOM($("#formConfirmation")).then(function(group) {
    kendo.drawing.pdf.saveAs(group, "Converted PDF.pdf");
  });
}


   
   html2canvas(document.getElementById('exportthis'), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,
                    }]
                };
                pdfMake.createPdf(docDefinition).download("Score_Details.pdf");
            }
        });

}])*/



;