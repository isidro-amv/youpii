'use strict';

angular.module('youpiiBApp')
  .controller('PackCtrl', function ($scope, Pack) {
    Pack.query(function (data) {
      console.log(data);
      $scope.packs = data;
    });
  });