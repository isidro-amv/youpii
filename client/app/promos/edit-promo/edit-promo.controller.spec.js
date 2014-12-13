'use strict';

describe('Controller: EditPromoCtrl', function () {

  // load the controller's module
  beforeEach(module('youpiiBApp'));

  var EditPromoCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditPromoCtrl = $controller('EditPromoCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
