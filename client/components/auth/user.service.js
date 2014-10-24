'use strict';

angular.module('youpiiBApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      update:{
        method:'PUT'
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  });
