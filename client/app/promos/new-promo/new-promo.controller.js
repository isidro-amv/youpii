'use strict';

angular.module('youpiiBApp')
  .controller('NewPromoCtrl', function ($scope, Pack, Promo, User, Category, App, Auth, $location) {
    $scope.promo = {};
    $scope.errors = {};
    $scope.categories = [];
    $scope.users = [];
    $scope.packs = [];
    var today = new Date();

    $scope.promoKinds = [
      {id:'desc', title:'Descuento'},
      {id:'only', title:'Sólo'},
      {id:'free', title:'Gratis'},
      {id:'best', title:'Mejor Precio'},
      {id:'nxn', title:'2x1 - 3x2'},
      {id:'1xn-2', title:'2x1½'},
      {id:'from', title:'Desde'},
      {id:'freeship', title:'Enivio Gratis'}
    ];

    // Inicializa el resultado del crop
    $scope.imagemainCropped = '';
    $scope.imagemainlCropped = '';

    User.query(function (data) {
      $scope.users = data;
    });
    Pack.query(function (data) {
      $scope.packs = data;
    });
    Category.query(function (data) {
      $scope.categories = data;
    });

    $scope.promo = {
      title: {
        en: '',
        es: ''
      },
      promo: {
        en: '',
        es: ''
      },
      url:{
        en: '',
        es: '',
      },
      description:{
        en: '',
        es: ''
      },
      restriction:{
        en: '',
        es: ''
      },
      price: 0,
      dateStart: today.toISOString(),
      dateEnd: today.toISOString(),
      category: '',
      owner: '',
      currency: 'MXN',
      active: true
    };

    $scope.register = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        var formData = new FormData($('.form')[0]);

        formData.append('imagemainCrop', App.dataURItoBlob($scope.imagemainCropped), 'imagemainCrop.png');
        formData.append('imagemainlCrop', App.dataURItoBlob($scope.imagemainlCropped), 'imagemainlCrop.png');
        if ($(".promoKind option:selected" ).val()!=='') {
          formData.append('promoKind', $scope.promoKinds[$(".promoKind option:selected" ).val()].id);
        }

        window.alert('Subiendo promo...');
        App.sendRequest({
          method: 'POST',
          form: formData,
          url: 'promos/'
        },function (data) {
          console.log(data);
          $location.path('/promos');
          $scope.$apply();
        },function (err) {
          console.log(err);
          var errJSON = err.responseJSON;
          $scope.errors = {};
          // Update validity of form fields that match the mongoose errors
          if (errJSON.errors.length) {
            window.alert('Ocurrió un error, intenta nuevamente');
          }
          angular.forEach(errJSON.errors, function(error, field) {
            console.log(field);
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
