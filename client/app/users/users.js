'use strict';

angular.module('youpiiBApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('users', {
        url: '/users',
        templateUrl: 'app/users/users.html',
        controller: 'UsersCtrl'
      })
      .state('new-user', {
        url: '/new-user',
        templateUrl: 'app/users/new-user/new-user.html',
        controller: 'NewUserCtrl'
      })
      .state('edit-user', {
        url: '/user/:id',
        templateUrl: 'app/users/edit-user/edit-user.html',
        controller: 'EditUserCtrl'
      });
  });