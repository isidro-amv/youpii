'use strict';

angular.module('youpiiBApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('pack', {
        url: '/packs',
        templateUrl: 'app/pack/pack.html',
        controller: 'PackCtrl'
      })
      .state('edit-pack', {
        url: '/pack/:id',
        templateUrl: 'app/pack/edit-pack/edit-pack.html',
        controller: 'EditPackCtrl'
      })
      .state('new-pack', {
        url: '/new-pack',
        templateUrl: 'app/pack/new-pack/new-pack.html',
        controller: 'NewPackCtrl'
      });
  });
