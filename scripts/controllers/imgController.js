'use strict';
angular.module("adminApp")

.controller('UploadCiudCtrl', ['$scope', '$timeout','$http',function($scope, $timeout, $http){
    
    $scope.thumbnail = {
        dataUrl: ''
    };
    $scope.fileReaderSupported = window.FileReader != null;
  
        $scope.photoChanged = function(files){
            if (files != null) {
                console.log("que rayos es files",files);
                var file = files[0];
            if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                $timeout(function() {
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(file);
                    fileReader.onload = function(e) {
                        $timeout(function(){
                            $scope.thumbnail.dataUrl = e.target.result;
                        });
                    }
                    $scope.persona.ima_nombre=file.name;  //obtenemos el nombre de la imagen :)
                    console.log("IMAGENNN 1",$scope.persona.ima_nombre);
$scope.persona.ima_nombre=file.name; 
                   $scope.persona.imagen/*[0]*/.ima_nombre=file.name;//para editar
                    console.log("IMAGENNN para editar",$scope.persona.imagen/*[0]*/.ima_nombre);
                     $scope.persona.imagen/*[0]*/.ima_nombre=file.name;
                    $scope.persona.imagen/*[0]*/.ima_nombre=file.name;
                     console.log("IMAGENNN corregido",$scope.personas.imagen/*[0]*/.ima_nombre);
                });
            }
        }
    };


    var vm = this;
    vm.img=false;
    //Probando los estados http
    function a(){
        return $http({
            method: 'POST',
            url: 'prueba.php',
            })
    };
    vm.b=a().then(function (alguien) {
        vm.alguien=alguien;
    });


    vm.enviar=function() {
        if (vm.ima_nombre) {
        //Asignamos el file-model a la variable file, gracias a la directiva de mas arriba.
        var file = vm.ima_nombre;
        console.log("funcion enviar agarra nombre",vm.ima_nombre);
        var fd = new FormData();
        fd.append('file', file); //Agregamos data al "formulario" que vamos a enviar

        $http.post('ciud.php', fd, {
            transformRequest: angular.identity, //Le decimos a angular que no serialize el envio
            headers: {'Content-Type': undefined}
            })
            .success(function(response){
                //Guardamos la url de la imagen y hacemos que la muestre.
                vm.ima_nombre=response;
                vm.img=true;
            })
            .error(function(response){

        });
             $scope.msg="Imagen cargada correctamente";
        } 
    };
}])

.controller('UploadFunCtrl', ['$scope', '$timeout','$http',function($scope, $timeout, $http){
    
        $scope.thumbnail = {
            dataUrl: ''
        };

        $scope.fileReaderSupported = window.FileReader != null;
            $scope.photoChanged = function(files){
                if (files != null) {
                    var file = files[0];
                if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                    $timeout(function() {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function(e) {
                            $timeout(function(){
                                $scope.thumbnail.dataUrl = e.target.result;
                            });
                        }
                        $scope.funcionarios.ima_nombre=file.name;  //obtenemos el nombre de la imagen :)
                        $scope.personas.imagen/*[0]*/.ima_nombre=file.name; //para editar
                    });
                }
            }
        };

        var vm = this;
        vm.img=false;
        //Probando los estados http
        function a(){
            return $http({
                method: 'POST',
                url: 'prueba.php',
                })
        };
        vm.b=a().then(function (alguien) {
            vm.alguien=alguien;
        });


        vm.enviar=function() {
            if (vm.ima_nombre) {
        //Asignamos el file-model a la variable file, gracias a la directiva de mas arriba.
        var file = vm.ima_nombre;

        var fd = new FormData();
        fd.append('file', file); //Agregamos data al "formulario" que vamos a enviar

        $http.post('fun.php', fd, {
            transformRequest: angular.identity, //Le decimos a angular que no serialize el envio
            headers: {'Content-Type': undefined}
            })
            .success(function(response){
                //Guardamos la url de la imagen y hacemos que la muestre.
                vm.ima_nombre=response;
                vm.img=true;
            })
            .error(function(response){

        });
        $scope.msg="Imagen cargada correctamente";
        }
    };
}])


