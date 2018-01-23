'use strict';
angular.module("adminApp")
.controller('PreregistroCtrl', ['$scope', '$route','PersonasC','toastr','$location', '$timeout', 'vcRecaptchaService','$http','CONFIG','Zonas',
 function ($scope, $route, PersonasC, toastr, $location, $timeout, vcRecaptchaService, $http, CONFIG,Zonas){
	//$scope.ajustes es un objeto de configuracion de las paginas y menus
	$scope.ajustes = {
	  menu:{
		  titulo: 'Gestión del Registro de Personas',
		  items:[{nombre:'Registro de personas', enlace:'#/servicios_ciudadanos/preregistro',estilo:'active'}
				 ]
	  },
	  pagina:{
		  titulo:'Registro de Personas'
	  }
	}
	$scope.entendido = false;
    $scope.pase=false;
	
	$scope.entendi = function(){
		$scope.entendido = true;
    $scope.pase=true;
	};

/*	$scope.persona = {
    per_ci: null,
    per_ci_expedido: null,
    per_nombres: null,
    per_apellido_primero: null,
    per_apellido_segundo: null,
    per_fecha_nacimiento: null,
    per_genero: null,
    per_email: null,
    per_tipo_permanencia: "",
    per_numero_celular: null,
    per_clave_publica: "",
    per_zona_comunidad: null,
    per_avenida_calle: "",
    per_numero: null,
    mun_id: null,
    per_tipo: "DOMICILIO",
    per_nacion: null,
    per_tipo_documento: "",

    ima_nombre: "perfil.jpg",
    ima_enlace: "./img-per",
    ima_tipo: ""
  };*/
 $scope.persona = {
    zon_id:null,
    per_ci: null,
    per_tipo_documento: "",
    per_pais: null,
    per_ci_expedido: "",
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
    per_nacion: null,
    ima_nombre: "perfil.jpg",
    ima_enlace: "./img-per",
    ima_tipo: ""
    
  };
  $scope.patternCadena = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$/;
  $scope.patternCadenaNumero = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ 0-9.-]*$/;

  $scope.required = true;
  $scope.exp=true;
  $scope.paises=false;

  $scope.documento=function(){
    $scope.exp=true;
    $scope.exp_ext=false;
    $scope.required = true;
    $scope.required_p = false;   // valida el required del pais :)
    $scope.required_e = false;  // valida el required del expedido :)
    $scope.disabled = false;
    $scope.disabled_pais=true;  // valida el disabled del pais :)

    if($scope.persona.per_tipo_documento=="PASAPORTE"){
      $scope.paises=true;
      $scope.exp=false;
      $scope.exp_ext=true;
      $scope.valor_exp="EXTRANJERO";
      $scope.persona.per_ci_expedido="EXTRANJERO"
      $scope.disabled = false;
      $scope.required = true;
      $scope.required_p = true;    // valida el required del pais :)
      $scope.required_e = false;   // valida el required del expedido :)
      $scope.disabled_pais=false;   // valida el disabled del pais :)
    };
    if($scope.persona.per_tipo_documento=="CI"){
      $scope.paises=false;
      $scope.exp=true;
      $scope.exp_ext=false;
      $scope.disabled = false;
      $scope.required = true;
      $scope.required_p = false;   // valida el required del pais :)
      $scope.required_e= true;    // valida el required del expedido :)
      $scope.disabled_pais=true;   // valida el disabled del pais :)
    }
  };

  $scope.zon=false;
$scope.zon_selec="";
  $scope.ver_zonas=function(mun_id){
      console.log(mun_id+"<<< MUN_ID");
      $scope.zon=false;
      Zonas.get({mun_id:mun_id}, function(data){
          $scope.zonas=data.zona;
          //Agregando 26/10/17
          if($scope.zonas.length == 0){
                $scope.zon=true;
          }
          console.log("length "+$scope.zonas.length);
      })
  };

/*  $scope.ver_estab=function(){
    var zona=$scope.persona.per_zona_comunidad.zon_id;
    $http.get(CONFIG.DOMINIO_SERVICIOS+'/establecimientos_por_zona/'+zona).success(function(respuesta){
       $scope.establecimientos=respuesta.zona;
        console.log($scope.establecimientos+"VALOR");
    });
  };*/

    $scope.ver_selec=function(zon_id){
   console.log(zon_id+"<<< ZON_ID");
    $http.get(CONFIG.DOMINIO_SERVICIOS+'/zonass/'+zon_id).success(function(respuesta){
       $scope.wen=respuesta.zona;
        console.log($scope.wen.zon_nombre+"__ZONAS__wendy");
        console.log(respuesta.zona+"__respuesta__wendy");
    });
  };

  /*PARA HABILITAR LOS BOTONES*/
  $scope.checkbox='checked';
  $scope.visible = false;

  $scope.toggle = function () {
    $scope.visible = !$scope.visible;
    if(!$scope.visible){
      $scope.aviso="DESCARTA";
      $scope.mensaje="";
    }else{
      $scope.aviso = "ACEPTA";
    $scope.mensaje="REVISE SUS DATOS ANTES DE REGISTRARSE";
    } 
  };

  $scope.pre_reg=false;

     /**** PARA CAPTCHA*****/
      $scope.response = null;
      $scope.widgetId = null;

      $scope.model = {
        key: '6LfC2xkUAAAAAIzfLxhUiIPsDYKAsNJY7W_8f3i5'
      };

      $scope.setResponse = function (response) {
          $scope.response = response;
      };

      $scope.setWidgetId = function (widgetId) {
          $scope.widgetId = widgetId;
      };

      $scope.cbExpiration = function() {//cuando el captcha expira
          vcRecaptchaService.reload($scope.widgetId);

          $scope.response = null;
      };
     /*FIN CAPTCHA*/
    $scope.submit = function(b, fechaNac, ci, suf)
    {
        $scope.persona.per_fecha_nacimiento=fechaNac;
        
        /*$scope.persona.per_zona_comunidad=zona;*/
        //$scope.pacientes.per_ci=per_ci;
        
        if($scope.persona.per_tipo_documento=="CI"){
          $scope.persona.per_nacion="BOLIVIA";
          if (suf!="NO TIENE") {
            $scope.persona.per_ci=ci+'-'+suf;
          }
          if (suf=="NO TIENE") {
            $scope.persona.per_ci=ci;
          }
        }
        if($scope.persona.per_tipo_documento=="PASAPORTE"){
          $scope.persona.per_ci_expedido="EXTRANJERO";
          $scope.persona.per_ci="E-"+ci;
        }
        PersonasC.save($scope.persona).$promise.then(function(data)
        {
            if(data.msg)
            {
                $scope.msg = data.msg;
                angular.copy({}, $scope.pacientes);
                $scope.ajustes.pagina.success = "Paciente guardado correctamente";////COMENTAR ESTO
                $scope.persona=data.persona;

                toastr.success('USTED SE HA REGISTRADO CORRECTAMENTE');
/*                $timeout(function() {
                    //$location.path('/servicios_ciudadanos/preregistro/ver/'+data.persona.personas.per_id);
                    $location.path('/inicio');

                },2000);*/
            }
        },function () {
          console.log("error");
          toastr.error("Error inesperado");
        })
    };
    $scope.cancelar=function(){
       // $route.reload();
        $location.path('/inicio');
    };
    $scope.hecho = function(valor){
   
    $timeout(function() {
      if(valor!=false)
      { console.log("entro a la functionnnnnn "+valor);
        $route.reload();
      } else
      {
        $location.path('/inicio');
      }
    },1000)
    
  }
}])

