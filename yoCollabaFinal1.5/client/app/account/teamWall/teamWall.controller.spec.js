'use strict';

describe('Controller: TeamWallCtrl', function() {
  // load the controller's module
  beforeEach(module('collabaPullApp.teamWall'));

  var TeamWallCtrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    TeamWallCtrl = $controller('TeamWallCtrl', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
