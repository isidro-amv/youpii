'use strict';

describe('Controller: CitiesCtrl', function () {

  // load the controller's module
  beforeEach(module('youpiiBApp'));

  var CitiesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CitiesCtrl = $controller('CitiesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
