'use-strict';
angular.module("adminApp")
//c7
.controller('ReporteParasitoController', ['$http','CONFIG','$scope','Ficha', '$route', 'toastr', 'Reportes',
  function ($http,CONFIG,$scope,Ficha, $route, toastr, Reportes){
  $scope.user = {
    rol_id: CONFIG.ROL_CURRENT_USER
  }
  if ($scope.user.rol_id==11) {
  $scope.ajustes = {
    menu:{
      titulo: 'Reportes',
      items:[
        {nombre:'Informe mensual', enlace:'#/reportes/parasitos', estilo:'active'},   ///c7
        /*{nombre:'Reportes de signos vitales', enlace:'#/reportes/signosvitales', estilo:''},*/
        {nombre:'Reportes observados por dia', enlace:'#/reportes/observadosdia', estilo:''},
       /* {nombre:'Informe diario', enlace:'#/reportes/informedia', estilo:''},*/  //c6
        {nombre:'Control diario', enlace:'#/reportes/controldiario', estilo:''} //c3
      ]
    },
    pagina:{
      titulo:'Informe mensual'
    }
  }
 }else if ($scope.user.rol_id==7) {
      $scope.ajustes = {
    menu:{
      titulo: 'Reportes',
      items:[
        {nombre:'Informe mensual', enlace:'#/reportes/parasitos', estilo:'active'},   ///c7
        // {nombre:'Reportes de signos vitales', enlace:'#/reportes/signosvitales', estilo:''},
        {nombre:'Reportes observados por dia', enlace:'#/reportes/observadosdia', estilo:''},
        {nombre:'Informe diario', enlace:'#/reportes/informedia', estilo:''},  //c6
        {nombre:'Control diario', enlace:'#/reportes/controldiario', estilo:''} //c3
      ]
    },
    pagina:{
      titulo:'Informe mensual'
    }
  }
 }
  $scope.fecha_ini1 = null;
  $scope.fecha_fin1 = null;
  $scope.show = false;

  $scope.get_rep=function(fecha1, fecha2){
      var fecha1 = moment(fecha1,"DD-MM-YYYY").format("YYYY-MM-DD");
      var fecha2 = moment(fecha2,"DD-MM-YYYY").format("YYYY-MM-DD");

      $scope.fecha={
        fecha1:fecha1,
        fecha2:fecha2
      }

      Reportes.get($scope.fecha).$promise.then(function(data){
          $scope.parasitos = data.parasitos;
          $scope.observados = data.observados;
          $scope.pacientes = data.pacientes;

          if($scope.pacientes.length > 0){
            for(var i in $scope.pacientes) {
              $scope.pacientes[i].fecha = moment($scope.pacientes[i].fecha,"YYYY-MM-DD").format("DD-MM-YYYY");
              console.log("fecha "+ $scope.pacientes[i].fecha);
            }
          }        

          if($scope.observados.length > 0){
              $scope.nro_observados = $scope.observados[0].nro_observados;
              $scope.nro_noobservados = $scope.observados[0].nro_noobservados;
          }
          if($scope.parasitos.length > 0){
               $scope.show=true;
          }
          //
          $scope.cont = 0;
          for (var i = 0; i < $scope.parasitos.length; i++) {
              $scope.cont = $scope.parasitos[i].cantidad + $scope.cont;
          };

          $scope.total_pac=0;
          for (var i = 0; i < $scope.pacientes.length; i++) {
            $scope.total_pac = $scope.pacientes[i].usacsia + $scope.total_pac;
          }
      });
  }
}])

