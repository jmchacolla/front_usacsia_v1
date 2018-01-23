'use-strict';
angular.module("adminApp")

.controller('PruebaEnfermedadCtrl', ['$scope', '$scope', 'PruebaMedica', 'UltimaPL','PruebaEnfermedad', '$route', '$resource', '$routeParams', 'toastr', '$location', '$timeout', '$http', 'PruebaLaboratorioService', 'PersonaTramite', 'CONFIG', 'Tratamiento', 'Receta', 'Ficha',
function ($scope,$scope, PruebaMedica, UltimaPL, PruebaEnfermedad, $route, $resource,$routeParams, toastr, $location, $timeout, $http, PruebaLaboratorioService, PersonaTramite,  CONFIG, Tratamiento, Receta, Ficha) {

var pm_id=$routeParams.pm_id;
    $scope.vertr=false;

    // ver datos persona y prueba medica-----------
    PruebaMedica.get({pm_id:pm_id}, function(data)
    {
      $scope.prueba_medica = data.prueba_medica;
      console.log('prueba-medica+++++++',data);
        $scope.ajustes = {
          menu:{
            titulo: 'Gestion de Pruebas Medicas',
            items:[
              {nombre:'Fichas de atención', enlace:'#/atencion', estilo:''},
              {nombre:'Atención consulta', enlace:'#/atencion-consulta', estilo:''},
              {nombre:'Crear prueba medica', enlace:'#/prueba-medica/prueba/'+pm_id, estilo:'active'},
              {nombre:'Ver historial clínico del paciente', enlace:'#/ficha-clinica/'+$scope.prueba_medica.paciente.per_id}
              ]
          },
          pagina:{
            titulo:'Prueba Clínica'
          }
        }

      $scope.prueba_medica.paciente.per_fecha_nacimiento=moment($scope.prueba_medica.paciente.per_fecha_nacimiento,"YYYY-MM-DD").format("DD-MM-YYYY");

      pt_id=$scope.prueba_medica.persona_tra.pt_id;

      UltimaPL.get({pt_id:pt_id}, function (argument) {
        $scope.prueba_laboratorio=argument.prueba_laboratorio;
        $scope.prupar=argument.prupar;
        $scope.fun=argument.fun;
        $scope.per=argument.per;
        console.log('argument-------', argument);
      });
/*console.log('___PARA VER EL ESTADO__', $scope.prueba_laboratorio.pl_estado);*/
    });

    $scope.vertratamiento=function () {
            $scope.vertr=!$scope.vertr;
            console.log('$scope.vertr', $scope.vertr);
    }
    $scope.savetratamiento=function() {
      $scope.receta={
        pm_id:pm_id,
        rec_texto:$scope.rec_texto
      };
      Receta.save($scope.receta).$promise.then(function (receta) {
      console.log('g tramite',$scope.receta);
        if(receta){
          // $scope.ajustes.pagina.success = "Tratamiento registrad exitosamente";
          toastr.success('Tratamiento registrado correctamente');
        }
      })

    }
      $scope.items = [];
      $scope.seleccionados = ['NINGUNO'];
      $scope.diag= $scope.seleccionados.toString();
    $scope.cambiar=function (argument, enfe_nombre) {
      var penf={
         pm_id:argument.pm_id,
         enfe_id:argument.enfe_id,
         pre_resultado:argument.pre_resultado
      };
      var pre_id=argument.pre_id;
      PruebaEnfermedad.update(penf, {pre_id:pre_id}).$promise.then(function (data) {
          if(data.prueba_enfermedad.pre_resultado){
                busca(enfe_nombre);
          }
      })
    }

    function busca(item) {
      console.log('item-----',item);
        var idx = $scope.seleccionados.indexOf(item);
        if (idx >-1)
            $scope.seleccionados.splice(idx, 1);
        else{
          if ($scope.seleccionados.indexOf('NINGUNO')>-1)
          {
            $scope.seleccionados.splice('NINGUNO', 1);
          } 
           $scope.seleccionados.push(item);
        }
        if ($scope.seleccionados.length==0)
          {
            $scope.seleccionados = ['NINGUNO'];
          }
        $scope.diag= $scope.seleccionados.toString();
    };
    // $scope.existe = function (item) {
    //     return $scope.seleccionados.indexOf(item) > -1;
    // };

    $scope.clinica=function () {
      busca('CLÍNICAMENTE SANO');
    }


    Tratamiento.get(function(data){
        $scope.tratamientos=data;
        console.log("tratamientoss",$scope.tratamientos);
        console.log("tdata------------",data);
    });
    /*Añade los datos de tratamiento a receta*/
    $scope.rec_texto='';
    $scope.agregarReceta=function (trat_id) {
      console.log('trat_idmiento---',trat_id);
      Tratamiento.get({trat_id:trat_id}, function(data2){
          var tr2=data2;
          console.log("tr2", tr2);
          console.log("tdata------------",data2);
          $scope.rec_texto=$scope.rec_texto+'Tratamiento:'+tr2.enfermedades.trat_nombre+'\n Dosis: '+tr2.enfermedades.trat_dosis+'\n Detalle: '+tr2.enfermedades.trat_descripcion+'\n ############################ \n';
      console.log('---------------------------',$scope.rec_texto);
      });
    }



    $scope.diagnostico = function (pm_diagnostico) {
      $scope.prueba={pm_diagnostico:pm_diagnostico};
      console.log($scope.prueba);
      var ficha={fic_estado:'ATENDIDO'};
      console.log('$scope.prueba_medica.fic_id++++++', $scope.prueba_medica.prueba_medica.fic_id);
      Ficha.update(ficha, {fic_id:$scope.prueba_medica.prueba_medica.fic_id}).$promise.then(function (data) {
        if(data.status){
                toastr.success('Registrando paciente');
              }
      })

      PruebaMedica.update($scope.prueba, {pm_id:pm_id}, function (data) {
        console.log('la data---------', data);
        if (data.mensaje) {
          toastr.success('Diagnostico guardado exitosamente');
        //-----generar estado prueba medica
          $http.get(CONFIG.DOMINIO_SERVICIOS+'/estadopruebamedica/'+pm_id).success(function(respuesta){
              $scope.pruebamedica = respuesta.pruebamedica;
              console.log('---prueba_medica:', $scope.pruebamedica);
              if ($scope.pruebamedica) {
                  var estadopm={pm_estado:'OK'}
              }
              else{
                  var estadopm={pm_estado:'OBSERVADO'}
              }
              // -----actualizando pm
              PruebaMedica.update(estadopm, {pm_id:pm_id}, function (prme) {//--modificando estado pm
                console.log('condiciones', prme.prueba_medica.pm_estado, $scope.prueba_laboratorio.pl_estado)
                if (prme.prueba_medica.pm_estado=='OK' && $scope.prueba_laboratorio.pl_estado=='NO OBSERVADO') {
                  // var fconcluido=new Date(DD-MM-YY);
                  estadotramite={pt_estado_tramite:'CONCLUIDO'/*, pt_fecha_fin:fconcluido*/};
                }else{
                estadotramite={pt_estado_tramite:'OBSERVADO'};
                }
                //----actualizando estado de tramite
                console.log('estado', estadotramite);
                PersonaTramite.update(estadotramite,{pt_id:pt_id}).$promise.then(function (pt) {
                  console.log('tramite', pt_id, '-------pt:', pt);
                });
              });
          });
        }
      });
      $timeout(function() {
         $location.path('/prueba-medica/ver/'+pm_id);
          },1000);
    }
    
}])


