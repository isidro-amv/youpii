'use strict';

angular.module('youpiiBApp')
  .factory('Category', function ($resource) {
    return  $resource('/api/categories/:id', {
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