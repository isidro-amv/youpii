'use strict';

describe('Controller: EditPersonCtrl', function () {

  // load the controller's module
  beforeEach(module('youpiiBApp'));

  var EditPersonCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditPersonCtrl = $controller('EditPersonCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
