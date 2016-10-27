'use strict';
const angular = require('angular');

/*@ngInject*/
export function loginOrganisationController(Auth,$state,$cookies) {
  this.Auth=Auth;
  this.$state=$state;
  this.loginOrganisation=function(){
    this.Auth.loginOrganisation2({
      email:this.user.email,
      password:this.user.password
    })
      .then((data) => {
        // Logged in, redirect to home
        //Check if organisation is approved or not
        if(data.status=='permanent'){
        this.$state.go('organisationDashBoard');
        console.log($cookies.get('organisation'));
      }
        else {

          alert("your status is pending");
          this.$state.go('main');
        }
      })
      .catch(err => {
        //console.log(err.message);
      });
  }
}

export default angular.module('yoCollabaFinalApp.loginOrganisation', [])
  .controller('LoginOrganisationController', loginOrganisationController)
  .name;