.controller('VerPreregistroCtrl', ['$scope', 'Personas', '$routeParams', '$http', 'CONFIG', 
  function ($scope, Personas, $routeParams, $http, CONFIG){

  $scope.loading=true;
  var per_id = $routeParams.per_id;
  /*Personas.get({per_id:per_id}, function(data){
    $scope.persona = data.persona;
  });*/
  $http.get(CONFIG.DOMINIO_SERVICIOS+"/personas/"+per_id)
    .success(function(data){
      $scope.persona = data.persona;
      $scope.para_qr=$scope.persona.persona.per_nombres+" "+$scope.persona.persona.per_apellido_primero+" "+$scope.persona.persona.per_apellido_segundo;
       //$scope.para_qr="NINOSCA GARCIA TENORIO LA MOSCA";
     

      if ($scope.persona.persona.per_genero=='F' || $scope.persona.persona.per_genero=='f'){
        $scope.persona.persona.per_genero='Femenino';
      }
      else if($scope.persona.persona.per_genero=='M' || $scope.persona.persona.per_genero=='m'){
        $scope.persona.persona.per_genero='Masculino';
      }
      $scope.loading = false;
      $scope.msg = data.mensaje;
      $scope.fecha_nac = moment($scope.persona.persona.per_fecha_nacimiento,"YYYY-MM-DD").format("DD-MM-YYYY");
    })
    .error(function(err){
      $scope.loading = false;
    });

        $scope.v=5;
    $scope.valor="ffff";
}])
/*
 * angular-qrcode v6.2.1
 * (c) 2013 Monospaced http://monospaced.com
 * License: MIT
 */
