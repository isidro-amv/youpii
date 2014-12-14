'use strict';

angular.module('youpiiBApp')
  .controller('EditUserCtrl', function ($scope, User, $location, Auth, City, App) {
    $scope.status = '';
    $scope.user = [];
    $scope.userId = $location.path().split('/').slice(-1)[0];

    City.query(function (data) {
      $scope.cities = data;
    });

    User.get({id:$scope.userId}, function (data) {
      $scope.user = data;
    });

    $scope.delete = function () {
      var msg = '¿Realmente quieres eliminar este usuario?';
      if ( window.confirm(msg) ) {
         $scope.user.$delete();
         $location.path('/users');
      }
    };

    $scope.update = function(form) {

      $scope.submitted = true;
      console.log(form);
      if(form.$valid) {
        var formData = new FormData($('.form')[0]);

        App.sendRequest({
          method: 'PUT',
          form: formData,
          url: 'users/'+$scope.userId
        },function () {
          window.alert('Usuario actualizado!');
          $scope.$apply();
        },function (err) {
          console.log(err);
          var errJSON = err.responseJSON;
          $scope.errors = {};
          // Update validity of form fields that match the mongoose errors
          angular.forEach(errJSON.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
          $scope.$apply();
        });

      }
    };
  });
