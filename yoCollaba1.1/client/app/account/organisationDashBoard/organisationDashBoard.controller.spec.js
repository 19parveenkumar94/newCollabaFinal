'use strict';

describe('Controller: OrganisationDashBoardCtrl', function() {
  // load the controller's module
  beforeEach(module('yoCollabaFinalApp.organisationDashBoard'));

  var OrganisationDashBoardCtrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    OrganisationDashBoardCtrl = $controller('OrganisationDashBoardCtrl', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
