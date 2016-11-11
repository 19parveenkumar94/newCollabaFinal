'use strict';

describe('Controller: OrganisationRegisterCtrl', function() {
  // load the controller's module
  beforeEach(module('yoCollabaFinalApp.organisationRegister'));

  var OrganisationRegisterCtrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    OrganisationRegisterCtrl = $controller('OrganisationRegisterCtrl', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
