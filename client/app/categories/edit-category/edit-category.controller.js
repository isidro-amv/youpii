'use strict';

angular.module('youpiiBApp')
  .controller('EditCategoryCtrl', function ($scope, $location, Category) {
    $scope.status = '';
    $scope.category = [];
    $scope.categoryId = $location.path().split('/').slice(-1)[0];
    Category.get({id:$scope.categoryId}, function (data) {
      $scope.category = data;
    });

    $scope.delete = function () {
      var msg = '¿Realmente quieres eliminar esta categoría?';
      if ( window.confirm(msg) ) {
         $scope.category.$delete();
         $location.path('/categories');
      }
    };

    $scope.update = function (form) {
       if(form.$valid) {
        $scope.category.$update(function () {
          alert('categoría actualizada!');
        });
       }
    };

  });
