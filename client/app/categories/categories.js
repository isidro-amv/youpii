'use strict';

angular.module('youpiiBApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('categories', {
        url: '/categories',
        templateUrl: 'app/categories/categories.html',
        controller: 'CategoriesCtrl'
      })
      .state('edit-category', {
        url: '/category/:id',
        templateUrl: 'app/categories/edit-category/edit-category.html',
        controller: 'EditCategoryCtrl'
      })
      .state('new-category', {
        url: '/new-category',
        templateUrl: 'app/categories/new-category/new-category.html',
        controller: 'NewCategoryCtrl'
      });
  });