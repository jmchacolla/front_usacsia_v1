'use strict';
angular.module("adminApp")
.controller('RecaudacionCajaCtrl', ['$scope', 'ReporteCajaCas', 'ReporteCajaCesFrom', 'ReporteCajaCesOrden', '$route', '$resource', '$routeParams', 'toastr', '$location', '$timeout', '$http', 'CONFIG', function ($scope, ReporteCajaCas, ReporteCajaCesFrom, ReporteCajaCesOrden, $route, $resource,$routeParams, toastr, $location, $timeout, $http, CONFIG) {
    $scope.ajustes = {
      menu:{
        titulo: 'Caja',
        items:[
          {nombre:'Parte diario', enlace:'#/parte-diario', estilo:'active'},
          {nombre:'Clasificación de especialidad', enlace:'#clasificacion-especialidad', estilo:''},
          {nombre:'Subclacificación', enlace:'#/subclasificacion', estilo:''},
          {nombre:'Categoria', enlace:'#/categoria', estilo:''}
          ]
      },
      pagina:{
        titulo:'Reporte de caja'
      }
    }
    $scope.fechas={
        fecha1:'',
        fecha2:'',
    }
    $scope.get_rep=function (f1,f2) {
        $scope.fechas={
        fecha1:f1,
        fecha2:f2,
    }
    $scope.totales={
        totalcas:0,
        totalcasbanco:0,
        totalcesform:0,
        totalcesformbanco:0,
        totalorden:0,
        totalordenbanco:0,
        total:0
    }
        ReporteCajaCas.get($scope.fechas,function (argument) {
            $scope.reportecas=argument.reporte;
            $scope.reportecasbanco=argument.reportecasbanco;
            $scope.cantcasbanco=$scope.reportecasbanco.length;
            console.log('$scope.reportecas------', $scope.reportecas);
            console.log('$scope.reportecas------', $scope.reportecasbanco);
            angular.forEach($scope.reportecas, function (value, key) {
               value.pt_fecha_ini=moment(value.pt_fecha_ini, 'YYYY-MM-DD').format('DD-MM-YYYY');
               $scope.totales.totalcas=$scope.totales.totalcas+Number(value.pt_monto);
            });
            angular.forEach($scope.reportecasbanco, function (value, key) {
               value.pt_fecha_ini=moment(value.pt_fecha_ini, 'YYYY-MM-DD').format('DD-MM-YYYY');
               $scope.totales.totalcasbanco=$scope.totales.totalcasbanco+Number(value.pt_monto);
            });
            ReporteCajaCesFrom.get($scope.fechas,function (argument) {
                $scope.reportecesfrom=argument.reporte;
                $scope.reportecesfbanco=argument.reportecesfbanco;
                $scope.cantcesfbanco=$scope.reportecesfbanco.length;
                console.log('$scope.reportecesfrom------', $scope.reportecesfrom);
                angular.forEach($scope.reportecesfrom, function (value, key) {
                   value.et_fecha_ini=moment(value.et_fecha_ini, 'YYYY-MM-DD').format('DD-MM-YYYY');
                   $scope.totales.totalcesform=$scope.totales.totalcesform+Number(value.et_monto);
                });
                angular.forEach($scope.reportecesfbanco, function (value, key) {
                   value.et_fecha_ini=moment(value.et_fecha_ini, 'YYYY-MM-DD').format('DD-MM-YYYY');
                   $scope.totales.totalcesformbanco=$scope.totales.totalcesformbanco+Number(value.et_monto);
                });
                ReporteCajaCesOrden.get($scope.fechas,function (argument) {
                    $scope.reporteorden=argument.reporteorden;
                    $scope.reporteordenbanco=argument.reporteordenbanco;
                    $scope.cantordenbanco=$scope.reporteordenbanco.length;
                    console.log('$scope.reporteorden------', $scope.reporteorden);
                    angular.forEach($scope.reporteorden, function (value, key) {
                       value.op_fecha_pagado=moment(value.op_fecha_pagado, 'YYYY-MM-DD').format('DD-MM-YYYY');
                       $scope.totales.totalorden=$scope.totales.totalorden+Number(value.op_monto_total);
                    });
                    angular.forEach($scope.reporteordenbanco, function (value, key) {
                       value.op_fecha_pagado=moment(value.op_fecha_pagado, 'YYYY-MM-DD').format('DD-MM-YYYY');
                       $scope.totales.totalordenbanco=$scope.totales.totalordenbanco+Number(value.op_monto_total);
                    });
                    $scope.totales.total=$scope.totales.totalcas+ $scope.totales.totalcasbanco+$scope.totales.totalcesform+$scope.totales.totalcesformbanco+$scope.totales.totalorden+$scope.totales.totalordenbanco;
                })
            })
        })
        
        
        
    }
    
}])