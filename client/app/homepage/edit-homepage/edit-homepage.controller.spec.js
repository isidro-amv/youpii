'use strict';

describe('Controller: EditHomepageCtrl', function () {

  // load the controller's module
  beforeEach(module('youpiiBApp'));

  var EditHomepageCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditHomepageCtrl = $controller('EditHomepageCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
