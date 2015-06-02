'use strict';

angular.module('youpiiBApp')
  .factory('Person', function ($resource) {
    return  $resource('/api/persons/:id', {
      id: '@_id'
    },{
      update:{
        method:'PUT'
      },
      get: {
        method: 'GET'
      }
    });
  });