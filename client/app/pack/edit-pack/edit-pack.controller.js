'use strict';

angular.module('youpiiBApp')
  .controller('EditPackCtrl', function ($scope, $location, Pack, User)  {
    $scope.status = '';
    $scope.pack = [];
    $scope.ownerFields = [0]
    $scope.packId = $location.path().split('/').slice(-1)[0];

    Pack.get({id:$scope.packId}, function (data) {
      $scope.pack = data;
    });

    User.query(function (data) {
      $scope.users = data;
    });

    $scope.addOwner = function () {
      $scope.pack.owners.push('');
    }
    $scope.deleteOwner = function (index) {
      console.log("indez",index);
      $scope.pack.owners.splice(index,1);
    }

    $scope.delete = function () {
      var msg = "¿Realmente quieres eliminar esta ciudad?"
      if ( window.confirm(msg) ) {
         $scope.pack.$delete();
         $location.path('/packs');
      }
    }

    $scope.update = function (form) {
      console.log('hola');
      $scope.submitted = true;
       if(form.$valid) {
        $scope.pack.$update(function (data) {
          window.alert('Paquete actualizada!');
        });
       }

    }
  });
