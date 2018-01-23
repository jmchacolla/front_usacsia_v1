'use strict';
angular.module("adminApp")
.controller('CrearReservaCtrl', ['$scope', '$route', '$routeParams', 'ReservasAtiende', 'Citas', 'Pacientes', 'Funcionarios', '$http', 'CONFIG','$location', '$timeout', 'toastr',
	function ($scope,$route,$routeParams,ReservasAtiende,Citas,Pacientes,Funcionarios,$http, CONFIG, $location, $timeout, toastr){
	$scope.ajustes = {
	  menu:{
		  titulo: 'Servicios al ciudadano',
		  items:[{nombre:'Reservar cita medica', enlace:'#/servicios_ciudadanos/realizar_reserva',estilo:'active'},
		  		 {nombre:'Cita previa para familiares', enlace:'#/servicios_ciudadanos/realizar_reserva_familiar',estilo:''},
				 {nombre:'Citas realizadas', enlace:'#/servicios_ciudadanos/listar_reservas',estilo:''}]
	  },
	  pagina:{
		  titulo:'Reservar cita medica'
	  }
	}
	$scope.entendido = false;
	$scope.entendi = function(){
		$scope.entendido = true;
	};

	$scope.reserva = {};//se llenará este objeto para realizar la reserva:
	var pac_id = 0;


   	if ($routeParams.pac_id !=null){
   		pac_id = $routeParams.pac_id;
   		$scope.pac_id_fam = pac_id;
   		$scope.ajustes.menu.items[0].estilo = "";
   		$scope.ajustes.menu.items[1].estilo = "active";
   		$scope.es_familiar=true;
   	} else {
   		pac_id = parseInt(localStorage.getItem("PacId"), 10);
   		$scope.es_familiar=false;
   	}
   	$scope.pac_id = pac_id;
   	
   	$http.get(CONFIG.DOMINIO_SERVICIOS+'/establecimientos_reservas/'+pac_id).success(function(respuesta){
        $scope.pac_est = respuesta.establecimiento;
    });

	$scope.selecciona_ser=function(){
		var id_es = $scope.datosEstab.es_id;
	    $http.get(CONFIG.DOMINIO_SERVICIOS+'/servicios_no_referencias/'+id_es).success(function(respuesta){
	      $scope.servicios=respuesta.servicio_establecimiento;
     	});
    };

    $scope.buscar = false;
	$scope.loading = true;
	$scope.tiene_cita = false;
	$scope.busca_horarios = function(){
		$scope.buscar = true;
		$scope.loading = true;
		$scope.tiene_cita = false;
		$scope.msg = false;
		$scope.erroor = true;
		$scope.horariosd = [];
		ReservasAtiende.get({pre_id:$scope.datosSer.se_id, pac_id:pac_id}, function(data){
			if (data.atiende_diariamente =="false") {
				toastr.error("EL USUARIO YA TIENE UNA TIENE UNA CITA MÉDICA");
				$scope.msg = false;
				$scope.tiene_cita = true;
				$scope.loading = false;
			} else {
				$scope.horariosd = data.atiende_diariamente;
				for(var i in $scope.horariosd) {
					$scope.horariosd[i].ad_hora_inicio = toTime($scope.horariosd[i].ad_hora_inicio);
					$scope.horariosd[i].ad_fecha_atiende = moment($scope.horariosd[i].ad_fecha_atiende,"YYYY-MM-DD").format("DD-MM-YYYY");
				}
				if($scope.horariosd.length > 0){
					$scope.msg = data.status;
				}
				$scope.loading = false;		
			}
		},function () {
	      toastr.error("ERROR INESPERADO, POR FAVOR VUELVA A INTENTAR");
	      $scope.loading = false;
	      $scope.msg = false;
	      $scope.erroor = false;
	    });
	};
	$scope.sortType = 'ch_id'; // set the default sort type
  	$scope.sortReverse  = true;  // set the default sort order
	$scope.msg = false;
	$scope.get_ch_id = function(atiende_diariamente){
  		$scope.msg = false;
		$scope.atiende = atiende_diariamente;
		$scope.nombre_estab = $scope.datosEstab.es_nombre;
	}

	$scope.submit = function(){
		$scope.reserva.ad_id = $scope.atiende.ad_id;
		$scope.reserva.pac_id = pac_id;
		$scope.reserva.cit_motivo_consulta = "";
		$scope.reserva.cit_estado_asistencia = false;//activo,
		$scope.reserva.cit_tipo = "RESERVA";//CITA (del medico) RESERVA(del paciente)
		$scope.reserva.cit_es_id = $scope.datosEstab.es_id;
		$scope.reserva.cit_con_id = $scope.atiende.con_id;
		$scope.reserva.cit_se_id = $scope.atiende.sc_id;
		$scope.reserva.cit_nro_ficha = $scope.atiende.ad_numero_ficha;
		$scope.reserva.cit_estado_pago = false;
		$scope.reserva.cit_estado_confirmacion = true;

		Citas.save($scope.reserva).$promise.then(function(data){
			if(data.status){
				$scope.msg = data.status;
				toastr.success('Reserva realizada correctamente');
				//limpiando los datos de busqueda
				angular.copy({}, $scope.horariosd);
				$scope.buscar = false;
				$scope.loading = true;

				Pacientes.get({pac_id:data.cita.cita.pac_id}, function(data){
					$scope.paciente = data.paciente;
				})
				Funcionarios.get({fe_id:data.cita.cita.cit_fe_id}, function(data){
					$scope.funcionario = data.funcionario;
				})
				$scope.fecha_cita = moment(data.cita.cita.cit_fecha_consulta,"YYYY-MM-DD").format("DD-MM-YYYY");
			}
		});
	}

	$scope.hecho = function(valor, pac_id){
		$timeout(function() {
			if(valor!=false){	
    			$route.reload();
    		} else {
    			if($scope.es_familiar){
    				$location.path('/servicios_ciudadanos/listar_reservas/'+pac_id);
    			} else {
    				$location.path('/servicios_ciudadanos/listar_reservas');
    			}
    		}
		},1000)
	}

	function toTime(timeString){
	    var timeTokens = timeString.split(':');
	    return new Date(1970,0,1, timeTokens[0], timeTokens[1], timeTokens[2]);
	}
	/*var start = "14:00:00";
	$scope.date = toTime(start);
	console.log($scope.date);*/
}])

