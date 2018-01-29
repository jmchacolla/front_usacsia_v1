'use strict';
angular.module("adminApp")

.controller('CrearPersona2Ctrl', ['$scope', 'PersonasC',  'PNatural','$location','$timeout', 'toastr','Zonas',function ($scope, PersonasC, PNatural, $location, $timeout, toastr,Zonas){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Personas',
      items:[
        {nombre:'Personas Registrados', enlace:'#/personas', estilo:''},
        {nombre:'Registrar Personas', enlace:'#/personas/create', estilo:'active'}]
    },
    pagina:{
      titulo:'Registrar Persona',
      action:'REGISTRAR'
    }
  }

  $scope.persona = {
    zon_id:null,
    per_ci: null,
    per_tipo_documento: "",
    per_pais: null,
    per_ci_expedido: "LP",
    per_nombres: null,
    per_apellido_primero: null,
    per_apellido_segundo: null,
    per_fecha_nacimiento: null,
    per_genero: null,
    per_email: null,
    per_numero_celular: null,
    per_clave_publica: "",
    per_avenida_calle: "",
    per_numero:null,
    per_ocupacion:"",
    per_tipo_permanencia: "",

    ima_nombre: "perfil.jpg",
    ima_enlace: "./img-per",
    ima_tipo: ""
    
  };

  var vm=this;//muestra los servicios de la zona seleccionado

$scope.zon=false;
  $scope.ver_zonas=function(mun_id){
      console.log(mun_id+"<<< MUN_ID");
      $scope.zon=false;
      Zonas.get({mun_id:mun_id}, function(data){
          $scope.zonas=data.zona;
          console.log("ZOnasss",$scope.zonas);
          //Agregando 26/10/17
          if($scope.zonas.length == 0){
                $scope.zon=true;
          }
          console.log("length "+$scope.zonas.length);
      })
  };
  
  $scope.patternCadena = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$/;
  $scope.patternCadenaNumero = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ 0-9.]*$/;

  /*PARA HABILITAR LOS BOTONES*/
/*  $scope.checkbox='checked';
  $scope.visible = false;*/

  
  /*PARA EL TIPO DE DOCUMENTO*/
  $scope.required = true;
  $scope.$watch(function(){

    $scope.exp=true;
    $scope.exp_ext=false;
    $scope.sin_doc=false;
    $scope.required_p = false;

    if($scope.persona.per_tipo_documento=="PASAPORTE"){
        $scope.nac=true;
        $scope.exp=false;
        $scope.exp_ext=true;
        $scope.required_p = true;
    };
    if($scope.persona.per_tipo_documento=="CI"){
       $scope.nac=false;
       $scope.exp=true;
       $scope.exp_ext=false;
       $scope.required_p = false;
    }
  });
  $scope.persona.ima_enlace="./img-per";
  $scope.persona.ima_tipo="fotografia";

  $scope.submit = function(b,fechaNacimiento/*,suf*/){

    $scope.persona.per_fecha_nacimiento=fechaNacimiento;

    if($scope.persona.per_tipo_documento=="CI"){
      $scope.persona.per_pais="BOLIVIA";
 /*     if (suf!="NO TIENE") {
            $scope.persona.per_ci=ci+'-'+suf;
          }
          if (suf=="NO TIENE") {
            $scope.persona.per_ci=ci;
          }*/

    }

    if($scope.persona.per_tipo_documento=="PASAPORTE"){
      $scope.persona.per_ci_expedido="EXTRANJERO";
      $scope.persona.per_ci='E-'+b.per_ci;
    }
    if($scope.persona.per_tipo_documento=="SIN DOCUMENTO"){
      $scope.persona.per_ci=1234567;
    }
    console.log($scope.persona, "persona guardada",$scope.persona.ima_enlace);

    PersonasC.save($scope.persona).$promise.then(function(data){
      if(data.msg){
        angular.copy({}, $scope.persona);
        $scope.ajustes.pagina.success = "El ciudadano registrado exitosamente";
        toastr.success('Persona registrada correctamente');

          $timeout(function() {
            if(!$scope.crear_desde_establecimiento){
                $location.path('/personas');
            }else{
                  $scope.per_id_para_persona_natural={
                    per_id:data.persona.persona.per_id
                  }
                 PNatural.save($scope.per_id_para_persona_natural).$promise.then(function(data2){
                    console.log('persona natural creada', data2);
                 });
                $location.path('/establecimientosol/persona/ver/'+data.persona.persona.per_id);
            }    
          },0);  
      }
    });
  }
  $scope.reset = function(form) {
    $scope.persona = {};
    if (form) {
      form.$setPristine();
      form.$setUntouched();
    }
  };
}])


