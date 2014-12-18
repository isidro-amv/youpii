'use strict';

angular.module('youpiiBApp')
  .controller('NewPromoCtrl', function ($scope, Pack, Promo, User, Category, App, Auth, $location) {
    $scope.promo = {};
    $scope.errors = {};
    $scope.categories = [];
    $scope.users = [];
    $scope.packs = [];

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
        en: 'in buying medium pizza free 2 liter soda',
        es: 'en la compra de pizza mediana gratis un refresco de 2 litros'
      },
      promo: {
        en: 'Free',
        es: 'Gratis'
      },
      url:{
        en: 'martes-de-frescura-en-walmart',
        es: 'tuesday-freshness-in-walmart',
      },
      description:{
        en: '<p><strong>Description</strong> es simplemente el la creación de las hojas ,las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus  PageMaker, el cual incluye versiones de Lorem Ipsum.</p>',
        es: '<p><strong>Descripción</strong> es simplemente el texto de quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas , las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus  PageMaker, el cual incluye versiones de Lorem Ipsum.</p>'
      },
      restriction:{
        en: '<p><strong>Restriction</strong> es simplemente el la creación de las hojas , las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus  PageMaker, el cual incluye versiones de Lorem Ipsum.</p>',
        es: '<p><strong>Restrición</strong> es simplemente el la creación de las hojas , las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus  PageMaker, el cual incluye versiones de Lorem Ipsum.</p>'
      },
      price: 1500.35,
      dateStart: '2011-04-11',
      dateEnd: '2015-04-11',
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
