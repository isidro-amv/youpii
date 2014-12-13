'use strict';

angular.module('youpiiBApp')
  .controller('CitiesCtrl', function ($scope, City) {
    $scope.cities = [];
    City.query(function (data) {
      $scope.cities = data;
    });
  });
