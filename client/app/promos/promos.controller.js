'use strict';

angular.module('youpiiBApp')
  .controller('PromosCtrl', function ($scope, Promo, User) {
    $scope.promos = [];
    Promo.query(function (data) {
      $scope.promos = data;
    });
  });
