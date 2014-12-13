'use strict';

describe('Directive: mainSlider', function () {

  // load the directive's module and view
  beforeEach(module('youpiiBApp'));
  beforeEach(module('app/directives/mainSlider/mainSlider.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<add-slider></add-slider>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the mainSlider directive');
  }));
});