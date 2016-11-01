'use strict';

describe('Controller: LoginOrganisationCtrl', function() {
  // load the controller's module
  beforeEach(module('yoCollabaFinalApp.loginOrganisation'));

  var LoginOrganisationCtrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    LoginOrganisationCtrl = $controller('LoginOrganisationCtrl', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
