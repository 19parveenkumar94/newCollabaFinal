'use strict';

describe('Controller: AddToTeamExistingCtrl', function() {
  // load the controller's module
  beforeEach(module('yoCollabaFinalApp.addToTeamExisting'));

  var AddToTeamExistingCtrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    AddToTeamExistingCtrl = $controller('AddToTeamExistingCtrl', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
