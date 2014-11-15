'use strict';

describe('Controller: NewPackCtrl', function () {

  // load the controller's module
  beforeEach(module('youpiiBApp'));

  var NewPackCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewPackCtrl = $controller('NewPackCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
