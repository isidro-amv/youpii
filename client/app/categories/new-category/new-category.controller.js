'use strict';

angular.module('youpiiBApp')
  .controller('NewCategoryCtrl', function ($scope, Category, $location) {
    $scope.category = {
      name:{
        es: "Restaurante",
        en: "Restaurant"
      },
      url: {
        es: "restaurante",
        en: "restaurant"
      },
      parent: ["123123"],
      info:{
        es: "Restaurante | comida",
        en: "Restaurant | food"
      }
    };

    $scope.register = function (form) {
      if(form.$valid) {
        var category = new Category($scope.category);
        category.$save(function (data) {
          $location.path('/categories');
        });
      }
    }

  });