.controller('UploadPacCtrl', ['$scope', '$timeout','$http',function($scope, $timeout, $http){
    
    $scope.thumbnail = {
        dataUrl: ''
    };

    $scope.fileReaderSupported = window.FileReader != null;
        $scope.photoChanged = function(files){
            if (files != null) {
                var file = files[0];
            if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                $timeout(function() {
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(file);
                    fileReader.onload = function(e) {
                        $timeout(function(){
                            $scope.thumbnail.dataUrl = e.target.result;
                        });
                    }
                    $scope.pacientes.ima_nombre=file.name;  //obtenemos el nombre de la imagen :)
                    $scope.personas.imagen[0].ima_nombre=file.name;
                });
            }
        }
    };

    var vm = this;
    vm.img=false;
    //Probando los estados http
    function a(){
        return $http({
            method: 'POST',
            url: 'prueba.php',
            })
    };
    vm.b=a().then(function (alguien) {
        vm.alguien=alguien;
    });

    vm.enviar=function() {
        //Asignamos el file-model a la variable file, gracias a la directiva de mas arriba.
        var file = vm.ima_nombre;

        var fd = new FormData();
        fd.append('file', file); //Agregamos data al "formulario" que vamos a enviar

        $http.post('pac.php', fd, {
            transformRequest: angular.identity, //Le decimos a angular que no serialize el envio
            headers: {'Content-Type': undefined}
            })
            .success(function(response){
                //Guardamos la url de la imagen y hacemos que la muestre.
                vm.ima_nombre=response;
                vm.img=true;
            })
            .error(function(response){

        });
             $scope.msg="Imagen cargada correctamente";
    };
}])


.controller('UploadEstCtrl', ['$scope', '$timeout','$http',function($scope, $timeout, $http){
    
        $scope.thumbnail = {
            dataUrl: '' 
        };

        $scope.fileReaderSupported = window.FileReader != null;
            $scope.photoChanged = function(files){
                if (files != null) {
                    var file = files[0];
                if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                    $timeout(function() {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function(e) {
                            $timeout(function(){
                                $scope.thumbnail.dataUrl = e.target.result;
                            });
                        }
                        $scope.establecimiento.ie_nombre=file.name;  //obtenemos el nombre de la imagen :)
                        //$scope.establecimiento.imagenes.ima_nombre=file.name; 
                    });
                }
            }
        };


        var vm = this;
        vm.img=false;
        vm.enviar=function() {
            if(vm.ie_nombre){
                //Asignamos el file-model a la variable file, gracias a la directiva de mas arriba.
                var file = vm.ie_nombre;

                var fd = new FormData();
                fd.append('file', file); //Agregamos data al "formulario" que vamos a enviar

                $http.post('est.php', fd, {
                    transformRequest: angular.identity, //Le decimos a angular que no serialize el envio
                    headers: {'Content-Type': undefined}
                    })
                    .success(function(response){
                        //Guardamos la url de la imagen y hacemos que la muestre.
                        vm.ie_nombre=response;
                        vm.img=true;
                    })
                    .error(function(response){

                });
                 $scope.msg="Imagen cargada correctamente";
            }
        
        
    };
}])


.controller('UploadNITCtrl', ['$scope', '$timeout','$http',function($scope, $timeout, $http){
    
        $scope.thumbnail = {
            dataUrl: ''
        };

        $scope.fileReaderSupported = window.FileReader != null;
            $scope.photoChanged = function(files){
                if (files != null) {
                    var file = files[0];
                if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                    $timeout(function() {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function(e) {
                            $timeout(function(){
                                $scope.thumbnail.dataUrl = e.target.result;
                            });
                        }
                        $scope.documentoTramite1.ima_nombre=file.name;  //obtenemos el nombre de la imagen :)
                    });
                }
            }
        };

        var vm = this;
        vm.img=false;
        vm.enviar=function() {
        //Asignamos el file-model a la variable file, gracias a la directiva de mas arriba.
        var file = vm.ima_nombre;

        var fd = new FormData();
        fd.append('file', file); //Agregamos data al "formulario" que vamos a enviar

        $http.post('nit.php', fd, {
            transformRequest: angular.identity, //Le decimos a angular que no serialize el envio
            headers: {'Content-Type': undefined}
            })
            .success(function(response){
                //Guardamos la url de la imagen y hacemos que la muestre.
                vm.ima_nombre=response;
                vm.img=true;
            })
            .error(function(response){

        });
        $scope.msg="Imagen cargada correctamente";
    };
}])


.controller('UploadLicenciaFuncionamientoCtrl', ['$scope', '$timeout','$http',function($scope, $timeout, $http){
    
        $scope.variable2 = {
            dataUrl: ''
        };

        $scope.fileReaderSupported = window.FileReader != null;
            $scope.photoChanged = function(files){
                if (files != null) {
                    var file = files[0];
                if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                    $timeout(function() {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function(e) {
                            $timeout(function(){
                                $scope.variable2.dataUrl = e.target.result;
                            });
                        }
                        $scope.documentoTramite2.ima_nombre=file.name;  //obtenemos el nombre de la imagen :)
                    });
                }
            }
        };

        var vm2 = this;
        vm2.img=false;

        vm2.enviar=function() {
        //Asignamos el file-model a la variable file, gracias a la directiva de mas arriba.
        var file = vm2.ima_nombre;

        var fd = new FormData();
        fd.append('file', file); //Agregamos data al "formulario" que vamos a enviar

        $http.post('licfun.php', fd, {
            transformRequest: angular.identity, //Le decimos a angular que no serialize el envio
            headers: {'Content-Type': undefined}
            })
            .success(function(response){
                //Guardamos la url de la imagen y hacemos que la muestre.
                vm2.ima_nombre=response;
                vm2.img=true;
            })
            .error(function(response){

        });
        $scope.msg="Imagen cargada correctamente";
    };
}])


