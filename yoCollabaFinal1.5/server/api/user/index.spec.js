'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var userCtrlStub = {
 index: 'userCtrl.index',
 destroy: 'userCtrl.destroy',
 me: 'userCtrl.me',
 changePassword: 'userCtrl.changePassword',
 show: 'userCtrl.show',
 create: 'userCtrl.create',
 uploadProfilePhoto: 'userCtrl.uploadProfilePhoto',
 saveProfilePhoto: 'userCtrl.saveProfilePhoto',
 updateTeam: 'userCtrl.updateTeam',
 add: 'userCtrl.add',
 findOrgbyName: 'userCtrl.findOrgbyName',
 addTeamInUser3: 'userCtrl.addTeamInUser3',
 addUserInOrg: 'userCtrl.addUserInOrg',
 updateTeam: 'userCtrl.updateTeam',
 addChannel: 'userCtrl.addChannel',
 domainCheck: 'userCtrl.domainCheck',
 checkExisting: 'userCtrl.checkExisting',
 deleteMemberFromChannel: 'userCtrl.deleteMemberFromChannel',
 saveMessage:'userCtrl.saveMessage',
 deleteMessage: 'userCtrl.deleteMessage'

};

var authServiceStub = {
 isAuthenticated() {
   return 'authService.isAuthenticated';
 },
 hasRole(role) {
   return `authService.hasRole.${role}`;
 }
};

var routerStub = {
 get: sinon.spy(),
 put: sinon.spy(),
 post: sinon.spy(),
 delete: sinon.spy()
};

// require the index with our stubbed out modules
var userIndex = proxyquire('./index', {
 express: {
   Router() {
     return routerStub;
   }
 },
 './user.controller': userCtrlStub,
 '../../auth/auth.service': authServiceStub
});

describe('User API Router:', function() {
 it('should return an express router instance', function() {
   expect(userIndex).to.equal(routerStub);
 });

 describe('GET /api/users', function() {
   it('should verify admin role and route to user.controller.index', function() {
     expect(routerStub.get
       .withArgs('/', 'authService.hasRole.admin', 'userCtrl.index')
       ).to.have.been.calledOnce;
   });
 });

 describe('GET /api/users/addProfilePic', function() {
   it('should route to user.controller.uploadProfilePhoto', function() {
     expect(routerStub.post
       .withArgs('/addProfilePic', 'userCtrl.uploadProfilePhoto')
       ).to.have.been.calledOnce;
   });
 });

 //
 // describe('GET /api/users/saveProfilePic', function() {
 //   it('should route to user.controller.saveProfilePhoto', function() {
 //     expect(routerStub.post
 //       .withArgs('/saveProfilePic', 'userCtrl.saveProfilePic')
 //       ).to.have.been.calledOnce;
 //   });
 // });

   describe('GET /api/users/updateTeam', function() {
     it('should route to user.controller.updateTeam', function() {
       expect(routerStub.post
         .withArgs('/updateTeam', 'userCtrl.updateTeam')
         ).to.have.been.calledOnce;
     });
   });

   describe('POST /api/users/addTeamInUser2', function() {
     it('should route to user.controller.addTeamInUser3', function() {
       expect(routerStub.post
         .withArgs('/addTeamInUser2', 'userCtrl.addTeamInUser3')
         ).to.have.been.calledOnce;
     });
   });
   describe('POST /api/users/saveMessage/:channelId', function() {
     it('should route to user.controller.saveMessage', function() {
       expect(routerStub.post
         .withArgs('/saveMessage/:channelId', 'userCtrl.saveMessage')
         ).to.have.been.calledOnce;
     });
   });
   describe('POST /api/users/deleteMessage/:channelId', function() {
     it('should route to user.controller.deleteMessage', function() {
       expect(routerStub.post
         .withArgs('/deleteMessage/:channelId', 'userCtrl.deleteMessage')
         ).to.have.been.calledOnce;
     });
   });

      describe('POST /api/users/addUserInOrg', function() {
        it('should route to user.controller.addUserInOrg', function() {
          expect(routerStub.post
            .withArgs('/addUserInOrg', 'userCtrl.addUserInOrg')
            ).to.have.been.calledOnce;
        });
      });


      describe('POST /api/users/deleteMemberFromChannel', function() {
        it('should route to user.controller.deleteMemberFromChannel', function() {
          expect(routerStub.post
            .withArgs('/deleteMemberFromChannel', 'userCtrl.deleteMemberFromChannel')
            ).to.have.been.calledOnce;
        });
      });


      describe('POST /api/users/saveProfilePic', function() {
        it('should route to user.controller.saveProfilePic', function() {
          expect(routerStub.post
            .withArgs('/saveProfilePic', 'userCtrl.saveProfilePhoto')
            ).to.have.been.calledOnce;
        });
      });



   describe('POST /api/users/add', function() {
     it('should route to user.controller.add', function() {
       expect(routerStub.post
         .withArgs('/add', 'userCtrl.add')
         ).to.have.been.calledOnce;
     });
   });

      describe('POST /api/users/updateTeam', function() {
        it('should route to user.controller.updateTeam', function() {
          expect(routerStub.post
            .withArgs('/updateTeam', 'userCtrl.updateTeam')
            ).to.have.been.calledOnce;
        });
      });

      describe('POST /api/users/domainCheck', function() {
        it('should route to user.controller.domainCheck', function() {
          expect(routerStub.post
            .withArgs('/domainCheck', 'userCtrl.domainCheck')
            ).to.have.been.calledOnce;
        });
      });
      describe('POST /api/users/checkExisting', function() {
        it('should route to user.controller.checkExisting', function() {
          expect(routerStub.post
            .withArgs('/checkExisting', 'userCtrl.checkExisting')
            ).to.have.been.calledOnce;
        });
      });

   describe('POST /api/users/addChannel', function() {
     it('should route to user.controller.addChannel', function() {
       expect(routerStub.post
         .withArgs('/addChannel', 'userCtrl.addChannel')
         ).to.have.been.calledOnce;
     });
   });


  describe('POST /api/users/findOrgbyName', function() {
    it('should route to user.controller.findOrgbyName', function() {
      expect(routerStub.post
        .withArgs('/findOrgbyName', 'userCtrl.findOrgbyName')
        ).to.have.been.calledOnce;
    });
  });



 describe('DELETE /api/users/:id', function() {
   it('should verify admin role and route to user.controller.destroy', function() {
     expect(routerStub.delete
       .withArgs('/:id', 'authService.hasRole.admin', 'userCtrl.destroy')
       ).to.have.been.calledOnce;
   });
 });

 describe('GET /api/users/me', function() {
   it('should be authenticated and route to user.controller.me', function() {
     expect(routerStub.get
       .withArgs('/me', 'authService.isAuthenticated', 'userCtrl.me')
       ).to.have.been.calledOnce;
   });
 });

 describe('PUT /api/users/:id/password', function() {
   it('should be authenticated and route to user.controller.changePassword', function() {
     expect(routerStub.put
       .withArgs('/:id/password', 'authService.isAuthenticated', 'userCtrl.changePassword')
       ).to.have.been.calledOnce;
   });
 });

 describe('GET /api/users/:id', function() {
   it('should be authenticated and route to user.controller.show', function() {
     expect(routerStub.get
       .withArgs('/:id', 'authService.isAuthenticated', 'userCtrl.show')
       ).to.have.been.calledOnce;
   });
 });

});
