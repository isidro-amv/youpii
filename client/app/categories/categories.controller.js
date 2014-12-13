'use strict';

angular.module('youpiiBApp')
  .controller('CategoriesCtrl', function ($scope, Category) {
    $scope.categories = [];
    Category.query(function (data) {
      $scope.categories = data;
    });
  });
