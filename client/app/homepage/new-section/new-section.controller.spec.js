'use strict';

describe('Controller: NewSectionCtrl', function () {

  // load the controller's module
  beforeEach(module('youpiiBApp'));

  var NewSectionCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewSectionCtrl = $controller('NewSectionCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
