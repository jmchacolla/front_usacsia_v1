'use strict';
angular.module('adminApp')
// ************************* CONSTANTES *****************************************************************

// ========================= CONFIGURACION ============================================================================
.constant('CONFIG', {
  ROL_CURRENT_USER: parseInt(localStorage.getItem("ROL_CURRENT_USER"), 10),//este es el usuario que esta logueado
  ROL_CURRENT_USER_NAME: localStorage.getItem("ROL_CURRENT_USER_NAME"),
  // DOMINIO_SERVICIOS: "http://190.181.60.19/api_awebss/public"
  // DOMINIO_SERVICIOS: "http://localhost:8000"//---------------------jhon
  // DOMINIO_SERVICIOS: "http://192.168.6.221:90/api_usacsia_v1_0/public"




//DOMINIO_SERVICIOS: "http://localhost/api_usacsia_v1_0/public"


 //wendy


DOMINIO_SERVICIOS: "http://localhost:8080/api_usacsia_v1_0/public"



//vero

// DOMINIO_SERVICIOS: "http://localhost/usacsia_php_5.6/solo_api_dorys_git/api_usacsia_v1_0/public"



// DOMINIO_SERVICIOS: "http://192.168.6.223/usacsia_php_5.6/solo_api_dorys_git/api_usacsia_v1_0/public"




})


// ========================= ROLES ============================================================================
.constant('ROLES', {
   ADMIN_USACSIA: {
    ROL:1,
    PATH:"/"
  },
  JEFE_USACSIA: {
    ROL:2,
    PATH:"/"
  },
  CAJERO: {
    ROL:3,
    PATH:"/"
  },
  PERSONA: {
    ROL:4,
    PATH:"/"
  },
  PACIENTE: {
    ROL:5,
    PATH:"/"
  },
  EMPRESA: {
    ROL:6,
    PATH:"/"
  },
  ADMIN_CARNET: {
    ROL:7,
    PATH:"/"
  },
  RECEPCIONISTA: {
    ROL:8,
    PATH:"/"
  },
  MEDICO: {
    ROL:9,
    PATH:"/"
  },
  ENFERMERA: {
    ROL:10,
    PATH:"/"
  },
  RESPONSABLE_LAB: {
    ROL:11,
    PATH:"/"
  },
  RECEP_LAB: {
    ROL:12,
    PATH:"/"
  },
  TECNICO_LABORATORIO: {
    ROL:13,
    PATH:"/"
  },
  ADMIN_CERTIFICADO: {
    ROL:14,
    PATH:"/"
  },
  REVISOR: {
    ROL:15,
    PATH:"/"
  },
  INSPECTOR: {
    ROL:16,
    PATH:"/"
  },
  JEFE_FINANCIERA: {
    ROL:17,
    PATH:"/"
  },
  RESPONSABLE_TESORERIA: {
    ROL:18,
    PATH:"/"
  }
})

.run(["$rootScope", "$location", "CONFIG", "ROLES",   function($rootScope, $location, CONFIG, ROLES){
  $rootScope.$on('$routeChangeStart', function (event, next)
  { 
    /*console.log(next.data);*/
    if(next.data !== undefined)
    { 
      if(next.data.authorized.indexOf(CONFIG.ROL_CURRENT_USER) !== -1)
      {
        //console.log("entra");
      }
      else
      {
        if (CONFIG.ROL_CURRENT_USER == 1) {
          $location.path(ROLES.ADMIN_USACSIA.PATH);
        }
        else if (CONFIG.ROL_CURRENT_USER == 2) {
          $location.path(ROLES.JEFE_USACSIA.PATH);
        }
        else if (CONFIG.ROL_CURRENT_USER == 3) {
          $location.path(ROLES.CAJERO.PATH);
        }
        else if (CONFIG.ROL_CURRENT_USER == 4) {
          $location.path(ROLES.PERSONA.PATH);
        }
        else if (CONFIG.ROL_CURRENT_USER == 5) {
          $location.path(ROLES.PACIENTE.PATH);
        }
        else if (CONFIG.ROL_CURRENT_USER == 6) {
          $location.path(ROLES.EMPRESA.PATH);
        }
        else if (CONFIG.ROL_CURRENT_USER == 7) {
          $location.path(ROLES.ADMIN_CARNET.PATH);
        }
        else if (CONFIG.ROL_CURRENT_USER == 8) {
          $location.path(ROLES.RECEPCIONISTA.PATH);
        }
        else if (CONFIG.ROL_CURRENT_USER == 9) {
          $location.path(ROLES.MEDICO.PATH);
        }
        else if (CONFIG.ROL_CURRENT_USER == 10) {
          $location.path(ROLES.ENFERMERA.PATH);
        }
        else if (CONFIG.ROL_CURRENT_USER == 11) {
          $location.path(ROLES.RESPONSABLE_LAB.PATH);
        }
        else if (CONFIG.ROL_CURRENT_USER == 12) {
          $location.path(ROLES.RECEP_LAB.PATH);
        }
         else if (CONFIG.ROL_CURRENT_USER == 13) {
          $location.path(ROLES.TECNICO_LABORATORIO.PATH);
        }
         else if (CONFIG.ROL_CURRENT_USER == 14) {
          $location.path(ROLES.ADMIN_CERTIFICADO.PATH);
        }
        else if (CONFIG.ROL_CURRENT_USER == 15) {
          $location.path(ROLES.REVISOR.PATH);
        }
        else if (CONFIG.ROL_CURRENT_USER == 16) {
          $location.path(ROLES.INSPECTOR.PATH);
        }
        else if (CONFIG.ROL_CURRENT_USER == 17) {
          $location.path(ROLES.JEFE_FINANCIERA.PATH);
        }
         else if (CONFIG.ROL_CURRENT_USER == 18) {
          $location.path(ROLES.RESPONSABLE_TESORERIA.PATH);
        }
      }
    }
  });
}])

/*.run(['$http', '$auth', 'authUser', function ($http, $auth, authUser) {
//  $auth.getToken();
//console.log(authUser.isLoggedIn());
  if (authUser.isLoggedIn())
  { console.log("en el ruuuuuuun");
    $http.defaults.headers.common.Authorization = 'Bearer <myApp_token>';}
}])*/

// jmchacolla@gmail.com
// @Jhon123m