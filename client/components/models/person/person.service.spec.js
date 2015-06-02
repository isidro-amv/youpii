'use strict';

describe('Service: person', function () {

  // load the service's module
  beforeEach(module('youpiiBApp'));

  // instantiate service
  var person;
  beforeEach(inject(function (_person_) {
    person = _person_;
  }));

  it('should do something', function () {
    expect(!!person).toBe(true);
  });

});
