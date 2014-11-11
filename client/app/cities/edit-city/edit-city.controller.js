'use strict';

angular.module('youpiiBApp')
  .controller('EditCityCtrl', function ($scope, City, $location) {
    $scope.status = '';
    $scope.city = [];
    $scope.cityId = $location.path().split('/').slice(-1)[0];

    City.get({id:$scope.cityId}, function (data) {
      $scope.city = data;
    });

    $scope.delete = function () {
      var msg = "¿Realmente quieres eliminar esta ciudad?"
      if ( window.confirm(msg) ) {
         $scope.city.$delete();
         $location.path('/cities');
      }
    }

    $scope.update = function (form) {
       if(form.$valid) {
        $scope.city.$update(function (data) {
          alert('Ciudad actualizada!');
        });
       }

    }

  });
