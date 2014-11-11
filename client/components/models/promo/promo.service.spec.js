'use strict';

describe('Service: promo', function () {

  // load the service's module
  beforeEach(module('youpiiBApp'));

  // instantiate service
  var promo;
  beforeEach(inject(function (_promo_) {
    promo = _promo_;
  }));

  it('should do something', function () {
    expect(!!promo).toBe(true);
  });

});
