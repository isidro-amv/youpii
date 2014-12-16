'use strict';

angular.module('youpiiBApp')
  .controller('NewCategoryCtrl', function ($scope, Category, $location) {

    Category.query(function (data) {
      $scope.categories = data;
    });

    $scope.register = function (form) {
      $scope.submitted = true;
      if(form.$valid) {
        var category = new Category($scope.category);
        category.$save(function () {
          $location.path('/categories');
        });
      }
    };

  });
