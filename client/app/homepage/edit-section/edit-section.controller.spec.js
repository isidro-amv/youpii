'use strict';

describe('Controller: EditSectionCtrl', function () {

  // load the controller's module
  beforeEach(module('youpiiBApp'));

  var EditSectionCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditSectionCtrl = $controller('EditSectionCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
