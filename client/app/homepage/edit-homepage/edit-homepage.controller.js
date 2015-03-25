'use strict';

angular.module('youpiiBApp')
  .controller('EditHomepageCtrl', function ($scope, $compile, $http, $location, $window, App) {
    var urlModel = 'website';
    $scope.sliders = [];
    $scope.sections = [];
    $scope.submitted = [];
    $scope.imagemain = [];
    $scope.imagemainCropped =[];
    $scope.imagemainl = [];
    $scope.imagemainCroppedl =[];

    $http.get(App.host+'website/').
      success(function(data) {
        $scope.sliders = data.sliders;
        $scope.sections = data.sections;
      }).
      error(function(data) {
        console.log(data);
        window.alert('Error al recuperar detalles del sitio');
      });


    $scope.addSlider = function () {
      $scope.sliders.push([]);
      // var i = $scope.sliders.length -1;
      // angular.element('#sliders').append($compile('<add-block index="'+i+'" >Hola</add-block>')($scope));
    };

    $scope.createSlider = function (form,index) {
      $scope.submitted[index] = true;
      if (form.$valid) {
        var params = {
          form: new FormData($('#sliders [index="'+index+'"]').find('form')[0]),
          url: urlModel+'/slider',
          method: 'POST'
        };
        App.sendRequest(params, function (data) {
          $window.alert('Slider creado');
          $scope.sliders = data.sliders;
        }, function () {
          $window.alert('Error al crear Slider');
        });
      }
    };

    $scope.updateSlider = function (form, index) {

      $scope.submitted[index] = true;

      if (form.$valid) {
        var $form = $('#sliders [index="'+index+'"]').find('form')[0];
        var params = {
          form: new FormData($form),
          url: urlModel+'/slider/'+$form._id.value,
          method: 'PUT'
        };
        App.sendRequest(params, function (data) {
          $window.alert('Slider Actualizado');
          $scope.sliders = data.sliders;
          console.log(data.sliders);
        }, function () {
          $window.alert('Error al actualizar Slider');
        });
      }
    };

    $scope.deleteSlider = function (index) {
      console.log('index',index);
      var wantToDelete = window.confirm('¿Estás segur@?');
      if (wantToDelete) {
        var form = $('#sliders [index="'+index+'"]').find('form')[0];
        var params = {
          form: null,
          url: urlModel+'/slider/'+form._id.value,
          method: 'DELETE'
        };
        App.sendRequest(params, function () {
          $window.alert('Slider Eliminado');
          $scope.sliders.splice(index,1);
          $scope.$apply();
        }, function () {
          $window.alert('Error al eliminar Slider');
        });
      }
    };
    // Home section
    $scope.addSection = function () {
      $scope.sections.push([]);
    };
    $scope.createSection = function (form, index) {
      console.log(form,index);
      $scope.submitted[index] = true;
      if (form.$valid) {
        var params = {
          form: new FormData($('home-section[index="'+index+'"]').find('form')[0]),
          url: urlModel+'/section',
          method: 'POST'
        };
        App.sendRequest(params, function (data) {
          $window.alert('Sección creada');
          $scope.sections = data.sections;
          $window.location.reload();
        }, function () {
          $window.alert('Error al crear Section');
        });
      }
    };
    $scope.updateSection = function (form, index) {

      $scope.submitted[index] = true;

      if (form.$valid) {
        var $form = $('home-section[index="'+index+'"]').find('form')[0];
        var params = {
          form: new FormData($form),
          url: urlModel+'/section/'+$form._id.value,
          method: 'PUT'
        };
        App.sendRequest(params, function (data) {
          $window.alert('Section Actualizado');
          $window.location.reload();
          $scope.sections = data.sections;
          console.log(data.sections);
        }, function () {
          $window.alert('Error al actualizar Section');
        });
      }
    };
    $scope.deleteSection = function (index) {
      console.log('index',index);
      var wantToDelete = window.confirm('¿Estás segur@?');
      if (wantToDelete) {
        var idSection = $('.home-section [index="'+index+'"] input[name="_id"]').val();
        var params = {
          form: null,
          url: urlModel+'/section/'+idSection,
          method: 'DELETE'
        };
        App.sendRequest(params, function () {
          $window.alert('Section Eliminado');
          $scope.sections.splice(index,1);
          $scope.$apply();
        }, function () {
          $window.alert('Error al eliminar section');
        });
      }
    };
    $scope.addBlock = function (sectionId) {
      var block = {
        kind: 0,
        dimension: 0
      };
      $scope.sections[sectionId].blocks.push(block);
    };
    $scope.createBlock = function (form, sectionIndex, index) {
      $scope.submitted[index] = true;
      var section = $('home-section[index="'+sectionIndex+'"]');
      var formBlock = section.find('promo-section[index="'+index+'"]').find('form')[0];
      var dataForm = new FormData(formBlock);
      var dataImgSlim = section.find('promo-section[index="'+index+'"]').find('.img-slim-'+index).attr('ng-src');
      var dataImgLarge = section.find('promo-section[index="'+index+'"]').find('.img-large-'+index).attr('ng-src');
      if (formBlock.kind.value === 'generic') {
        dataForm.append('imagemainCrop', App.dataURItoBlob(dataImgSlim), 'imagemainCrop.png');
        dataForm.append('imageLargeCrop', App.dataURItoBlob(dataImgLarge), 'imageLargeCrop.png');
      }
      if (form.$valid) {
        var params = {
          form: dataForm,
          url: urlModel+'/block/'+$scope.sections[sectionIndex]._id,
          method: 'POST'
        };
        App.sendRequest(params, function (data) {
          $window.alert('Block creado');
          console.log(data);
          $window.location.reload();
        }, function () {
          $window.alert('Error al crear Block');
        });
      }
    };
    $scope.updateBlock = function (form, sectionIndex, index) {
      console.log(sectionIndex,index);
      $scope.submitted[index] = true;
      var sectionId = $scope.sections[sectionIndex]._id;
      var blockId = $scope.sections[sectionIndex].blocks[index]._id;
      var section = $('home-section[index="'+sectionIndex+'"]');
      var formBlock = section.find('promo-section[index="'+index+'"]').find('form')[0];
      var dataForm = new FormData(formBlock);
      var dataImgSlim = section.find('promo-section[index="'+index+'"]').find('.img-slim-'+index).attr('ng-src');
      var dataImgLarge = section.find('promo-section[index="'+index+'"]').find('.img-large-'+index).attr('ng-src');
      if (formBlock.kind.value === 'generic') {
        dataForm.append('imagemainCrop', App.dataURItoBlob(dataImgSlim), 'imagemainCrop.png');
        dataForm.append('imageLargeCrop', App.dataURItoBlob(dataImgLarge), 'imageLargeCrop.png');
      }
      if (form.$valid) {
        var params = {
          form: dataForm,
          url: urlModel+'/block/'+sectionId+'/'+blockId,
          method: 'PUT'
        };
        App.sendRequest(params, function (data) {
          $window.alert('Bloque Actualizado');
          $window.location.reload();
          //$scope.sections = data.sections;
          console.log(data.sections);
        }, function () {
          $window.alert('Error al actualizar Bloque');
        });
      }
    };
    $scope.deleteBlock = function (sectionIndex, index) {
      var sectionId = $scope.sections[sectionIndex]._id;
      var blockId = $scope.sections[sectionIndex].blocks[index]._id;

      var params = {
        form: null,
        url: urlModel+'/block/'+sectionId+'/'+blockId,
        method: 'DELETE'
      };

      var wantToDelete = window.confirm('¿Estás segur@?');
      if (wantToDelete) {
        App.sendRequest(params, function () {
          $window.alert('Bloque Eliminado');
          $scope.sections[sectionIndex].blocks.splice(index,1);
          $scope.$apply();
        }, function () {
          $window.alert('Error al eliminar Bloque');
        });
      }
    };
    $scope.fileNameChanged = function (evt,el) {
      console.log(this);
      var img = el.getAttribute('cropImg');
      var index = el.getAttribute('index');
      console.log(img,index);
      var file=evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope){
          $scope[img][index] = evt.target.result;
        });
      };
      reader.readAsDataURL(file);
    };

  });
