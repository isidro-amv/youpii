'use strict';

describe('Controller: EditCityCtrl', function () {

  // load the controller's module
  beforeEach(module('youpiiBApp'));

  var EditCityCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditCityCtrl = $controller('EditCityCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
