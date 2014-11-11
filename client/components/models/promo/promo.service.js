'use strict';

angular.module('youpiiBApp')
  .factory('Promo', function ($resource) {
    return  $resource('/api/promos/:id', {
      id: '@_id'
    },{
      update:{
        method:'PUT'
      },
      get: {
        method: 'GET'
      }
    })
  });