.controller('CrearReservaFamiliarCtrl', ['$scope','Familiar', function ($scope,Familiar) {
	$scope.ajustes = {
	  menu:{
		  titulo: 'Servicios al ciudadano',
		  items:[{nombre:'Reservar cita medica', enlace:'#/servicios_ciudadanos/realizar_reserva',estilo:''},
		  		 {nombre:'Cita previa para familiares', enlace:'#/servicios_ciudadanos/realizar_reserva_familiar',estilo:'active'},
				 {nombre:'Citas realizadas', enlace:'#/servicios_ciudadanos/listar_reservas',estilo:''}]
	  },
	  pagina:{
		  titulo:'Familiares Registrados'
	  }
	}

	$scope.sortType = 'per_id'; 
	$scope.sortReverse  = true; 
	$scope.loading=true;
	$scope.error_inesperado=false;

	var SesionG = localStorage.getItem("Sesion");
  	var SesionG = JSON.parse(SesionG);
	Familiar.get({per_id:SesionG.per_id}, function(data) {
		$scope.familiares = data.familiar;
		if($scope.familiares.familiares.length>0){
	        $scope.loading = false;
	      	$scope.msg = data.status;
	    } else {
	      	$scope.loading = false;
	      	$scope.msg = false;
	    }
	},function () {
	    $scope.loading = false;
	    $scope.msg = false;
	    //$scope.error_inesperado = false;
	});
}])

