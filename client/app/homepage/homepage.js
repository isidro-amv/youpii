'use strict';

angular.module('youpiiBApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('homepage', {
        url: '/homepage',
        templateUrl: 'app/homepage/homepage.html',
        controller: 'HomepageCtrl'
      })
      .state('edit-section', {
        url: 'homepage-section/:id',
        templateUrl: 'app/homepage/edit-section/edit-section.html',
        controller: 'EditSectionCtrl'
      })
      .state('new-section', {
        url: '/new-section',
        templateUrl: 'app/homepage/new-section/new-section.html',
        controller: 'NewSectionCtrl'
      });
  });