//c2
.controller('ReporteSignosVitalesController', ['$http','CONFIG','$scope','Ficha', '$route', 'toastr', 'Reportes',
  function ($http,CONFIG,$scope,Ficha, $route, toastr, Reportes){
    $scope.user = {
    rol_id: CONFIG.ROL_CURRENT_USER
  }
  if ($scope.user.rol_id==9 || $scope.user.rol_id==10) {
  $scope.ajustes = {
    menu:{
      titulo: 'Reportes',
      items:[
        /*{nombre:'Informe mensual', enlace:'#/reportes/parasitos', estilo:''},*/   ///c7
        {nombre:'Reportes de signos vitales', enlace:'#/reportes/signosvitales', estilo:'active'},
       /* {nombre:'Reportes observados por dia', enlace:'#/reportes/observadosdia', estilo:''},
        {nombre:'Informe diario', enlace:'#/reportes/informedia', estilo:''},  //c6
        {nombre:'Control diario', enlace:'#/reportes/controldiario', estilo:''} *///c3
      ]
    },
    pagina:{
      titulo:'Reportes de signos vitales'
    }
  }
}else if ($scope.user.rol_id==7) {
      $scope.ajustes = {
    menu:{
      titulo: 'Reportes',
      items:[
        {nombre:'Informe mensual', enlace:'#/reportes/parasitos', estilo:''},   ///c7
        // {nombre:'Reportes de signos vitales', enlace:'#/reportes/signosvitales', estilo:'active'},
        {nombre:'Reportes observados por dia', enlace:'#/reportes/observadosdia', estilo:''},
        {nombre:'Informe diario', enlace:'#/reportes/informedia', estilo:''},  //c6
        {nombre:'Control diario', enlace:'#/reportes/controldiario', estilo:''} //c3
      ]
    },
    pagina:{
      titulo:'Informe mensual'
    }
  }
 }
  $scope.fechas={
    fecha1 : null,
    fecha2 : null
  }
  $scope.show = false;
   var FunG = localStorage.getItem("Funcionario");
  var FunG = JSON.parse(FunG);
  var fun_id = FunG.fun_id;

  var FunG=localStorage.getItem('Funcionario');
  var FunG=JSON.parse(FunG);
  var fun_id=FunG.fun_id;

  $scope.get_rep=function(fecha1, fecha2){
      var fecha1 = moment(fecha1,"DD-MM-YYYY").format("YYYY-MM-DD");
      var fecha2 = moment(fecha2,"DD-MM-YYYY").format("YYYY-MM-DD");
      $scope.fecha={
        fecha1: fecha1,
        fecha2: fecha2,
        fun_id: fun_id
      }

    Reportes.save($scope.fecha).$promise.then(function(data)
    {
      $scope.fichas = data.ficha;
      if($scope.fichas.length > 0){
          $scope.show = true;

          for(var i in $scope.fichas) {
            $scope.fichas[i].fecha = moment($scope.fichas[i].fecha,"YYYY-MM-DD").format("DD-MM-YYYY");
          }
      }
    });
  }
}])

//c4
.controller('ReporteObservadosDiaController', ['$http','CONFIG','$scope','Ficha', '$route', 'toastr', 'Reportes',
  function ($http,CONFIG,$scope,Ficha, $route, toastr, Reportes){
  $scope.user = {
    rol_id: CONFIG.ROL_CURRENT_USER
  }
  if ($scope.user.rol_id==11) {
  $scope.ajustes = {
    menu:{
      titulo: 'Reportes',
      items:[
        {nombre:'Informe mensual', enlace:'#/reportes/parasitos', estilo:''},   ///c7
        /*{nombre:'Reportes de signos vitales', enlace:'#/reportes/signosvitales', estilo:''},*/
        {nombre:'Reportes observados por dia', enlace:'#/reportes/observadosdia', estilo:'active'},
       /* {nombre:'Informe diario', enlace:'#/reportes/informedia', estilo:''}, *///c6
        {nombre:'Control diario', enlace:'#/reportes/controldiario', estilo:''} //c3
      ]
    },
    pagina:{
      titulo:'Reportes observados por dia'
    }
  }
}else if ($scope.user.rol_id==7) {
      $scope.ajustes = {
    menu:{
      titulo: 'Reportes',
      items:[
        {nombre:'Informe mensual', enlace:'#/reportes/parasitos', estilo:''},   ///c7
        // {nombre:'Reportes de signos vitales', enlace:'#/reportes/signosvitales', estilo:''},
        {nombre:'Reportes observados por dia', enlace:'#/reportes/observadosdia', estilo:'active'},
        {nombre:'Informe diario', enlace:'#/reportes/informedia', estilo:''},  //c6
        {nombre:'Control diario', enlace:'#/reportes/controldiario', estilo:''} //c3
      ]
    },
    pagina:{
      titulo:'Informe mensual'
    }
  }
 }
  var fecha_hoy = new Date();
  $scope.hoy = moment(fecha_hoy,"YYYY-MM-DD").format("DD-MM-YYYY");
  console.log("funcion submit  fecha de hoy ",$scope.hoy);

  Reportes.update({rep_id:1}).$promise.then(function(data)
  {
    $scope.observados = data.observados;
    if($scope.observados.length > 0){

    }
  })
}])

