'use strict';

angular.module('youpiiBApp')
  .controller('NewPackCtrl', function ($scope, $location, User, Pack) {
    $scope.ownerFields = [0];
    $scope.pack = {};
    $scope.pack.owners=[''];
    $scope.ownerFields = [0];
    User.query(function (data) {
      $scope.users = data;
    });

    $scope.addOwner = function () {
      $scope.pack.owners.push('');
    };
    $scope.deleteOwner = function (index) {
      $scope.pack.owners.splice(index,1);
    };

    $scope.register = function (form) {
      $scope.submitted = true;
      if(form.$valid) {
        var pack = new Pack($scope.pack);
        pack.$save(function () {
          $location.path('/packs');
        },function (err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

  });
