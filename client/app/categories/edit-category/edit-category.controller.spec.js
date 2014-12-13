'use strict';

describe('Controller: EditCategoryCtrl', function () {

  // load the controller's module
  beforeEach(module('youpiiBApp'));

  var EditCategoryCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditCategoryCtrl = $controller('EditCategoryCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
