'use strict';
const angular = require('angular');


export default angular.module('yoCollabaFinalApp.organisationRegister', [])
  .controller('OrganisationRegisterController', organisationRegisterController)
  .name;

  /*@ngInject*/
  export function organisationRegisterController(Auth,$state) {
    this.Auth=Auth;
    this.$state = $state;

      //register function called from view
      this.register = function (form) {

        //register function in service, used to add Org to database
        Auth.register({
        name: this.name,
        email: this.email,
        domainName: this.domain,
        phone: this.phone,
        password: this.password,
        website: this.website,
        address: this.address,
        about: this.about
      });

    //Change state to go to login
    this.$state.go('loginOrganisation');

  }


  }
