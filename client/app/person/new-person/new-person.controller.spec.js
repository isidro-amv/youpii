'use strict';

describe('Controller: NewPersonCtrl', function () {

  // load the controller's module
  beforeEach(module('youpiiBApp'));

  var NewPersonCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewPersonCtrl = $controller('NewPersonCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
