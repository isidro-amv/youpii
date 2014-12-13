'use strict';

angular.module('youpiiBApp')
  .controller('PackCtrl', function ($scope, Pack) {
    Pack.query(function (data) {
      $scope.packs = data;
      console.log(data);
    });
  });