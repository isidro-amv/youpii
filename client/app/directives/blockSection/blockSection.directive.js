'use strict';

angular.module('youpiiBApp')
  .directive('promoSection', function () {
    return {
      templateUrl: 'app/directives/blockSection/blockSection.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        var index = attrs.index;
        scope.$parent.$parent.imagemainCropped[index] = '';
        scope.$watch('imagemainCropped', function(newValue) {
          //Esta variable es un desencadenamiento de variables
          // tomar en cuenta si se agrega otra directiva padre
          scope.$parent.$parent.imagemainCropped[index] = newValue;
        });
      }
    };
  });