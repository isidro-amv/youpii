'use strict';

angular.module('youpiiBApp')
  .controller('EditPromoCtrl', function ($scope, Pack, $location, Promo, User, Category, App) {
    $scope.status = '';
    $scope.imagemainCropped='';
    $scope.imagemainlCropped = '';
    $scope.promo = [];
    $scope.categories = [];
    $scope.users = [];
    $scope.promoId = $location.path().split('/').slice(-1)[0];
    User.query(function (data) {
      $scope.users = data;
    });
    Category.query(function (data) {
      $scope.categories = data;
    });
    $scope.promoId = $location.path().split('/').slice(-1)[0];

    Promo.get({id:$scope.promoId}, function (data) {
      $scope.promo = data;
      console.log(data);
    });

    Pack.query(function (data) {
      $scope.packs = data;
    });

    $scope.delete = function () {
      var msg = '¿Realmente quieres eliminar esta promoción?';
      if ( window.confirm(msg) ) {
         $scope.promo.$delete();
         $location.path('/promos');
      }
    };

    $scope.update = function (form) {
      $scope.submitted = true;
      console.log(form);
      if(form.$valid) {
        var formData = new FormData($('.form')[0]);
        if ($scope.imagemainCropped) {
          formData.append('imagemainCrop', App.dataURItoBlob($scope.imagemainCropped), 'imagemainCrop.png');
          formData.append('imagemainlCrop', App.dataURItoBlob($scope.imagemainlCropped), 'imagemainlCrop.png');
        }
        App.sendRequest({
          method: 'PUT',
          form: formData,
          url: 'promos/'+$scope.promoId
        },function () {
          window.alert('promoción actualizado!');
          $scope.$apply();
        },function (err) {
          console.log(err);
          var errJSON = err.responseJSON;

          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(errJSON.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
          $scope.$apply();
        });
      }
    };

    angular.element('.fileInput').on('change',function(evt) {
      var img = this.getAttribute('cropImg');
      var file=evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope){
          $scope[img]=evt.target.result;
        });
      };
      reader.readAsDataURL(file);
    });
  });
