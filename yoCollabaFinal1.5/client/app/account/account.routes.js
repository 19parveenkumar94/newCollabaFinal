'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('login', {
    url: '/login',
    template: require('./login/login.html'),
    controller: 'LoginController',
    controllerAs: 'vm'
  })
  .state('user', {
    url: '/user',
    template: require('./user/user.html'),
    controller: 'UserController',
    controllerAs: 'vm'
  })

  .state('loginOrganisation', {
    url: '/loginOrganisation',
    template: require('./loginOrganisation/loginOrganisation.html'),
    controller: 'LoginOrganisationController',
    controllerAs: 'vm'
  })
  .state('addToTeamExisting', {
    url: '/addToTeamExisting/:teamId/:email/:orgName/:role',
    template: require('./addToTeamExisting/addToTeamExisting.html'),
    controller: 'AddToTeamExistingController',
    controllerAs: 'vm'
  })

  .state('teamDashBoard', {
    url: '/teamDashBoard',
    template: require('./teamDashBoard/teamDashBoardmaterial.html'),
    controller: 'TeamDashBoardController',
    controllerAs: 'vm'
  })

  .state('organisationDashBoard', {
    url: '/organisationDashBoard',
    template: require('./organisationDashBoard/organisationDashBoard.html'),
    controller: 'OrganisationDashBoardController',
    controllerAs: 'vm'
  })
  .state('dummy', {
    url: '/dummy',
    template: require('./dummy/dummy.html'),
    controller: 'DummyController',
    controllerAs: 'vm'
  })

  .state('logout', {
      url: '/logout?referrer',
      referrer: 'main',
      template: '',
      controller($state, Auth,socket) {
        'ngInject';

        var referrer = $state.params.referrer || $state.current.referrer || 'main';

        Auth.logout();

        //$state.go(referrer);
        $state.go('main');
      }
    })
    .state('signup', {
      url: '/signup/:teamId/:orgId/:orgName/:email',
      template: require('./signup/signup.html'),
      controller: 'SignupController',
      controllerAs: 'vm'
    })
    .state('settings', {
      url: '/settings',
      template: require('./settings/settings.html'),
      controller: 'SettingsController',
      controllerAs: 'vm',
      authenticate: true
    }).state('registerOrg', {
      url: '/registerOrg',
      template: require('./organisationRegister/organisationRegister.html'),
      controller: 'OrganisationRegisterController',
      controllerAs: 'vm'
    }).state('orgWall', {
      url: '/orgWall',
      template: require('./organisationWall/organisationWallMaterial.html'),
      controller: 'OrganisationWallController',
      controllerAs: 'vm'
    })
    .state('teamWall', {
      url: '/teamWall',
      template: require('./teamWall/teamWall.html'),
      controller: 'TeamWallController',
      controllerAs: 'vm'
    })
    ;
}
