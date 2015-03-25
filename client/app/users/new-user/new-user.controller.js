'use strict';

angular.module('youpiiBApp')
  .controller('NewUserCtrl', function ($scope, User,  $location, Auth, City, App) {
    $scope.user = {};
    $scope.errors = {};

    City.query(function (data) {
      $scope.cities = data;
    });

    $scope.user = {
      name: '',
      url: '',
      businessName: '',
      contact:{
        name: '',
        tel: ''
      },
      coords: '',
      tel: '',
      cel: '',
      dir: {
        en: '',
        es: ''
      },
      city: '2',
      email: 'fake@youpiipromos.com',
      password: 'yr7867iUL',
      social:{
        facebook: ''
      }
    };

    $scope.register = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        var formData = new FormData($('.form')[0]);

        App.sendRequest({
          method: 'POST',
          form: formData,
          url: 'users/'
        },function (data) {
          console.log(data);
          $location.path('/users');
          $scope.$apply();
        },function (err) {
          var errJSON = err.responseJSON;
          $scope.errors = {};
          // Update validity of form fields that match the mongoose errors
          angular.forEach(errJSON.errors, function(error, field) {
            console.log(field);
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
          $scope.$apply();
        });

      }
    };

  });