//c6
.controller('ReporteInformeDiaController', ['$http','CONFIG','$scope','Ficha', '$route', 'toastr', 'Reportes',
  function ($http,CONFIG,$scope,Ficha, $route, toastr, Reportes){
  $scope.ajustes = {
    menu:{
      titulo: 'Reportes',
      items:[
        {nombre:'Informe mensual', enlace:'#/reportes/parasitos', estilo:''},   ///c7
        // {nombre:'Reportes de signos vitales', enlace:'#/reportes/signosvitales', estilo:''},
        {nombre:'Reportes observados por dia', enlace:'#/reportes/observadosdia', estilo:''},
        {nombre:'Informe diario', enlace:'#/reportes/informedia', estilo:'active'}, ///c6
        {nombre:'Control diario', enlace:'#/reportes/controldiario', estilo:''} //c3
      ]
    },
    pagina:{
      titulo:'Reportes Informe diario'
    }
  }

  var fecha_hoy = new Date();
  $scope.hoy = moment(fecha_hoy,"YYYY-MM-DD").format("DD-MM-YYYY");
  console.log("funcion submit  fecha de hoy ",$scope.hoy);

  Reportes.delete({rep_id:1}).$promise.then(function(data){
    $scope.carnets = data.carnet_sanitario;
    if($scope.carnets.length > 0){
      for(var i in $scope.carnets) {
        $scope.carnets[i].per_fecha_nacimiento = moment($scope.carnets[i].per_fecha_nacimiento,"YYYY-MM-DD").format("DD-MM-YYYY");
        console.log("fecha "+ $scope.carnets[i].per_fecha_nacimiento);
      }
    }
  }) 

}])

//c3
.controller('ReporteControlDiarioController', ['$http','CONFIG','$scope','Ficha', '$route', 'toastr', 'Reportes',
  function ($http,CONFIG,$scope,Ficha, $route, toastr, Reportes){
     $scope.user = {
    rol_id: CONFIG.ROL_CURRENT_USER
  }
  if ($scope.user.rol_id==11) {
  $scope.ajustes = {
    menu:{
      titulo: 'Reportes',
      items:[
        {nombre:'Informe mensual', enlace:'#/reportes/parasitos', estilo:''},   ///c7
        /*{nombre:'Reportes de signos vitales', enlace:'#/reportes/signosvitales', estilo:''},*/
        {nombre:'Reportes observados por dia', enlace:'#/reportes/observadosdia', estilo:''},
        /*{nombre:'Informe diario', enlace:'#/reportes/informedia', estilo:''},*/ ///c6
        {nombre:'Control diario', enlace:'#/reportes/controldiario', estilo:'active'}//c3
      ]
    },
    pagina:{
      titulo:'Reportes Control diario'
    }
  }
}else if ($scope.user.rol_id==7) {
      $scope.ajustes = {
    menu:{
      titulo: 'Reportes',
      items:[
        {nombre:'Informe mensual', enlace:'#/reportes/parasitos', estilo:''},   ///c7
        // {nombre:'Reportes de signos vitales', enlace:'#/reportes/signosvitales', estilo:''},
        {nombre:'Reportes observados por dia', enlace:'#/reportes/observadosdia', estilo:''},
        {nombre:'Informe diario', enlace:'#/reportes/informedia', estilo:''},  //c6
        {nombre:'Control diario', enlace:'#/reportes/controldiario', estilo:'active'} //c3
      ]
    },
    pagina:{
      titulo:'Informe mensual'
    }
  }
 }
  var fecha_hoy = new Date();
  $scope.hoy = moment(fecha_hoy,"YYYY-MM-DD").format("DD-MM-YYYY");
  console.log("funcion submit  fecha de hoy ",$scope.hoy);

  $http.get(CONFIG.DOMINIO_SERVICIOS+'/c3_laboratorios').success(function(respuesta){
    $scope.laboratorio = respuesta.laboratorio;
  console.log("funcion submit  fecha de hoy ",$scope.laboratorio);
  });

}])