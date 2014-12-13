'use strict';

angular.module('youpiiBApp')
  .controller('NewCityCtrl', function ($scope, City,  $location) {
    $scope.city = {
      name: 'Puerto Vallarta',
      state: 'Jalisco',
      loc: '20.640620, -105.222771'
    };

    $scope.register = function (form) {
      if(form.$valid) {
        var city = new City($scope.city);
        city.$save(function () {
          $location.path('/cities');
        });
      }
    };
  });