.directive('qrcode', ['$window', function($window) {
  console.log("ens direciva");

  var canvas2D = !!$window.CanvasRenderingContext2D,
      levels = {
        'L': 'Low',
        'M': 'Medium',
        'Q': 'Quartile',
        'H': 'High'
      },
      draw = function(context, qr, modules, tile) {
        for (var row = 0; row < modules; row++) {
          for (var col = 0; col < modules; col++) {
            var w = (Math.ceil((col + 1) * tile) - Math.floor(col * tile)),
                h = (Math.ceil((row + 1) * tile) - Math.floor(row * tile));

            context.fillStyle = qr.isDark(row, col) ? '#000' : '#fff';
            context.fillRect(Math.round(col * tile),
                             Math.round(row * tile), w, h);
          }
        }
      };

  return {
    restrict: 'E',
    template: '<canvas class="qrcode"></canvas>',
    link: function(scope, element, attrs) {
      var domElement = element[0],
          $canvas = element.find('canvas'),
          canvas = $canvas[0],
          context = canvas2D ? canvas.getContext('2d') : null,
          download = 'download' in attrs,
          href = attrs.href,
          link = download || href ? document.createElement('a') : '',
          trim = /^\s+|\s+$/g,
          error,
          version,
          errorCorrectionLevel,
          data,
          size,
          modules,
          tile,
          qr,
          $img,
          setVersion = function(value) {
            version = Math.max(1, Math.min(parseInt(value, 10), 40)) || 5;
          },
          setErrorCorrectionLevel = function(value) {
            errorCorrectionLevel = value in levels ? value : 'M';
          },
          setData = function(value) {
            if (!value) {
              return;
            }

            data = value.replace(trim, '');
            qr = qrcode(version, errorCorrectionLevel);
            qr.addData(data);

            try {
              qr.make();
            } catch(e) {
              error = e.message;
              return;
            }

            error = false;
            modules = qr.getModuleCount();
          },
          setSize = function(value) {
            size = parseInt(value, 10) || modules * 2;
            tile = size / modules;
            canvas.width = canvas.height = size;
          },
          render = function() {
            if (!qr) {
              return;
            }

            if (error) {
              if (link) {
                link.removeAttribute('download');
                link.title = '';
                link.href = '#_';
              }
              if (!canvas2D) {
                domElement.innerHTML = '<img src width="' + size + '"' +
                                       'height="' + size + '"' +
                                       'class="qrcode">';
              }
              scope.$emit('qrcode:error', error);
              return;
            }

            if (download) {
              domElement.download = 'qrcode.png';
              domElement.title = 'Download QR code';
            }

            if (canvas2D) {
              draw(context, qr, modules, tile);

              if (download) {
                domElement.href = canvas.toDataURL('image/png');
                return;
              }
            } else {
              domElement.innerHTML = qr.createImgTag(tile, 0);
              $img = element.find('img');
              $img.addClass('qrcode');

              if (download) {
                domElement.href = $img[0].src;
                return;
              }
            }

            if (href) {
              domElement.href = href;
            }
          };

      if (link) {
        link.className = 'qrcode-link';
        $canvas.wrap(link);
        domElement = domElement.firstChild;
      }

      setVersion(attrs.version);
      setErrorCorrectionLevel(attrs.errorCorrectionLevel);
      setSize(attrs.size);

      attrs.$observe('version', function(value) {
        if (!value) {
          return;
        }

        setVersion(value);
        setData(data);
        setSize(size);
        render();
      });

      attrs.$observe('errorCorrectionLevel', function(value) {
        if (!value) {
          return;
        }

        setErrorCorrectionLevel(value);
        setData(data);
        setSize(size);
        render();
      });

      attrs.$observe('data', function(value) {
        if (!value) {
          return;
        }

        setData(value);
        setSize(size);
        render();
      });

      attrs.$observe('size', function(value) {
        if (!value) {
          return;
        }

        setSize(value);
        render();
      });

      attrs.$observe('href', function(value) {
        if (!value) {
          return;
        }

        href = value;
        render();
      });
    }
  };
}]);
