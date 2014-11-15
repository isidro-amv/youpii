'use strict';

describe('Service: pack', function () {

  // load the service's module
  beforeEach(module('youpiiBApp'));

  // instantiate service
  var pack;
  beforeEach(inject(function (_pack_) {
    pack = _pack_;
  }));

  it('should do something', function () {
    expect(!!pack).toBe(true);
  });

});
