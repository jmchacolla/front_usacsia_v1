'use strict';
angular.module("adminApp")
.directive('cargarElem', cargarElemDirective);
function marvelImageDirective () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            var tempImage = new Image();
            tempImage.onload = onLoadImage;
            function onLoadImage () {
                element[0].src = tempImage.src;
            }
            tempImage.src = attr.marvelImage;
        }
    }
}
