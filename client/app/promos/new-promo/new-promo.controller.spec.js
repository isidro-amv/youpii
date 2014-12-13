'use strict';

describe('Controller: NewPromoCtrl', function () {

  // load the controller's module
  beforeEach(module('youpiiBApp'));

  var NewPromoCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewPromoCtrl = $controller('NewPromoCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
