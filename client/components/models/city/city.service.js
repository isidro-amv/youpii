'use strict';

angular.module('youpiiBApp')
  .factory('City', function ($resource) {
    return  $resource('/api/cities/:id', {
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