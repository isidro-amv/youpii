'use strict';

angular.module('youpiiBApp')
  .controller('NewCategoryCtrl', function ($scope, Category, $location) {

    Category.query(function (data) {
      $scope.categories = data;
    });
    $scope.category = {
      name:{
        es: 'Restaurante',
        en: 'Restaurant'
      },
      url: {
        es: 'restaurante',
        en: 'restaurant'
      },
      parent: ['123123'],
      info:{
        es: 'Restaurante | comida',
        en: 'Restaurant | food'
      }
    };

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
