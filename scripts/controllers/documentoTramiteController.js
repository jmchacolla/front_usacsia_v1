'use strict';
angular.module("adminApp")

.controller('CrearDocumentoTramiteCtrl', ['$scope','DocumentoNoRegistrado','DocumentoRegistrado', 'DocumentoTramite', '$route','$routeParams', 'toastr', '$location',
function ($scope, DocumentoNoRegistrado,DocumentoRegistrado,DocumentoTramite, $route,$routeParams,toastr,$location)
{
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de tramites de Carné Sanitario',
      items:[
        {nombre:'Requisitos para el tramite de Certificado sanitario', enlace:'#/persona-usacsia', estilo:'active'}]
    },
    pagina:{
      titulo:'Documentos requeridos para el registro del establecimiento'
    }
  }
  
  $scope.sortType = 'per_id'; // set the default sort type
  $scope.sortReverse  = true;  // set the default sort order
  $scope.Personas = [];


  var EstG = localStorage.getItem("DatosEstablecimiento");
  var EstG = JSON.parse(EstG);
  var et_id= EstG.empresatramite.et_id;
  console.log('ultimo',et_id);
  // var et_id=2; //se debe obtener el ultimo tramite del establecimiento
  
  $scope.documento_select={
    doc_id:null,
    doc_nombre:""
  };


  DocumentoNoRegistrado.get({et_id:et_id},function(data){
    $scope.documentos_no_registraos=data.documento;
    if( $scope.documentos_no_registraos.length==0){
      $scope.documentos_no_registraos=null;
    }
  });

  DocumentoRegistrado.get({et_id:et_id},function(data){
    $scope.documentos_registraos=data.documento;
  });

  $scope.documentoTramite={
    doc_id:1,
    et_id:et_id,
    dt_url: "./img-documentos"
  }
  var dtid=null;
  $scope.get_id=function(dt_id,doc_nombre){
    dtid=dt_id;
    $scope.doc_nombre=doc_nombre;
  };

  $scope.eliminar_doctra = function(){
     DocumentoTramite.delete({dt_id:dtid}).$promise.then(function(data)
    {
      if(data.status)
      {
        $route.reload();
      }
    })
  };

    $scope.submit = function(){
      $scope.documentoTramite.doc_id=$scope.documento_select.doc_id;
    console.log($scope.documentoTramite, "documento que se va a guardar",$scope.documentoTramite);

    DocumentoTramite.save($scope.documentoTramite).$promise.then(function(data){
      if(data.msg){
        $scope.ajustes.pagina.success = "El ciudadano registrada exitosamente";
        toastr.success('Documento Guardado correctamente');
        $route.reload();
      }
    });
  }

}])



