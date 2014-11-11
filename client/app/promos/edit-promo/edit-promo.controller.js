'use strict';

angular.module('youpiiBApp')
  .controller('EditPromoCtrl', function ($scope, $location, Promo, User, Category, App) {
    $scope.status = '';
    $scope.promo = [];
    $scope.categories = [];
    $scope.users = [];
    $scope.promoId = $location.path().split('/').slice(-1)[0];
    User.query(function (data) {
      $scope.users = data;
    });
    Category.query(function (data) {
      $scope.categories = data;
    });
    $scope.promoId = $location.path().split('/').slice(-1)[0];

    Promo.get({id:$scope.promoId}, function (data) {
      $scope.promo = data;
    });

    $scope.delete = function () {
      var msg = "¿Realmente quieres eliminar esta promoción?"
      if ( window.confirm(msg) ) {
         $scope.promo.$delete();
         $location.path('/promos');
      }
    }

    $scope.update = function (form) {
      console.log('helolo');
      console.log(form);
      $scope.submitted = true;
      console.log(form);
      if(form.$valid) {
        var formData = new FormData($('.form')[0]);
        App.sendRequest({
          method: 'PUT',
          form: formData,
          url: 'promos/'+$scope.promoId
        },function (data) {
          alert('Usuario actualizado!');
          $scope.$apply();
        },function (err) {
          console.log(err);
          var err = err.responseJSON;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
          $scope.$apply();
        });
      }
    }
  });
