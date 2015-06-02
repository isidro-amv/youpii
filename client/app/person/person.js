'use strict';

angular.module('youpiiBApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('person', {
        url: '/persons',
        templateUrl: 'app/person/person.html',
        controller: 'PersonCtrl'
      })
      .state('edit-person', {
        url: '/person/:id',
        templateUrl: 'app/person/edit-person/edit-person.html',
        controller: 'EditPersonCtrl'
      })
      .state('new-person', {
        url: '/new-person',
        templateUrl: 'app/person/new-person/new-person.html',
        controller: 'NewPersonCtrl'
      });
  });