.controller('EditarDocumentoTramiteCtrl', ['$http','CONFIG','$scope', 'DocumentoTramite2', 'DocumentoTramiteL','PersonasEstablecimiento','Documento','VerEstadoEmpleados','$route','$routeParams', 'toastr', '$location',
function ($http,CONFIG,$scope, DocumentoTramite2,DocumentoTramiteL,PersonasEstablecimiento,Documento, VerEstadoEmpleados,$route,$routeParams,toastr,$location)

{
  $scope.user = {
    rol_id: CONFIG.ROL_CURRENT_USER
  }
  if ($scope.user.rol_id == 15) {

      $scope.ajustes = {
        menu:{
          titulo: 'Gestión de Establecimientos Solicitantes',
          items:[
            {nombre:'Revisar Requisitos', enlace:'#/tramite-establecimientosol', estilo:'active'},
            {nombre:'Establecimientos', enlace:'#/establecimientossol', estilo:''},
            {nombre:'Nuevo establecimiento', enlace:'#/establecimientosol/persona', estilo:''}]
        },
        //Configuraciones de la página
        pagina:{
          titulo:'Establecimiento - Nro. Trámite'
        }
      }
  }
  else{
  $scope.ajustes = {
    //Configuraciones del menu:
    menu:{
      titulo: 'Gestión de Establecimientos Solicitantes',
      items:[
        {nombre:'Trámites iniciados', enlace:'#/tramite-establecimientosol', estilo:'active'},
        {nombre:'Establecimientos', enlace:'#/establecimientossol', estilo:''},
        {nombre:'Nuevo establecimiento', enlace:'#/establecimientosol/persona', estilo:''}]
    },
    //Configuraciones de la página
    pagina:{
      titulo:'Trámites iniciados'
    }
  }
}
  var et_id=$routeParams.et_id;
  var FunG = localStorage.getItem("Funcionario");
  var FunG = JSON.parse(FunG);
  var fun_id=FunG.fun_id;
  var ess_id=null;

    DocumentoTramite2.get({et_id:et_id},function(data){
    $scope.documentos=data.documentotramite;
    $scope.tramite=data.tramite;
    ess_id=data.tramite.ess_id;
          PersonasEstablecimiento.get({ess_id:ess_id},function(data)
        {
          $scope.personas_x_establecimiento = data.personas_x_establecimiento;
          $scope.st = data.sin_tramite;
          $scope.i = data.iniciados;
          $scope.o = data.observados;
          $scope.v = data.vencidos;
          $scope.c = data.concluidos;
          $scope.a = data.aprobados;
          $scope.t = data.total;
            if($scope.personas_x_establecimiento.length > 0){
              $scope.loading = false;
              $scope.msg = true;
            }
            else {
              $scope.loading = false;
              $scope.msg = false;
            }
        },function () {
              $scope.loading = false;
              $scope.msg = false;
         });
    });
      
  /*guasrda modificaciones*/
      $scope.dt_observacion={
        dt_id:null,
        dt_observado:null,
        dt_observacion:""
      };
      $scope.ids = [];
      $scope.observaciones = [];

        $scope.editado = function (dt_id,observado,observacion) {
              var idx = $scope.ids.indexOf(dt_id);
              if (idx > -1){
                if(observado){
                  $scope.observaciones[idx].dt_observado=observado;
                  $scope.observaciones[idx].dt_observacion=observacion;
                }else{
                  $scope.observaciones[idx].dt_observado=false;
                  $scope.observaciones[idx].dt_observacion="";
                }
              }
              else{
                $scope.ids.push(dt_id);
                $scope.dt_observacion={
                  dt_id:dt_id,
                  dt_observado:observado,
                  dt_observacion:observacion
                };
                if(!observado)
                  $scope.dt_observacion.dt_observacion="";
                
                $scope.observaciones.push($scope.dt_observacion);
              }
            $scope.final= $scope.ids;
            $scope.final2= $scope.observaciones;
        };

        $scope.update_lista = function(a){
          $scope.todo={
            et_id:et_id,
            fun_id:fun_id
          };
       
          $scope.vector={
            observaciones:$scope.observaciones,
            todo:$scope.todo
          };
        DocumentoTramiteL.save($scope.vector).$promise.then(function(data){
          if(data.status) {
            $scope.ajustes.pagina.success = "CONFIGURACIÓN GUARDADA";
                toastr.success('CONFIGURACIÓN GUARDADA');
          }
        })
      }
      /*----------------------*/
      // empleados

      VerEstadoEmpleados.get({et_id:et_id},function(data){
        $scope.te=data.tramitestado;
        $scope.llega_obs=data.tramitestado.te_observacion;
        $scope.te.te_observacion="";
      });

      $scope.actualizar_empleados=function(a){
        if(a==1){
          // $scope.te.te_estado="APROBADO";
          $scope.te.te_estado="PROCEDE";
          $scope.te.te_observacion="";
          
        }else{
          $scope.te.te_estado="OBSERVADO";
        }

        $http.put(CONFIG.DOMINIO_SERVICIOS+"/estado_empleados/"+et_id, $scope.te).success(function(data){
           $scope.llega_obs=data.tramitestado.te_observacion;  
           $scope.ajustes.pagina.success = "CONFIGURACIÓN GUARDADA";
           toastr.success('CONFIGURACIÓN GUARDADA');
      });
      };

  
}])
