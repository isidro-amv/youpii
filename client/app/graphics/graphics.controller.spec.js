'use strict';

describe('Controller: GraphicsCtrl', function () {

  // load the controller's module
  beforeEach(module('youpiiBApp'));

  var GraphicsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GraphicsCtrl = $controller('GraphicsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
