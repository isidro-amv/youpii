'use strict';

describe('Directive: homeSection', function () {

  // load the directive's module and view
  beforeEach(module('youpiiBApp'));
  beforeEach(module('app/directives/homeSection/homeSection.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<home-section></home-section>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the homeSection directive');
  }));
});