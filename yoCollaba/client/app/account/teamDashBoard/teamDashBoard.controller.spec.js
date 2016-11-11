'use strict';

describe('Controller: TeamDashBoardCtrl', function() {
  // load the controller's module
  beforeEach(module('yoCollabaFinalApp.teamDashBoard'));

  var TeamDashBoardCtrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    TeamDashBoardCtrl = $controller('TeamDashBoardCtrl', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
