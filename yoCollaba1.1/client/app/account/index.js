'use strict';

import angular from 'angular';
import ngFileUpload from 'ng-file-upload';

import uiRouter from 'angular-ui-router';

import routing from './account.routes';
import login from './login';
import settings from './settings';
import signup from './signup';
import organisationDashBoard from './organisationDashBoard/organisationDashBoard.controller';
import organisationRegister from './organisationRegister/organisationRegister.controller';
import loginOrganisation from './loginOrganisation/loginOrganisation.controller';
import teamDashBoard    from './teamDashBoard/teamDashBoard.controller';
import addToTeamExisting    from './addToTeamExisting/addToTeamExisting.controller';


import oauthButtons from '../../components/oauth-buttons';

export default angular.module('yoCollabaFinalApp.account', [uiRouter, ngFileUpload, login, settings, signup,
    oauthButtons, organisationDashBoard, organisationRegister, loginOrganisation, teamDashBoard,
    addToTeamExisting
  ])
  .config(routing)
  .run(function($rootScope) {
    'ngInject';

    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
      if(next.name === 'logout' && current && current.name && !current.authenticate) {
        next.referrer = current.name;
      }
    });
  })
  .name;
