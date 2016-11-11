'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarComponent {
  menu = [{
    title: 'Home',
    state: 'main'
  }];
  isLoggedIn: Function;
  isAdmin: Function;
  getCurrentUser: Function;
  isCollapsed = true;

  constructor(Auth) {
    'ngInject';

    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.isOrganisation = Auth.isOrganisation;
    this.getCurrentOrganisation = Auth.getCurrentOrganisation;

    this.isOrg = function() {
      console.log('Inside IsOrg');
      if(this.getCurrentUser().role == 'Organisation') {
        console.log(true) ;
        return true;
      }
      console.log(false);
      return false;
    }
    
  }


}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.html'),
    controller: NavbarComponent
  })
  .name;
