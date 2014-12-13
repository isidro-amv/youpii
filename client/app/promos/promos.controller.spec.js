'use strict';

describe('Controller: PromosCtrl', function () {

  // load the controller's module
  beforeEach(module('youpiiBApp'));

  var PromosCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PromosCtrl = $controller('PromosCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
