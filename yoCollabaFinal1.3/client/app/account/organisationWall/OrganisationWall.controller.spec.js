'use strict';

describe('Controller: OrganisationWallCtrl', function() {
  // load the controller's module
  beforeEach(module('collabaApp.OrganisationWall'));

  var OrganisationWallCtrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    OrganisationWallCtrl = $controller('OrganisationWallCtrl', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