//Lista las reservas y citas médicas de un paciente
.controller('ListaReservaPacienteCtrl', ['$scope', '$routeParams', '$timeout','$location','ReservasPaciente', 'Citas', 'toastr', 'Establecimientos', '$http',
	function ($scope,$routeParams,$timeout,$location,ReservasPaciente,Citas,toastr,Establecimientos,$http) {
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
	ReservasPaciente.get({pac_id:pac_id,nro:$scope.nro_filas},function(data) {
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

  $scope.numero_filas = function (nro) {
    $scope.cargando = true;
    if($scope.cargando) {
        toastr.info('Cargando ...', {
          positionClass: 'toast-top-center',
          tapToDismiss: false
        });
      }
    ReservasPaciente.get({pac_id:pac_id,nro:nro},function(data) {
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
    ReservasPaciente.get({pac_id:pac_id,nro:nro,page:pag},function(data) {
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

  	$scope.ver_cita = function(id_cita, nombre_consultorio, nombre_servicio, fecha,hora,estado_confirmacion,tipo){
  		$scope.id_cita = id_cita;
  		$scope.estado_confirmacion = estado_confirmacion;
  		$scope.datos_cita = {};
  		$scope.nombre_establecimiento = "";
  		$scope.tipo = tipo;
  		Citas.get({cit_id:id_cita},function(data){
			$scope.datos_cita = data.cita;
			$scope.datos_cita.cit_hora_consulta = toTime($scope.datos_cita.cit_hora_consulta);

			Establecimientos.get({es_id:$scope.datos_cita.cit_es_id},function(data){
				$scope.nombre_establecimiento = data.establecimiento.establecimientos.es_nombre;
			})
		});

		$scope.con_nombre = nombre_consultorio;
		$scope.ser_nombre = nombre_servicio;
		$scope.fecha = fecha;
		$scope.hora = hora;
  	}

  	//La fecha para verificar
  	/*	$scope.CurrentDate = new Date();*/
  	//console.log("fecha "$scope.CurrentDate);
  	$scope.vercita = function(cit_id){//Para cancelar una cita médica
  		console.log("el cit id es"+cit_id);
		$timeout(function() {
			$location.path('/cita/view/'+cit_id);
    	},1000)
	}

  	function toTime(timeString){
	    var timeTokens = timeString.split(':');
	    return new Date(1970,0,1, timeTokens[0], timeTokens[1], timeTokens[2]);
	}
}])

//lista las reservas y citas progra de un establecimiento del día (Administrador, Administrador médico, Admisionista)
.controller('IndexReservaCtrl', ['$scope', '$route', 'toastr','ReservasDia', '$http', 'CONFIG', 'Pacientes','Citas','Pacientes_adm', '$timeout', '$location','Funcionarios',
 function ($scope,$route,toastr,ReservasDia,$http, CONFIG, Pacientes, Citas,Pacientes_adm,$timeout,$location,Funcionarios){
	$scope.rol_id=CONFIG.ROL_CURRENT_USER;
	if($scope.rol_id == 2 || $scope.rol_id == 6) {
		$scope.ajustes = {
		  	menu:{
			  titulo: 'Citas Médicas del día',
			  items:[{nombre:'Citas realizadas', enlace:'#/reservas/listar_reservas',estilo:'active'},
					 {nombre:'Historial de Citas', enlace:'#/reservas/historial_reservas',estilo:''}]
		  	},
		  	pagina:{
			  titulo:'Citas Médicas del día del establecimiento'
			}
		}
	} else {//Para el administrador médico
		$scope.ajustes = {
		  	menu:{
			  titulo: 'Citas Médicas del día',
			  items:[{nombre:'Mis Citas', enlace:'#/reservas/listar_reservas_med',estilo:''},
			  		 {nombre:'Citas Médicas', enlace:'#/reservas/listar_reservas',estilo:'active'},
			  		 {nombre:'Citas Programadas', enlace:'#/cita/list',estilo:''},
					 {nombre:'Historial de Citas', enlace:'#/reservas/historial_reservas',estilo:''}]
		  	},
		  	pagina:{
			  titulo:'Citas Médicas del día del establecimiento'
			}
		}
	}
	$scope.loading = true;
	var FunG = localStorage.getItem("Funcionario");
	var FunG = JSON.parse(FunG);
	
	$scope.info="warning";
	$scope.patternFecha = /^(0[1-9]|1[0-9]|2[0-9]|3[01]).(0[1-9]|1[012]).[0-9]{4}$/;
	$scope.error_inesperado = false;
	ReservasDia.get({es_id:FunG.es_id},function(data){
	    $scope.reservas = data.cita;
	    if(data.status && $scope.reservas.length > 0){
	      for(var i in $scope.reservas) {
			$scope.reservas[i].cit_hora_consulta = toTime($scope.reservas[i].cit_hora_consulta);
		  }
	      $scope.loading = false;
	      $scope.msg = data.status;
	    }
	    else{
	      $scope.loading = false;
	    }
	},function () {
	    $scope.loading = false;
	    $scope.msg = false;
	    toastr.error("ERROR INESPERADO, POR FAVOR ACTUALICE LA PÁGINA");
	    $scope.error_inesperado = true;
    });

  	$scope.sortType='cit_fecha_consulta';
  	$scope.sortReverse=true;

  	/////////////////////AGREGAR LA FUNCION DE VERIFICA ////////////////////////////
	var es_id = FunG.es_id;
	$scope.paciente_per={
        es_id: "",
        pac_id: "",
        pe_hist_clinico:""
    };

    $scope.paciente_per.es_id = es_id;

	$scope.mostrar=false;
    $scope.obtiene_datos=function(per_id, cit_id){
	    $http.get(CONFIG.DOMINIO_SERVICIOS+'/pacientes_personas/'+per_id).success(function(respuesta){

	      	var pac_id=respuesta.paciente[0].pac_id;
	      	$scope.res_cit_id=cit_id;

	      	  //Verifica si el paciente ya tiene codigo de historial en el establecimeinto
	      	  //true:
	      	  //false:
		      $http.get(CONFIG.DOMINIO_SERVICIOS+'/pacientes_establecimientos/'+pac_id+'/'+es_id).success(function(respuesta){
		          if(respuesta.estado=="true"){
		              $scope.switch="true";
		              //1 admitir asignandole el codifgo de histrial
		              $scope.valor="1";
		              $scope.admitir_E=function(pac_id){
		              
		              $scope.paciente_per.pac_id=pac_id;
		              $scope.paciente_per.pe_hist_clinico=null;

		              Pacientes_adm.save($scope.paciente_per).$promise.then(function(data){
		                  if (data.status) {
		                    toastr.success('PACIENTE HABILITADO');
		                    $timeout(function() {
		                        $location.path('/pacientes/ver/'+data.paciente_establecimiento.pac_id);
		                    },1000);
		                  }
		              });
		            };
		          }else if(respuesta.estado=="false"){
		          	// 0 habilitar
		              $scope.valor="0";
		              $scope.admitir=function(pac_id){
		                $scope.paciente_per.pac_id=pac_id;

		                Pacientes_adm.save($scope.paciente_per).$promise.then(function(data){
		                   if (data.status) {
		                      toastr.success('PACIENTE ADMITIDO');
		                      $timeout(function() {
		                          $location.path('/pacientes/ver/'+data.paciente_establecimiento.pac_id);
		                      },1000);
		                   }
		                });
		              };
		          }
		      });

		      $scope.mostrar=true;
		      Pacientes.get({pac_id:pac_id}, function(data){
		          $scope.pac_per=data.paciente;
		          $scope.fecha_nac = moment($scope.pac_per.persona.per_fecha_nacimiento,"YYYY-MM-DD").format("DD-MM-YYYY");
		      });
	   	});

	    var cit_id = cit_id;
		Citas.get({cit_id:cit_id}, function(data){
			$scope.citas = data.cita;
			$scope.cit_hora_consulta = toTime($scope.citas.cit_hora_consulta);
			$scope.cit_nro_ficha = $scope.citas.cit_nro_ficha;

			Pacientes.get({pac_id:$scope.citas.pac_id}, function(data){
			    $scope.paciente = data.paciente;
			});

			Funcionarios.get({fe_id:$scope.citas.cit_fe_id}, function(data){
				$scope.funcionario=data.funcionario;
			});

			$scope.cit_hora_consulta=toTime($scope.citas.cit_hora_consulta);

			$http.get(CONFIG.DOMINIO_SERVICIOS+'/consultorios/'+$scope.citas.cit_con_id).success(function(respuesta){
	        	$scope.nom_consultorio=respuesta.consultorio.consultorio.con_nombre;
			});
		});
    };//fin funcion obtiene datos

    $scope.estado_pago = function(cit_id){
		$scope.cita={
	  	   cit_estado_pago:true
	  	};
		Citas.update({cit_id:cit_id},$scope.cita).$promise.then(function(data){
	  	  if(data.mensaje){
	          $scope.ajustes.pagina.success = "ok";
	          $route.reload();
	      }
		})
  	};

  	var date = new Date();
  	$scope.m = moment(date).format('DD-MM-YYYY');
  	
  	function toTime(timeString){
	    var timeTokens = timeString.split(':');
	    return new Date(1970,0,1, timeTokens[0], timeTokens[1], timeTokens[2]);
	}
}])

.controller('VerReservaCtrl', ['$scope', '$route', 'Citas', '$routeParams','$http', 'CONFIG','Funcionarios',
 function ($scope,$route,Citas,$routeParams,$http, CONFIG, Funcionarios){
	$scope.obt_cita=function(cit_id, nombre_servicio, nro_cita, nombres, ape_paterno, ape_materno){
		var cit_id = cit_id;
		Citas.get({cit_id:cit_id}, function(data){
			$scope.citas=data.cita;
			$scope.cit_hora_consulta=toTime($scope.citas.cit_hora_consulta);

			$scope.paciente = nombres + " "+ ape_paterno + " " + ape_materno;
			$scope.nro_ficha_sesar = nro_cita;
			$scope.nombre_ser=nombre_servicio;
			
			Funcionarios.get({fe_id:$scope.citas.cit_fe_id}, function(data){
				$scope.funcionario=data.funcionario;
			});

			$http.get(CONFIG.DOMINIO_SERVICIOS+'/consultorios/'+$scope.citas.cit_con_id).success(function(respuesta){
	        	$scope.nom_consultorio=respuesta.consultorio.consultorio.con_nombre;
			});
		});
	}

    function toTime(timeString){
	    var timeTokens = timeString.split(':');
	    return new Date(1970,0,1, timeTokens[0], timeTokens[1], timeTokens[2]);
	}
 }])

//Solo es para ver la cita programada cita programada por parte del paciente
.controller('VerCitaCtrl', ['$scope', '$route','Cons', '$location','$timeout','Citas', '$routeParams','$http', 'CONFIG', 'Pacientes','Funcionarios','toastr','CitaConfirmacion',
 function ($scope,$route,Cons,$location,$timeout,Citas,$routeParams,$http, CONFIG, Pacientes, Funcionarios,toastr,CitaConfirmacion){
	$scope.ajustes = {
	  menu:{
		  titulo: 'Citas Médicas',
		  items:[{nombre:'Reservar cita medica', enlace:'#/servicios_ciudadanos/realizar_reserva',estilo:''},
		  		 {nombre:'Cita previa para familiares', enlace:'#/servicios_ciudadanos/realizar_reserva_familiar',estilo:''},
				 {nombre:'Citas realizadas', enlace:'#/servicios_ciudadanos/listar_reservas',estilo:''}]
	  },
	  pagina:{
		  titulo:'Cita Médica Programada'
	  }
	}

	$scope.pac_id = parseInt(localStorage.getItem("PacId"), 10);
	
	$scope.return = function(pac_id){
		$timeout(function() {
			console.log(pac_id);
			if(pac_id!=null) {
				$location.path('/servicios_ciudadanos/listar_reservas/'+pac_id);
			} else {
				$location.path('/servicios_ciudadanos/listar_reservas');
			}
		},1000)
	}

	var cit_id = $routeParams.cit_id;

	Citas.get({cit_id:cit_id}, function(data){

		$scope.citas=data.cita;
		$scope.citas.cit_fecha_consulta = moment($scope.citas.cit_fecha_consulta,"YYYY-MM-DD").format("DD-MM-YYYY");
		if($scope.pac_id != $scope.citas.pac_id){
			$scope.es_familiar=true;
		}

		$scope.cit_hora_consulta=toTime($scope.citas.cit_hora_consulta);

		//Para obtener el nombre del paciente
		Pacientes.get({pac_id:$scope.citas.pac_id}, function(data){
			$scope.paciente = data.paciente.persona;
		});
		//para obtener el nombre del servicio
		console.log($scope.citas.cit_con_id);
		Cons.get({con_id:$scope.citas.cit_con_id}, function(data){
			$scope.servicio=data.consultorio.servicio_consultorio;
			if($scope.servicio.length > 0){
				for(var i = 0; i < $scope.servicio.length; i++) {
					if($scope.servicio[i].sc_id == $scope.citas.cit_se_id){
						$scope.nomser = data.consultorio.servicio_consultorio[i].ser_nombre;
					}
				}
			}else{
				$scope.nomser = data.consultorio.servicio_consultorio[0].ser_nombre;
			}
		});

		//obtenemos los datos del funcionario
		Funcionarios.get({fe_id:$scope.citas.cit_fe_id}, function(data){
			$scope.funcionario = data.funcionario;
		});

	});

	//funcion que permite editar el estado_confirmacion de la cita programada
	console.log($scope.es_familiar);
	$scope.edit = function(cit_id,pac_id){
	  console.log("entro a la funcion "+pac_id);
	  $scope.cita.cit_estado_confirmacion=true;
	  
      CitaConfirmacion.update({cit_id:cit_id, cit_estado_confirmacion:true}).$promise.then(function(data){
        if(data.status){
          if(data.cita == "true"){
          	toastr.success('CITA CONFIRMADA CORRECTAMENTE');
          	$timeout(function() {
            	if(pac_id!=null){//si es familiar
            		$location.path('/servicios_ciudadanos/listar_reservas/'+pac_id);
            	} else {
            		$location.path('/servicios_ciudadanos/listar_reservas');
            	}
            },1000);
          }else if(data.cita == "false"){
          	toastr.error("NO PUEDE CONFIRMAR SU CITA");
          	$scope.ver=true;
          }
        }
      })
	}

	$scope.save = function(citas,pac_id){
		$scope.pac_id_fam = pac_id;
		console.log("entro a la funcion");
		$scope.id = citas.cit_id;
		console.log("idddddddd"+$scope.id);
	}

    function toTime(timeString){
	    var timeTokens = timeString.split(':');
	    return new Date(1970,0,1, timeTokens[0], timeTokens[1], timeTokens[2]);
	}
 }])

//Lista las reservas del medico (Médico, administrador_médico)
.controller('IndexReservaFunCtrl', ['$scope', '$route', 'ReservasMedico', 'CONFIG','Citas','$location', '$timeout','CitasMedicos',
 function ($scope,$route,ReservasMedico, CONFIG, Citas,$location,$timeout,CitasMedicos){
 	$scope.rol_id=CONFIG.ROL_CURRENT_USER;
 	if (CONFIG.ROL_CURRENT_USER == 4) {
 		$scope.ajustes = {
		  menu:{
			  titulo: 'Citas Médicas',
			  items:[{nombre:'Citas Médicas', enlace:'#/reservas/listar_reservas_med',estilo:'active'},
			  		 {nombre:'Citas programadas', enlace:'#/cita/list',estilo:''},
			  		 {nombre:'Historial de Citas Medico', enlace:'#/reservas/historial_reservas_med',estilo:''}]
		  },
		  pagina:{
			  titulo:'Citas Médicas del día'
		  }
		}
 	} else {
 		$scope.ajustes = {//Administrador médico
		  menu:{
			  titulo: 'Citas Médicas',
			  items:[{nombre:'Mis Citas', enlace:'#/reservas/listar_reservas_med',estilo:'active'},
			  		 {nombre:'Citas Médicas', enlace:'#/reservas/listar_reservas',estilo:''},
			  		 {nombre:'Citas Programadas', enlace:'#/cita/list',estilo:''},
					 {nombre:'Historial de Citas', enlace:'#/reservas/historial_reservas',estilo:''}]
		  },
		  pagina:{
			  titulo:'Citas Médicas del día'
		  }
		}
 	}

	var FunG = localStorage.getItem("Funcionario");
	var FunG = JSON.parse(FunG);

    $scope.info="warning";

  	$scope.sortType='cit_fecha_consulta';
  	$scope.sortReverse=true;

    $scope.estado_asistencia = function(cit_id){
		$scope.cita={
  			cit_estado_asistencia:true,
  			cit_estado_pago:true
  		}
	  	Citas.update({cit_id:cit_id},$scope.cita).$promise.then(function(data){
	  		if(data.mensaje){
              $scope.ajustes.pagina.success = "ok";
              $route.reload();
            }
	  	})
  	}

  	$scope.ver_mas=function(pac_id){
  		$timeout(function() {
            $location.path('/pacientes/ver/'+pac_id);
        },1000);
  	};

  	$scope.loading = true;

  	$scope.CurrentDate = new Date();
	$scope.fecha_hoy=moment($scope.CurrentDate,"YYYY-MM-DD").format("YYYY-MM-DD");

	console.log("fecha de hoy "+$scope.fecha_hoy);

  	//CitasMedicos.get({fe_id:FunG.fe_id,fecha:fecha},
	CitasMedicos.get({fe_id:FunG.fe_id,fecha:$scope.fecha_hoy},function(data){
	   $scope.reservas = data.cita;
	   console.log("fff "+$scope.reservas.length);
	   $scope.nro_citas=data.cita.length;
	   	console.log("erere"+$scope.nro_citas);

	   
	   if(data.status && $scope.reservas.length > 0){
	      for(var i in $scope.reservas) {
			$scope.reservas[i].cit_hora_consulta = toTime($scope.reservas[i].cit_hora_consulta);
		  }
	      $scope.loading = false;
	      $scope.msg = data.status;
	   }
	   else{
	      $scope.loading = false;
	   }
	},function () {
	   $scope.loading = false;
	   $scope.msg = false;
	});

	function toTime(timeString){
	    var timeTokens = timeString.split(':');
	    return new Date(1970,0,1, timeTokens[0], timeTokens[1], timeTokens[2]);
	}
}])

//Muestra el historial de citas para Administrador, AdministradorMedico,Admisionista
.controller('IndexReservaHistCtrl', ['$scope', 'CitasEstablecimientos', 'CONFIG', 'toastr',
 function ($scope,CitasEstablecimientos, CONFIG, toastr){

 	if(CONFIG.ROL_CURRENT_USER == 2 || CONFIG.ROL_CURRENT_USER == 6) {
 		$scope.ajustes = {
		  menu:{
			  titulo: 'Historial de Citas',
			  items:[{nombre:'Citas realizadas', enlace:'#/reservas/listar_reservas', estilo:''},
					 {nombre:'Historial de Citas', enlace:'#/reservas/historial_reservas', estilo:'active'}]
		  },
		  pagina:{
			  titulo:'Historial de Citas Médicas'
		  }
		}
 	} else if (CONFIG.ROL_CURRENT_USER == 4) {
 		$scope.ajustes = {
		  menu:{
			  titulo: 'Historial de Citas',
			  items:[{nombre:'Citas Médicas', enlace:'#/reservas/listar_reservas_med',estilo:''},
			  		 {nombre:'Citas programadas', enlace:'#/cita/list',estilo:''},
			  		 {nombre:'Historial de Citas Medico', enlace:'#/reservas/historial_reservas_med',estilo:'active'}]
		  },
		  pagina:{
			  titulo:'Historial de Citas Médicas'
		  }
		}
 	} else {
 		$scope.ajustes = {//Administrador médico
		  menu:{
			  titulo: 'Historial de Citas',
			  items:[{nombre:'Mis Citas', enlace:'#/reservas/listar_reservas_med',estilo:''},
			  		 {nombre:'Citas Médicas', enlace:'#/reservas/listar_reservas',estilo:''},
			  		 {nombre:'Citas Programadas', enlace:'#/cita/list',estilo:''},
					 {nombre:'Historial de Citas', enlace:'#/reservas/historial_reservas',estilo:'active'}]
		  },
		  pagina:{
			  titulo:'Historial de Citas Médicas del Establecimiento'
		  }
		}
 	}	

	var FunG = localStorage.getItem("Funcionario");
	var FunG = JSON.parse(FunG);

	$scope.info="warning";

	$scope.patternFecha = /^(0?[1-9]|1\d|2[0-8]|29(?=[-]\d?\d[-](?!1[01345789]00|2[1235679]00)\d\d(?:[02468][048]|[13579][26]))|30(?![-]0?2)|31(?=[-]0?[13578]|[-]1[02]))[-](0?[1-9]|1[0-2])[-]([12]\d{3})$/;
	$scope.fecha = null;
	$scope.error_inesperado = false;
	$scope.get=function(fecha){

		$scope.loading=true;//PARA HACER UN LOADING EN EL TEMPLATE
		$scope.error_inesperado = false;
		CitasEstablecimientos.get({es_id:FunG.es_id,fecha:fecha},function(data){
	    $scope.loading = true;
		$scope.msg = false;
	    $scope.reservas = data.cita;
	    if(data.status && $scope.reservas.length > 0){
	      for(var i in $scope.reservas) {
			$scope.reservas[i].cit_hora_consulta = toTime($scope.reservas[i].cit_hora_consulta);
			$scope.reservas[i].cit_fecha_consulta = moment($scope.reservas[i].cit_fecha_consulta,"YYYY-MM-DD").format("DD-MM-YYYY");
		  }
	      $scope.loading = false;
	      $scope.msg = data.status;
	    }
	    else{
	      $scope.loading = false;
	    }
		},function(){
		    $scope.loading = false;
		    $scope.msg = false;
		    toastr.error("ERROR INESPERADO, POR FAVOR ACTUALICE LA PÁGINA");
	      	$scope.error_inesperado = true;
	    });
	}
	
  	$scope.sortType='cit_fecha_consulta';
  	$scope.sortReverse=true;

  	function toTime(timeString){
	    var timeTokens = timeString.split(':');
	    return new Date(1970,0,1, timeTokens[0], timeTokens[1], timeTokens[2]);
	}

}])

//controlador para el historial de citas del medico
.controller('IndexReservaHistMedCtrl', ['$scope','CitasMedicos', 'toastr',
 function ($scope,CitasMedicos, toastr){

	$scope.ajustes = {
	  menu:{
		  titulo: 'Historial de Citas',
		  items:[{nombre:'Citas Médicas', enlace:'#/reservas/listar_reservas_med',estilo:''},
		  		 {nombre:'Citas programadas', enlace:'#/cita/list',estilo:''},
		  		 {nombre:'Historial de Citas Medicos', enlace:'#/reservas/historial_reservas_med',estilo:'active'}]
	  },
	  pagina:{
		  titulo:'Historial de Citas Médicas'
	  }
	}
 	
	var FunG = localStorage.getItem("Funcionario");
	var FunG = JSON.parse(FunG);

	$scope.info="warning";

	$scope.patternFecha = /^(0?[1-9]|1\d|2[0-8]|29(?=[-]\d?\d[-](?!1[01345789]00|2[1235679]00)\d\d(?:[02468][048]|[13579][26]))|30(?![-]0?2)|31(?=[-]0?[13578]|[-]1[02]))[-](0?[1-9]|1[0-2])[-]([12]\d{3})$/;
	$scope.fecha = null;
	$scope.error_inesperado = false;
	$scope.get=function(fecha_hist){
		var fecha = moment(fecha_hist,"DD-MM-YYYY").format("YYYY-MM-DD");
		$scope.loading=true;//PARA HACER UN LOADING EN EL TEMPLATE
		$scope.error_inesperado = false;
		CitasMedicos.get({fe_id:FunG.fe_id,fecha:fecha},function(data){
	    $scope.loading = true;
		$scope.msg = false;
	    $scope.reservas = data.cita;
	    if(data.status && $scope.reservas.length > 0){
	      for(var i in $scope.reservas) {
			$scope.reservas[i].cit_hora_consulta = toTime($scope.reservas[i].cit_hora_consulta);
			$scope.reservas[i].cit_fecha_consulta = moment($scope.reservas[i].cit_fecha_consulta,"YYYY-MM-DD").format("DD-MM-YYYY");
		  }
	      $scope.loading = false;
	      $scope.msg = data.status;
	    }
	    else{
	      $scope.loading = false;
	    }
		},function(){
		    $scope.loading = false;
		    $scope.msg = false;
		    toastr.error("ERROR INESPERADO, POR FAVOR ACTUALICE LA PÁGINA");
	      	$scope.error_inesperado = true;
	    });
	}
	
  	$scope.sortType='cit_fecha_consulta';
  	$scope.sortReverse=true;

  	function toTime(timeString){
	    var timeTokens = timeString.split(':');
	    return new Date(1970,0,1, timeTokens[0], timeTokens[1], timeTokens[2]);
	}

}])

.directive("myValid", function () {////poner el otrooooo
	return {
	    require: "ngModel",
	    restrict: "A", // Attributes only
	    link: function (scope, elem, attr, ctrl) {
	        ctrl.$validators.bzValidDate = function(value) {
	            if (value === undefined || value === null || value === "") {
	                return true;
	            }
	            return moment(value, ["YYYY-M-D"], true).isValid();
	        }
	    }
	}
})