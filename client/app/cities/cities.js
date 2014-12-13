'use strict';

angular.module('youpiiBApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('cities', {
        url: '/cities',
        templateUrl: 'app/cities/cities.html',
        controller: 'CitiesCtrl'
      })
      .state('edit-city', {
        url: '/city/:id',
        templateUrl: 'app/cities/edit-city/edit-city.html',
        controller: 'EditCityCtrl'
      })
      .state('new-city', {
        url: '/new-city',
        templateUrl: 'app/cities/new-city/new-city.html',
        controller: 'NewCityCtrl'
      });
  });