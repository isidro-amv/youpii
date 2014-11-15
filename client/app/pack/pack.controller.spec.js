'use strict';

describe('Controller: PackCtrl', function () {

  // load the controller's module
  beforeEach(module('youpiiBApp'));

  var PackCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PackCtrl = $controller('PackCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
