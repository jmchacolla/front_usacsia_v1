'use strict';

angular.module('adminApp.vista', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/imagen', {
    templateUrl: 'templates/vista.html',
    controller: 'VistaCtrl',
    controllerAs:'vista'
  })
}])

.directive('fileModel', fileModel)

.controller('VistaCtrl', VistaCtrl);

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

VistaCtrl.$inject=['$scope', '$http'];
function VistaCtrl($scope, $http) {
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

//Click en enviar
    vm.enviar=function() {
        //Asignamos el file-model a la variable file, gracias a la directiva de mas arriba.
        var file = vm.imagen;

        var fd = new FormData();
       // fd.append('file', angular.toJson(file))
        fd.append('file', file); //Agregamos data al "formulario" que vamos a enviar

        $http.post('post.php', fd, {
            transformRequest: angular.identity, //Le decimos a angular que no serialize el envio
            headers: {'Content-Type': undefined}
            })
            .success(function(response){
                //Guardamos la url de la imagen y hacemos que la muestre.
                vm.imagen=response;
                vm.img=true;
            })
            .error(function(response){

        });
        };
    };