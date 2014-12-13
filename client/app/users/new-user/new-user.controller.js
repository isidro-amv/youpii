'use strict';

angular.module('youpiiBApp')
  .controller('NewUserCtrl', function ($scope, User,  $location, Auth, City) {
    $scope.user = {};
    $scope.errors = {};

    City.query(function (data) {
      $scope.cities = data;
    });

    $scope.user = {
      name: 'Test',
      url: 'el-nombre-de-mi-empresa',
      businessName: 'Promocion Youpii S.A. de C.V.',
      contact:{
        name: 'Paco Perez Piñón',
        tel: '(329)1020102'
      },
      coords: '20.640620, -105.222771',
      tel: '(329)1020102, (233)2344521',
      cel: '(329)1020102, (233)2344521',
      dir: 'Juan de la Barrera, Colonia: Buena vista',
      city: '2',
      email: 'mi_empresa@fake.com',
      password: 'yr7867iUL',
      social:{
        facebook: 'http:/www.facebook.com/mi-empresa'
      }
    };

    $scope.register = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        var formData = new FormData($('.form')[0]);

        $.ajax({
            type:'POST',
            url: 'http://localhost:9000/api/users',
            data:formData,
            cache:false,
            contentType: false,
            processData: false,
            headers: { 'Authorization': Auth.getBarerToken() },
            dataType: 'json',
            success:function(data){
              console.log(data);
              $location.path('/users');
              $scope.$apply();
            },
            error: function(err){
              console.log(err);
              var errJSON = err.responseJSON;
              $scope.errors = {};
              // Update validity of form fields that match the mongoose errors
              angular.forEach(errJSON.errors, function(error, field) {
                console.log(field);
                form[field].$setValidity('mongoose', false);
                $scope.errors[field] = error.message;
              });
              $scope.$apply();
            }
        });
      }
    };

  });