.controller('UploadCICtrl', ['$scope', '$timeout','$http',function($scope, $timeout, $http){
    
        $scope.thumbnail3 = {
            dataUrl: ''
        };

        $scope.fileReaderSupported = window.FileReader != null;
            $scope.photoChanged = function(files){
                if (files != null) {
                    var file = files[0];
                if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                    $timeout(function() {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function(e) {
                            $timeout(function(){
                                $scope.thumbnail3.dataUrl = e.target.result;
                            });
                        }
                        $scope.documentoTramite3.ima_nombre=file.name;  //obtenemos el nombre de la imagen :)
                    });
                }
            }
        };

        var vm3 = this;
        vm3.img=false;
        
        vm3.enviar=function() {
        //Asignamos el file-model a la variable file, gracias a la directiva de mas arriba.
        var file = vm3.ima_nombre;

        var fd = new FormData();
        fd.append('file', file); //Agregamos data al "formulario" que vamos a enviar

        $http.post('ci.php', fd, {
            transformRequest: angular.identity, //Le decimos a angular que no serialize el envio
            headers: {'Content-Type': undefined}
            })
            .success(function(response){
                //Guardamos la url de la imagen y hacemos que la muestre.
                vm3.ima_nombre=response;
                vm3.img=true;
            })
            .error(function(response){

        });
        $scope.msg="Imagen cargada correctamente";
    };
}])


.controller('UploadDocCtrl', ['$scope', '$timeout','$http',function($scope, $timeout, $http){
        $scope.thumbnail = {
            dataUrl: ''
        };
        $scope.fileReaderSupported = window.FileReader != null;
            $scope.photoChanged = function(files){
                if (files != null) {
                    var file = files[0];
                if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                    $timeout(function() {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function(e) {
                            $timeout(function(){
                                $scope.thumbnail.dataUrl = e.target.result;
                            });
                        }
                        $scope.documentoTramite.ima_nombre=file.name;  //obtenemos el nombre de la imagen :)
                    });
                }
            }
        };
        var vm = this;
        vm.img=false;
        
        vm.enviar=function() {
        //Asignamos el file-model a la variable file, gracias a la directiva de mas arriba.
        var file = vm.ima_nombre;

        var fd = new FormData();
        fd.append('file', file); //Agregamos data al "formulario" que vamos a enviar

        $http.post('documentos.php', fd, {
            transformRequest: angular.identity, //Le decimos a angular que no serialize el envio
            headers: {'Content-Type': undefined}
            })
            .success(function(response){
                //Guardamos la url de la imagen y hacemos que la muestre.
                vm.ima_nombre=response;
                vm.img=true;
            })
            .error(function(response){

        });
        $scope.msg="Imagen cargada correctamente";
    };
}])



.controller('UploadFirmaCtrl', ['$scope', '$timeout','$http',function($scope, $timeout, $http){
    
        $scope.thumbnail = {
            dataUrl: ''
        };

        $scope.fileReaderSupported = window.FileReader != null;
            $scope.photoChanged = function(files){
                if (files != null) {
                    var file = files[0];
                if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                    $timeout(function() {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function(e) {
                            $timeout(function(){
                                $scope.thumbnail.dataUrl = e.target.result;
                            });
                        }
                        $scope.firma.fir_nombre=file.name;  //obtenemos el nombre de la imagen :)
                    });
                }
            }
        };

        var vm = this;
        vm.img=false;
        //Probando los estados http
        function a(){
            return $http({
                method: 'POST',
                url: 'prueba.php',
                })
        };
        vm.b=a().then(function (alguien) {
            vm.alguien=alguien;
        });


        vm.enviar=function() {
        //Asignamos el file-model a la variable file, gracias a la directiva de mas arriba.
        var file = vm.ima_nombre;
        console.log('llego al img controller');
        var fd = new FormData();
        fd.append('file', file); //Agregamos data al "formulario" que vamos a enviar
        // console.log('a un paso del post');
        $http.post('firma.php', fd, {
            transformRequest: angular.identity, //Le decimos a angular que no serialize el envio
            headers: {'Content-Type': undefined}
            })
            // console.log('llego al post');
            .success(function(response){
                vm.ima_nombre=response;
                vm.img=true;
            })
            .error(function(response){
        });
        $scope.msg="Imagen cargada correctamente";
    };
}])











/*  DIRECTIVA    */
.directive('fileModel', fileModel)

;
fileModel.$inject=['$parse']
function fileModel ($parse) {
    //Detecta el cambio en el input y lo asigna al model...
    //Tal como lo explica aca: http://uncorkedstudios.com/blog/multipartformdata-file-upload-with-angularjs
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}