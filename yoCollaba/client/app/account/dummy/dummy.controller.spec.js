'use strict';

describe('Controller: DummyCtrl', function() {
  // load the controller's module
  beforeEach(module('yoCollabaFinalApp.dummy'));

  var DummyCtrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    DummyCtrl = $controller('DummyCtrl', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
