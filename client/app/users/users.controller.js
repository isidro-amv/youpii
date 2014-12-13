'use strict';

angular.module('youpiiBApp')
  .controller('UsersCtrl', function ($scope, $location, User) {
    $scope.users = [];
    User.query(function (data) {
      $scope.users = data;
    });
  });
