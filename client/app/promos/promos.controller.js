'use strict';

angular.module('youpiiBApp')
  .controller('PromosCtrl', function ($scope, Promo, $location) {
    $scope.promos = [];
    Promo.query(function (data) {
      $scope.promos = data;
    });
  });
