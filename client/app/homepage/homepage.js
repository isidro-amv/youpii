'use strict';

angular.module('youpiiBApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('homepage', {
        url: '/homepage',
        templateUrl: 'app/homepage/homepage.html',
        controller: 'HomepageCtrl'
      })
      .state('edit-homepage', {
        url: '/homepage-edit',
        templateUrl: 'app/homepage/edit-homepage/edit-homepage.html',
        controller: 'EditHomepageCtrl'
      });
  });