'use strict';

describe('Controller: NewCategoryCtrl', function () {

  // load the controller's module
  beforeEach(module('youpiiBApp'));

  var NewCategoryCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewCategoryCtrl = $controller('NewCategoryCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
