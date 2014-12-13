'use strict';

angular.module('youpiiBApp')
  .factory('Pack', function ($resource) {
    return  $resource('/api/packs/:id', {
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