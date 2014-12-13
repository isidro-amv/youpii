'use strict';

describe('Controller: EditPackCtrl', function () {

  // load the controller's module
  beforeEach(module('youpiiBApp'));

  var EditPackCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditPackCtrl = $controller('EditPackCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
