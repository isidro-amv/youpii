'use strict';

angular.module('youpiiBApp')
  .controller('PersonCtrl', function ($scope, Person) {
    Person.query(function (data) {
      console.log(data);
      $scope.persons = data;
    });
  });