.controller('ListaPersonasCtrl', ['$http','CONFIG','$scope', 'Personas', '$route', 'toastr',
  function ($http,CONFIG,$scope, Personas, $route, toastr){
  $scope.ajustes = {
    menu:{
      titulo: 'Gestión de Personas',
      items:[
        {nombre:'Personas Registrados', enlace:'#/personas', estilo:'active'},
        {nombre:'Registrar Ciudadano', enlace:'#/persona/create', estilo:''}]
    },
    pagina:{
      titulo:'Personas Registradas'
    }
  }
  
  $scope.sortType = 'per_id'; // set the default sort type
  $scope.sortReverse  = true;  // set the default sort order
  $scope.Personas = [];

  
  $scope.loading=true;//para hacer un loading
  $scope.datos_paginacion="";
  $scope.filas=25;
  $scope.indices=[];
  
  
  Personas.get(function(data){
    $scope.datos_paginacion=data.persona;
    $scope.paginas=[];
    for (var i = 0; i<$scope.datos_paginacion.last_page; i++) {
       $scope.paginas[i]=i+1;
    }
    data.persona;
    $scope.personas = data.persona.data;
    if(data.persona.data.length>0){
      $scope.personas=data.persona.data;
      
      for (var i= 0; i<$scope.personas.length; i++){
        if($scope.datos_paginacion.from<=$scope.datos_paginacion.to){
          $scope.personas[i].per_indice=$scope.datos_paginacion.from;
          $scope.datos_paginacion.from++;
        }
      }
      
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



/*PAGINACION*/
$scope.paginar= function(url,filas,pagina,operador) {
    $scope.url={
      url:url
    };
    if(url==''){
      console.log('pagina seleccionad',pagina);
       $scope.url.url= CONFIG.DOMINIO_SERVICIOS+'/persona'+'?page='+pagina;
    }
    $http({
        url: $scope.url.url,
        method: "GET",
        params: {nro:filas}
    }).success(function(data) {
      console.log('primera datos_paginacion esta lista', data);
       $scope.personas=data.persona.data;
       $scope.datos_paginacion=data.persona;
       /*indice fila*/
          for (var i= 0; i<$scope.personas.length; i++){
            if($scope.datos_paginacion.from<=$scope.datos_paginacion.to){
              $scope.personas[i].per_indice=$scope.datos_paginacion.from;
              $scope.datos_paginacion.from++;
            }
          }
        /*select pagina*/
      $scope.paginas=[];
      for (var i = 0; i<$scope.datos_paginacion.last_page; i++) {
         $scope.paginas[i]=i+1;
      }
    });
};
/*PAGINACION*/



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

.controller('VerPersonaCtrl', [/*'authUser',*/ '$scope', 'Personas', '$routeParams', '$location','$http','CONFIG','$timeout', 
  function (/*authUser,*/ $scope, Personas, $routeParams, $location,$http,CONFIG,$timeout){
 /* if(authUser.isLoggedIn()){*/
    $scope.ajustes = {
      menu:{
        titulo: 'Gestión de Ciudadanos',
        items:[
          {nombre:'Ciudadanos Registrados', enlace:'#/personas', estilo:''},
          {nombre:'Registrar Ciudadano', enlace:'#/personas/create', estilo:''}]
      },
      pagina:{
        titulo:'Datos del Ciudadano'
      }
    }
    $scope.loading=true;
    var per_id = $routeParams.per_id;
    console.log("persona_id",per_id);
    Personas.get({per_id:per_id}, function(data){
      $scope.persona = data.persona;
      console.log("PERSONAS");
      if ($scope.persona.persona.per_genero=='F' || $scope.persona.persona.per_genero=='f'){
        $scope.persona.persona.per_genero='FEMENINO';
      }
      else if($scope.persona.persona.per_genero=='M' || $scope.persona.persona.per_genero=='m'){
        $scope.persona.persona.per_genero='MASCULINO';
      }
      $scope.loading = false;
      $scope.msg = data.mensaje;
      $scope.fecha_nac = moment($scope.persona.persona.per_fecha_nacimiento,"YYYY-MM-DD").format("DD-MM-YYYY");
    $http.get(CONFIG.DOMINIO_SERVICIOS+'/persona_edad/'+$scope.persona.persona.per_fecha_nacimiento).success(function(respuesta){
        console.log("_edad_paciente__",respuesta.edad_paciente);
        $scope.edad=respuesta.edad_paciente;
        /*$scope.tramitecerestado=respuesta.tramitecerestado;*/
      });
      /*   fin verificar edad*/
      $scope.registra=function() {
          $timeout(function() {
            $location.path('/persona/createF/'+$scope.persona.persona.per_id);
          },1000);
        }
      });
  /*} else {
    $location.path('/inicio');
  }*/
}])

.controller('EditPersonaCtrl', [/*'authUser',*/ '$scope', 'Personas', '$routeParams','$location', '$timeout', 'toastr','Zonas',
 function (/*authUser,*/ $scope,Personas,$routeParams, $location, $timeout, toastr,Zonas) {
 /* if(authUser.isLoggedIn()) {*/
    $scope.ajustes = {
      menu:{
        titulo: 'Gestión de Personas',
        items:[
          {nombre:'Personas Registrados', enlace:'#/personas', estilo:''},
          {nombre:'Registrar Persona', enlace:'#/persona/create', estilo:''}]
      },
      pagina:{
        titulo:'Actualizar Datos de la Persona',
        action: "EDITAR"
      }
    }
    
    var per_id = $routeParams.per_id;
    Personas.get({per_id:per_id}, function(data)
    { 
      $scope.persona = data.persona;
      var fecha_naci = new Date($scope.persona.persona.per_fecha_nacimiento);
      $scope.diacE = (('0' + fecha_naci.getDate()).slice(-2));
      $scope.mescE = ('0' + (fecha_naci.getMonth() + 1)).slice(-2);
      $scope.aniocE = (fecha_naci.getFullYear() + 0)+"";
    });
$scope.zon=false;
  $scope.ver_zonas=function(mun_id){
      console.log(mun_id+"<<< MUN_ID");
      $scope.zon=false;
      Zonas.get({mun_id:mun_id}, function(data){
          $scope.zonas=data.zona;
          console.log("ZOnasss",$scope.zonas);
          //Agregando 26/10/17
          if($scope.zonas.length == 0){
                $scope.zon=true;
          }
          console.log("length "+$scope.zonas.length);
      })
  };



    $scope.submit = function(a, fecha_naci){
      $scope.persona1 = {
        zon_id : $scope.persona.persona.zon_id,
        per_ci : $scope.persona.persona.per_ci,
        per_ci_expedido : $scope.persona.persona.per_ci_expedido,
        per_nombres : $scope.persona.persona.per_nombres,
        per_apellido_primero : $scope.persona.persona.per_apellido_primero,
        per_apellido_segundo : $scope.persona.persona.per_apellido_segundo,
        per_fecha_nacimiento : $scope.persona.persona.per_fecha_nacimiento,
        per_genero : $scope.persona.persona.per_genero,
        per_email : $scope.persona.persona.per_email, 
        per_numero_celular : $scope.persona.persona.per_numero_celular,
        per_clave_publica : $scope.persona.persona.per_clave_publica,
        per_avenida_calle : $scope.persona.persona.per_avenida_calle,
        per_numero : $scope.persona.persona.per_numero,
        per_ocupacion : $scope.persona.persona.per_ocupacion,
        per_tipo_permanencia : $scope.persona.persona.per_tipo_permanencia,
        per_tipo_permanencia : $scope.persona.persona.per_tipo_permanencia,
        per_tipo_documento : $scope.persona.persona.per_tipo_documento,
        per_pais : $scope.persona.persona.per_pais,

        /*ima_nombre : $scope.personas.imagen[0].ima_nombre,
        ima_enlace : "./img-per",
        ima_tipo : $scope.personas.imagen[0].ima_tipo*/
       
        ima_nombre : $scope.persona.imagen.ima_nombre,
        ima_enlace : "./img-per",
        ima_tipo : $scope.persona.imagen.ima_tipo


      /*  dir_zona_comunidad : $scope.persona.direccion[0].dir_zona_comunidad,
        dir_avenida_calle : $scope.persona.direccion[0].dir_avenida_calle,
        dir_numero : $scope.persona.direccion[0].dir_numero,
        dir_tipo : $scope.persona.direccion[0].dir_tipo,
        mun_id : $scope.persona.direccion[0].mun_id*/
      };

        if(fecha_naci != null){
           $scope.persona1.per_fecha_nacimiento=fecha_naci;
        }

      Personas.update({per_id:$scope.persona.persona.per_id}, $scope.persona1).$promise.then(function(data){
        if(data.msg){
          $scope.ajustes.pagina.success = "Los datos fueron actualizados correctamente";
          toastr.success('Editado correctamente');
          $timeout(function() {
            $location.path('/personas/ver/'+$scope.persona.persona.per_id);
          },1000);
        }
      })
    }
/*  } else {
    $location.path('/inicio');
  }*/
}])



.controller('FechaFunCtrl', ['$scope', function($scope) {
  $scope.dias=[{"dia_id": "01", "dia":"01"},{"dia_id": "02", "dia":"02"},
               {"dia_id": "03", "dia":"03"},{"dia_id": "04", "dia":"04"},
               {"dia_id": "05", "dia":"05"},{"dia_id": "06", "dia":"06"},
               {"dia_id": "07", "dia":"07"},{"dia_id": "08", "dia":"08"},
               {"dia_id": "09", "dia":"09"},{"dia_id": "10", "dia":"10"},
               {"dia_id": "11", "dia":"11"},{"dia_id": "12", "dia":"12"},
               {"dia_id": "13", "dia":"13"},{"dia_id": "14", "dia":"14"},
               {"dia_id": "15", "dia":"15"},{"dia_id": "16", "dia":"16"},
               {"dia_id": "17", "dia":"17"},{"dia_id": "18", "dia":"18"},
               {"dia_id": "19", "dia":"19"},{"dia_id": "20", "dia":"20"},
               {"dia_id": "21", "dia":"21"},{"dia_id": "22", "dia":"22"},
               {"dia_id": "23", "dia":"23"},{"dia_id": "24", "dia":"24"},
               {"dia_id": "25", "dia":"25"},{"dia_id": "26", "dia":"26"},
               {"dia_id": "27", "dia":"27"},{"dia_id": "28", "dia":"28"},
               {"dia_id": "29", "dia":"29"},{"dia_id": "30", "dia":"30"},
               {"dia_id": "31", "dia":"31"},];

  $scope.anios=[{"anio_id": "1", "anio":"2017"},{"anio_id": "2", "anio":"2016"},
               {"anio_id": "3", "anio":"2015"},{"anio_id": "4", "anio":"2014"},
               {"anio_id": "5", "anio":"2013"},{"anio_id": "6", "anio":"2012"},
               {"anio_id": "7", "anio":"2011"},{"anio_id": "8", "anio":"2010"},
               {"anio_id": "9", "anio":"2009"},{"anio_id": "10", "anio":"2008"},
               {"anio_id": "11", "anio":"2007"},{"anio_id": "12", "anio":"2006"},
               {"anio_id": "13", "anio":"2005"},{"anio_id": "14", "anio":"2004"},
               {"anio_id": "15", "anio":"2003"},{"anio_id": "16", "anio":"2002"},
               {"anio_id": "17", "anio":"2001"},{"anio_id": "18", "anio":"2000"},
               {"anio_id": "19", "anio":"1999"},{"anio_id": "20", "anio":"1998"},
               {"anio_id": "21", "anio":"1997"},{"anio_id": "22", "anio":"1996"},
               {"anio_id": "23", "anio":"1995"},{"anio_id": "24", "anio":"1994"},
               {"anio_id": "25", "anio":"1993"},{"anio_id": "26", "anio":"1992"},
               {"anio_id": "27", "anio":"1991"},{"anio_id": "28", "anio":"1990"},
               {"anio_id": "29", "anio":"1989"},{"anio_id": "30", "anio":"1988"},
               {"anio_id": "31", "anio":"1987"},{"anio_id": "32", "anio":"1986"},
               {"anio_id": "33", "anio":"1985"},{"anio_id": "34", "anio":"1984"},
               {"anio_id": "35", "anio":"1983"},{"anio_id": "36", "anio":"1982"},
               {"anio_id": "37", "anio":"1981"},{"anio_id": "38", "anio":"1980"},
               {"anio_id": "39", "anio":"1979"},{"anio_id": "40", "anio":"1978"},
               {"anio_id": "41", "anio":"1977"},{"anio_id": "42", "anio":"1976"},
               {"anio_id": "43", "anio":"1975"},
               {"anio_id": "44", "anio":"1974"},
               {"anio_id": "45", "anio":"1973"},
               {"anio_id": "46", "anio":"1972"},
               {"anio_id": "47", "anio":"1971"},
               {"anio_id": "48", "anio":"1970"},
               {"anio_id": "49", "anio":"1969"},
               {"anio_id": "50", "anio":"1968"},
               {"anio_id": "51", "anio":"1967"},
               {"anio_id": "52", "anio":"1966"},
               {"anio_id": "53", "anio":"1965"},
               {"anio_id": "54", "anio":"1964"},
               {"anio_id": "55", "anio":"1963"},
               {"anio_id": "56", "anio":"1962"},
               {"anio_id": "57", "anio":"1961"},
               {"anio_id": "58", "anio":"1960"},
               {"anio_id": "59", "anio":"1959"},
               {"anio_id": "60", "anio":"1958"},
               {"anio_id": "61", "anio":"1957"},
               {"anio_id": "62", "anio":"1956"},
               {"anio_id": "63", "anio":"1955"},
               {"anio_id": "64", "anio":"1954"},
               {"anio_id": "65", "anio":"1953"},
               {"anio_id": "66", "anio":"1952"},
               {"anio_id": "67", "anio":"1951"},
               {"anio_id": "68", "anio":"1950"},
               {"anio_id": "69", "anio":"1949"},
               {"anio_id": "70", "anio":"1948"},
               {"anio_id": "71", "anio":"1947"},
               {"anio_id": "72", "anio":"1946"},
               {"anio_id": "73", "anio":"1945"},
               {"anio_id": "74", "anio":"1944"},
               {"anio_id": "75", "anio":"1943"},
               {"anio_id": "76", "anio":"1942"},
               {"anio_id": "77", "anio":"1941"},
               {"anio_id": "78", "anio":"1940"},
               {"anio_id": "79", "anio":"1939"},
               {"anio_id": "80", "anio":"1938"},
               {"anio_id": "81", "anio":"1937"},
               {"anio_id": "82", "anio":"1936"},
               {"anio_id": "83", "anio":"1935"},
               {"anio_id": "84", "anio":"1934"},
               {"anio_id": "85", "anio":"1933"},
               {"anio_id": "86", "anio":"1932"},
               {"anio_id": "87", "anio":"1931"},
               {"anio_id": "88", "anio":"1930"},
               {"anio_id": "89", "anio":"1929"},
               {"anio_id": "90", "anio":"1928"},
               {"anio_id": "91", "anio":"1927"},
              /* {"anio_id": "92", "anio":"1926"},
               {"anio_id": "93", "anio":"1925"},
               {"anio_id": "94", "anio":"1924"},
               {"anio_id": "95", "anio":"1923"},
               {"anio_id": "96", "anio":"1922"},
               {"anio_id": "97", "anio":"1921"},
               {"anio_id": "98", "anio":"1920"},
               {"anio_id": "99", "anio":"1919"},
               {"anio_id": "100", "anio":"1918"},
               {"anio_id": "101", "anio":"1917"},
               {"anio_id": "102", "anio":"1916"},
               {"anio_id": "103", "anio":"1915"},
               {"anio_id": "104", "anio":"1914"},
               {"anio_id": "105", "anio":"1913"},
               {"anio_id": "106", "anio":"1912"},
               {"anio_id": "107", "anio":"1911"},
               {"anio_id": "108", "anio":"1910"},
               {"anio_id": "109", "anio":"1909"},
               {"anio_id": "110", "anio":"1908"},
               {"anio_id": "111", "anio":"1907"},
               {"anio_id": "112", "anio":"1906"},
               {"anio_id": "113", "anio":"1905"},
               {"anio_id": "114", "anio":"1904"},
               {"anio_id": "115", "anio":"1903"},
               {"anio_id": "116", "anio":"1902"},
               {"anio_id": "117", "anio":"1901"},
               {"anio_id": "118", "anio":"1900"},*/

               ];
  //$scope.patternFecha = /^(0?[1-9]|1\d|2[0-8]|29(?=[-]\d?\d[-](?!1[01345789]00|2[1235679]00)\d\d(?:[02468][048]|[13579][26]))|30(?![-]0?2)|31(?=[-]0?[13578]|[-]1[02]))[-](0?[1-9]|1[0-2])[-]([12]\d{3})$/;
  $scope.patternFecha = /^(0[1-9]|1[0-9]|2[0-9]|3[01]).(0[1-9]|1[012]).[0-9]{4}$/;
    
  //Fecha de nacimiento
  $scope.fechaNac = {};
  $scope.diac = ""; 
  $scope.mesc = ""; 
  $scope.anioc = "";

  $scope.fechaNacimiento=null;

  var date = new Date();
  $scope.FromDate = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' +date.getFullYear() ;
  $scope.FromDate1 = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) ;
  $scope.dia=('0' + date.getDate()).slice(-2);
  $scope.mes=('0' + (date.getMonth() + 1)).slice(-2);
  $scope.anio=date.getFullYear() + 1;


  $scope.d=null;
  $scope.var='';
  // etc... 
  // These values will be updated when the user types in the input boxes
  //$scope.funcionarios.per_fecha_nacimiento=$scope.fecha.dia + "-" + $scope.fecha.mes + "-"+ $scope.fecha.anio;
   
  //Funcion para concatenar la fecha de creacion
  $scope.rest = function() {
  //return $scope.fecha.dia + "-" + $scope.fecha.mes + "-"+ $scope.fecha.anio;
    $scope.fechaNacimiento=$scope.fechaNac.diac + "-" + $scope.fechaNac.mesc + "-"+ $scope.fechaNac.anioc;
    $scope.d = $scope.fechaNac.anioc + "-" +$scope.fechaNac.mesc + "-"+ $scope.fechaNac.diac;
   
    console.log("___ESTE ES EL D__",$scope.d);
    console.log("___DIA SELECCIONADO__",$scope.fechaNac.diac);
    console.log("MES SELECCIONADO__",$scope.fechaNac.mesc);
    console.log("___AÑO SELECCIONADO__",$scope.fechaNac.anioc);
    var a1 = new Date($scope.d);
    var a2 = new Date($scope.FromDate1);
    $scope.ar=a1;    
    console.log("___w__", $scope.w);
    $scope.cr = moment($scope.ar,"DD-MM-YYYY").format("YYYY-MM-DD");
    console.log("__ESTE E EL CR__",$scope.cr);
    $scope.br=a2;
  
    $scope.dr = moment($scope.br,"DD-MM-YYYY").format("YYYY-MM-DD");
    console.log("__ESTE E EL DR__",$scope.dr);

    if($scope.cr <= $scope.dr){
      console.log("___VR posi___",$scope.var);
        $scope.var="uno";
    }else{
      console.log("___VR nega___",$scope.var);
        $scope.var="cero";
    }
  };

  $scope.fechaNacimientoEDIT=null;
  $scope.dE=null;
    // FECHA PARA CONCATENAR FECHA DE NACIMIENTO EDITADO
  $scope.restEDIT = function() {
    $scope.fechaNacimientoEDIT=$scope.diacE + "-" + $scope.mescE + "-"+ $scope.aniocE;
    $scope.dE = $scope.aniocE + "-" +$scope.mescE + "-"+ $scope.diacE;
    var a1 = new Date($scope.dE);
    var a2 = new Date($scope.FromDate1);
    $scope.ar=a1;    
    $scope.cr = moment($scope.ar,"DD-MM-YYYY").format("YYYY-MM-DD");
    console.log($scope.cr);
    $scope.br=a2;
    $scope.dr = moment($scope.br,"DD-MM-YYYY").format("YYYY-MM-DD");
    if($scope.cr <= $scope.dr){
        $scope.var="uno";
    }else{
        $scope.var="cero";
    }
  };

  //Fecha inicio de trabajo
  $scope.fechaIT = {};
  $scope.diait = ""; 
  $scope.mesit = ""; 
  $scope.anioit = "";

  $scope.fechaITrab=null;
  $scope.fec_aux=null;
  //Funcion para concatenar la fecha de inicio de actividad
  $scope.restIT = function() {
    $scope.fechaITrab=$scope.fechaIT.diait + "-" + $scope.fechaIT.mesit + "-"+ $scope.fechaIT.anioit;
    $scope.fec_aux = $scope.fechaIT.anioit + "-" +$scope.fechaIT.mesit+ "-"+ $scope.fechaIT.diait;
    var b1_it = new Date($scope.fec_aux);
    var b2_it = new Date($scope.FromDate1);
    
    if (b1_it <= b2_it) {
        $scope.var2="uno";
      } else{
        $scope.var2="cero";
      }
  };

  /*FUNCIONA PARA EDITAR LA FECHA DE INICIO DE TRABAJO*/
  $scope.fechaITrabEDIT=null;
  $scope.restITE = function() {
    $scope.fechaITrabEDIT = $scope.diaFI + "-" + $scope.mesFI + "-"+ $scope.anioFI;
    $scope.fec_aux = $scope.anioFI + "-" +$scope.mesFI+ "-"+ $scope.diaFI;
  };

  //Fecha fin de trabajo
  $scope.fechaFT = {};
  $scope.diaft = ""; 
  $scope.mesft = ""; 
  $scope.anioft = "";

  $scope.fechaFTrab=null;
  $scope.fec_aux1=null;
  //Funcion para concatenar la fecha de inicio de actividad
  $scope.restFT = function() {
    $scope.fechaFTrab=$scope.fechaFT.diaft + "-" + $scope.fechaFT.mesft + "-"+ $scope.fechaFT.anioft;
    $scope.fec_aux1 = $scope.fechaFT.anioft + "-" +$scope.fechaFT.mesft+ "-"+ $scope.fechaFT.diaft;
    var b1_ft = new Date($scope.fec_aux1);
    var b2_ft = new Date($scope.FromDate1);
    
    if (b1_ft <= b2_ft) {
        $scope.var3="uno";
      } else{
        $scope.var3="cero";
      }
  };

  $scope.fechaFTrabEDIT=null;
  //FUNCION PARA EDITAR LA FECHA FIN DE TRABAJO
  $scope.restFT_EDIT = function() {
    
    var fec_inicio=new Date($scope.fec_ini);
    
    $scope.fechaFTrabEDIT=$scope.diaFF + "-" + $scope.mesFF + "-"+ $scope.anioFF;
    $scope.fec_aux = $scope.anioFF + "-" +$scope.mesFF+ "-"+ $scope.diaFF;
    var b1_it = new Date($scope.fec_aux);
    var b2_it = new Date($scope.FromDate1);
    
    if (b1_it <= b2_it) {
      $scope.var2="uno";
    } else{
      $scope.var2="cero";
    }
  };
}]) 

.directive("myValidDate", function () {
  return {
    require: "ngModel",
    restrict: "A", // Attributes only
    link: function (scope, elem, attr, ctrl) {
        ctrl.$validators.bzValidDate = function(value) {
            if (value === undefined || value === null || value === "") {
                return true;
            }
            return moment(value, ["D-M-YYYY"], true).isValid();
        }
    }
}
})








/*borrar controlador de prueba para paginacion*/

//Lista las reservas y citas médicas de un paciente
.controller('BorrarCtrl', ['$scope', '$routeParams', '$timeout','$location','Personas', 'toastr', '$http',
  function ($scope,$routeParams,$timeout,$location,Personas,toastr,$http) {
  $scope.ajustes = {
    menu:{
      titulo: 'Servicios al ciudadano',
      items:[{nombre:'Reservar cita medica', enlace:'#/servicios_ciudadanos/realizar_reserva',estilo:''},
           {nombre:'Cita previa para familiares', enlace:'#/servicios_ciudadanos/realizar_reserva_familiar',estilo:''},
         {nombre:'Citas realizadas', enlace:'#/servicios_ciudadanos/listar_reservas',estilo:'active'}]
    },
    pagina:{
      titulo:'Reservas'
    }
  }

  $scope.sortType = 'cit_fecha_consulta'; // ESTABLECIENDO EL TIPO DE ORDENAMIENTO
  $scope.sortReverse  = true;  // PARA ORDENAR ASCENDENTEMENTO O DESCENDENTEMENTE
  $scope.loading=true;//PARA HACER UN LOADING EN EL TEMPLATE
  $scope.erroor=true;
  //obteniendo el pac_id
  var pac_id = 0;
  if($routeParams.pac_id != null){
    pac_id = $routeParams.pac_id;
    $scope.pac_id_fam = pac_id;
    console.log($scope.pac_id_fam);
    $scope.ajustes.menu.items[2].estilo = "";
  } else {
    pac_id = parseInt(localStorage.getItem("PacId"), 10);
  }
  
  //REEMPLAZAR
  $scope.nro_filas = 10;
  $scope.filas = [];
  Personas.get({pac_id:pac_id,nro:$scope.nro_filas},function(data) {
    $scope.citas = data.persona;
    $scope.last_page = $scope.citas.last_page;
      if($scope.citas.data.length>0){
        $scope.loading = false;
        $scope.msg = data.status;
      } else {
        $scope.loading = false;
        $scope.msg = false;
      }
      for (var i = 0; i < $scope.last_page; i++) {
        $scope.filas[i] = i+1;
      };
  },function () {
        toastr.error("ERROR INESPERADO, POR FAVOR ACTUALICE LA PÁGINA");
        $scope.loading = false;
        $scope.msg = false;
        $scope.erroor = false;
  }); 

  $scope.numero_filas = function (nro) {
    $scope.cargando = true;
    if($scope.cargando) {
        toastr.info('Cargando ...', {
          positionClass: 'toast-top-center',
          tapToDismiss: false
        });
      }
    Personas.get({pac_id:pac_id,nro:nro},function(data) {
    $scope.citas = data.cita;
    $scope.last_page = $scope.citas.last_page;
      if($scope.citas.data.length>0){
        //$scope.last_page = $scope.citas.last_page;
        for(var i in $scope.citas.data) {
      $scope.citas.data[i].cit_hora_consulta = toTime($scope.citas.data[i].cit_hora_consulta);
      $scope.citas.data[i].cit_fecha_consulta = moment($scope.citas.data[i].cit_fecha_consulta,"YYYY-MM-DD").format("DD-MM-YYYY");
      }
        $scope.loading = false;
        $scope.msg = data.status;
      } else {
        $scope.loading = false;
        $scope.msg = false;
      }
      for (var i = 0; i < $scope.last_page; i++) {
        $scope.filas[i] = i+1;
      };
  },function () {
        toastr.error("ERROR INESPERADO, POR FAVOR ACTUALICE LA PÁGINA");
        $scope.loading = false;
        $scope.msg = false;
        $scope.erroor = false;
  });
  }

  $scope.cambia_pagina = function (pag,nro) {
    $scope.nro_filas = nro;
    Personas.get({pac_id:pac_id,nro:nro,page:pag},function(data) {
    $scope.citas = data.cita;
    $scope.last_page = $scope.citas.last_page;
      if($scope.citas.data.length>0){
        //$scope.last_page = $scope.citas.last_page;
        for(var i in $scope.citas.data) {
      $scope.citas.data[i].cit_hora_consulta = toTime($scope.citas.data[i].cit_hora_consulta);
      $scope.citas.data[i].cit_fecha_consulta = moment($scope.citas.data[i].cit_fecha_consulta,"YYYY-MM-DD").format("DD-MM-YYYY");
      }
        $scope.loading = false;
        $scope.msg = data.status;
      } else {
        $scope.loading = false;
        $scope.msg = false;
      }
  },function () {
        toastr.error("ERROR INESPERADO, POR FAVOR ACTUALICE LA PÁGINA");
        $scope.loading = false;
        $scope.msg = false;
        $scope.erroor = false;
  });
  }

  $scope.paginar = function (url){
    if (url != null){
      $http.get(url+'&nro='+$scope.nro_filas).success(function(respuesta){
        $scope.citas = respuesta.cita;
    $scope.last_page = $scope.citas.last_page;
      if($scope.citas.data.length>0){
        //$scope.last_page = $scope.citas.last_page;
        for(var i in $scope.citas.data) {
      $scope.citas.data[i].cit_hora_consulta = toTime($scope.citas.data[i].cit_hora_consulta);
      $scope.citas.data[i].cit_fecha_consulta = moment($scope.citas.data[i].cit_fecha_consulta,"YYYY-MM-DD").format("DD-MM-YYYY");
      }
        $scope.loading = false;
        $scope.msg = respuesta.status;
      } else {
        $scope.loading = false;
        $scope.msg = false;
      }
      });
    }
  }

}])



.controller('CreatePerFamiliarCtrl',['authUser', '$scope', 'PersonasFamiliar', 'CONFIG','$http', 'toastr','$location', '$timeout','$routeParams','Zonas',
function (authUser,$scope, PersonasFamiliar,  CONFIG, $http, toastr, $location, $timeout, $routeParams,Zonas)
{
  if(authUser.isLoggedIn()) {
    $scope.ajustes = {
      menu:{
        titulo: 'Gestión de Familiares',
        items:[
          {nombre:'Pacientes Registrados', enlace:'#/establecimientos/pacientes', estilo:''},
          {nombre:'Registrar Paciente', enlace:'#/pacientes/create', estilo:'active'}]
      },
      pagina:{
        titulo:'Registrar Familiar',
        action:'CREAR'
      }
    }
    $scope.persona = {
        zon_id:null,
        per_ci: null,
        per_tipo_documento: "",
        per_pais: null,
        per_ci_expedido: "LP",
        per_nombres: null,
        per_apellido_primero: null,
        per_apellido_segundo: null,
        per_fecha_nacimiento: null,
        per_genero: null,
        per_email: null,
        per_numero_celular: null,
        per_clave_publica: "",
        per_avenida_calle: "",
        per_numero:null,
        per_ocupacion:"",
        per_tipo_permanencia: "",

        ima_nombre: "perfil.jpg",
        ima_enlace: "./img-per",
        ima_tipo: "fotografia",
        fam_parentesco: "",
        per_id: ""
    
  };
  $scope.zon=false;
  $scope.ver_zonas=function(mun_id){
      console.log(mun_id+"<<< MUN_ID");
      $scope.zon=false;
      Zonas.get({mun_id:mun_id}, function(data){
          $scope.zonas=data.zona;
          console.log("ZOnasss",$scope.zonas);
          //Agregando 26/10/17
          if($scope.zonas.length == 0){
                $scope.zon=true;
          }
          console.log("length "+$scope.zonas.length);
      })
  };
    
/*    $scope.persona = {
      per_ci: null,
      per_ci_expedido: "LP",
      per_nombres: null,
      per_apellido_primero: null,
      per_apellido_segundo: null,
      per_fecha_nacimiento: null,
      per_genero: null,
      per_email: null,
      per_tipo_permanencia: "",
      per_numero_celular: null,
      per_clave_publica: "",
      ima_nombre: "perfil.jpg",
      ima_enlace: "./img-per",
      ima_tipo: "fotografia",
      
      fam_parentesco: "",
      per_id: ""
    };*/
    $scope.settings = {
      pageTitle: "Registrar familiar",
      action: "REGISTRAR"  
    };

    $scope.msg=false;
    $scope.msg1=false;
    $scope.mg=true;
    var per_id = $routeParams.per_id;

    $scope.persona_fam = {};
    $scope.per_id=0;
    $scope.ci=0;
    $scope.nombre = ""; 
    $scope.apellido_p = ""; 
    $scope.apellido_m = "";
    $scope.parentesco = "";

    $http.get(CONFIG.DOMINIO_SERVICIOS+'/persona/'+per_id).success(function(respuesta){
        $scope.persona_fam.per_id = respuesta.persona.persona.per_id;
        $scope.persona_fam.ci = respuesta.persona.persona.per_ci;
        $scope.persona_fam.nombre = respuesta.persona.persona.per_nombres;
        $scope.persona_fam.apellido_p = respuesta.persona.persona.per_apellido_primero;
        $scope.persona_fam.apellido_m = respuesta.persona.persona.per_apellido_segundo;
    });

    $scope.patternCadena = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$/;
    $scope.patternCadenaNumero = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ 0-9]*$/;

    $scope.submit = function(b, fechaNacimiento, c){
      $scope.persona.per_id=per_id;
      $scope.persona.per_ci=c;
      $scope.persona.per_fecha_nacimiento=fechaNacimiento;
      PersonasFamiliar.save($scope.persona).$promise.then(function(data){
        if(data.msg){
          angular.copy({}, $scope.persona);
          $scope.ajustes.pagina.success = "El familiar fue registrad@ exitosamente";
          toastr.success('Familiar agregado Correctamente');
          $timeout(function() {
               $location.path('/pacientes/familiares/'+data.persona.familiar.per_id);
          },1000);
         }
      });
    }
    $scope.reset = function(form) {
      $scope.persona = {};
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
    };
  } else {
    $location.path('/inicio');
  }
}])

.controller('CreateFamiliarCtrl',['$scope', 'Familiar', 'CONFIG','$http', 'toastr','$location', '$timeout','$routeParams','Personas',
function($scope, Familiar,  CONFIG, $http, toastr, $location, $timeout, $routeParams, Personas)
{
     
   $scope.familiar = {
     per_id: 0,
     per_id_familiar: 0,
     fam_parentesco: ""
   };

   $scope.get = function(per_id, per_pac){
      $scope.persona_fam.per_id=per_pac;
      Personas.get({per_id:per_id}, function(data){
        console.log("__get de persona__",data.mensaje);
        $scope.personaF = data.persona;
        $scope.msg = data.mensaje;
        //$scope.fecha_nac = moment($scope.persona.persona.per_fecha_nacimiento,"YYYY-MM-DD").format("DD-MM-YYYY");
      });
    };

   $scope.submit = function(per_id, per_id_familiar, fam_parentesco){
      $scope.familiar.per_id=per_id;
      $scope.familiar.per_id_familiar=per_id_familiar;
      $scope.familiar.fam_parentesco=fam_parentesco;

      Familiar.save($scope.familiar).$promise.then(function(data){
        if(data.msg){
          angular.copy({}, $scope.familiar);
          $scope.ajustes.pagina.success = "El familiar fue registrad@ exitosamente";
          toastr.success('Familiar agregado Correctamente'); 
          $timeout(function() {
              $location.path('/pacientes/familiares/'+data.familiar.familiar.per_id_familiar);
          },1000);
        }
      });
   }
}])

.controller('VerFamPersonaCtrl', ['authUser', '$scope', '$routeParams','toastr','$location', '$timeout','Familiar','Personas','CONFIG',
  function (authUser, $scope, $routeParams, toastr,$location, $timeout, Familiar, Personas, CONFIG){
  if(authUser.isLoggedIn()) {
    $scope.titulo= "Gestión de Pacientes";
    var SesionG = localStorage.getItem("Sesion");
    var SesionG = JSON.parse(SesionG);
    var rol_id1 = CONFIG.ROL_CURRENT_USER;
    $scope.rol_id = rol_id1;
    
    if (rol_id1==1 /*|| rol_id1 == 3 || rol_id1==10*/){
      $scope.ajustes = {
        menu:{
          titulo: 'Gestión de Pacientes',
          items:[
            {nombre:'Pacientes Registrados', enlace:'#/establecimientos/pacientes', estilo:''},
            {nombre:'Registrar Paciente', enlace:'#/pacientes/create', estilo:''},
            {nombre:'Familiares de paciente', enlace:'#/pacientes/familiares/'+$routeParams.per_id, estilo:'active'}]
        },
        pagina:{
          titulo:'Familiares del Paciente'
        }
      }
    }
    else{
      $scope.ajustes = {
        menu:{
          titulo: 'Gestión de Pacientes',
          items:[
            {nombre:'Pacientes Registrados', enlace:'#/establecimientos/pacientes', estilo:''}]
        },
        pagina:{
          titulo:'Familiares del Paciente'
        }
      }
    };

    $scope.loading=true;

    var per_id = $routeParams.per_id;//obtiene el id

    Familiar.update({per_id:per_id}, $scope.var).$promise.then(function(data){

      if(data.mensaje){
        $scope.persona_fam = data.familiar;
        $scope.familiares = data.familiar.familiares;

        if(data.familiar.familiares.length!=0){
            $scope.ver=true;
        }else if(data.familiar.familiares.length==0){
            $scope.ver=false;
        } 

        if(data.mensaje && $scope.familiares.length > 0){
          $scope.loading = false;
          $scope.msg = true;
        }
        else {
          $scope.loading = false;
          $scope.msg = false;
        }  
      }
    })

    $scope.obt_fam=function(per_id){
      Personas.get({per_id:per_id}, function(data){
        $scope.persona = data.persona;
      });
    }

  } else {
    $location.path('/inicio');
  }
}])