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
        Auth.addUser({
        name: this.name,
        email: this.email,
        domainName: this.domain,
        phone: this.phone,
        password: this.password,
        website: this.website,
        address: this.address,
        about: this.about,
        role: 'Organisation'

      })
      .then((data)=>{
        alert("added in user Schema for organisation");
        //Create Channel for Organisation Wall
      });

    //Change state to go to login
    this.$state.go('loginOrganisation');

  }


  }
