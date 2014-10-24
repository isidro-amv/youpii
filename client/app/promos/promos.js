'use strict';

angular.module('youpiiBApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('promos', {
        url: '/promos',
        templateUrl: 'app/promos/promos.html',
        controller: 'PromosCtrl'
      })
      .state('edit-promo', {
        url: '/promo/:id',
        templateUrl: 'app/promos/edit-promo/edit-promo.html',
        controller: 'EditPromoCtrl'
      })
      .state('new-promo', {
        url: '/new-promo',
        templateUrl: 'app/promos/new-promo/new-promo.html',
        controller: 'NewPromoCtrl'
      });
  });