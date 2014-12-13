'use strict';

angular.module('youpiiBApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('graphics', {
        url: '/graphics',
        templateUrl: 'app/graphics/graphics.html',
        controller: 'GraphicsCtrl'
      });
  });