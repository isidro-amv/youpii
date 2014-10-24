'use strict';

angular.module('youpiiBApp')
  .controller('EditUserCtrl', function ($scope, User, $location, Auth) {
    $scope.status = '';
    $scope.user = [];
    $scope.userId = $location.path().split('/').slice(-1)[0];

    User.get({id:$scope.userId}, function (data) {
      $scope.user = data;
    });

    $scope.delete = function () {
      var msg = "¿Realmente quieres eliminar este usuario?"
      if ( window.confirm(msg) ) {
         $scope.user.$delete();
         $location.path('/users');
      }
    }

    $scope.update = function(form) {

      $scope.submitted = true;
      console.log(form);
      if(form.$valid) {
        var formData = new FormData($('.form')[0])
        $.ajax({
            type:'PUT',
            url: 'http://localhost:9000/api/users/'+$scope.userId,
            data:formData,
            cache:false,
            contentType: false,
            processData: false,
            headers: { 'Authorization': Auth.getBarerToken() },
            dataType: "json",
            success:function(data){
              alert('Usuario actualizado!');
              $scope.$apply();
            },
            error: function(err){
              console.log(err);
              var err = err.responseJSON;
              $scope.errors = {};

              // Update validity of form fields that match the mongoose errors
              angular.forEach(err.errors, function(error, field) {
                form[field].$setValidity('mongoose', false);
                $scope.errors[field] = error.message;
              });
              $scope.$apply();
            }
        });
      }
    };
  });
