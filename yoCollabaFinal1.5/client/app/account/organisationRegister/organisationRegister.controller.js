'use strict';
const angular = require('angular');


export default angular.module('yoCollabaFinalApp.organisationRegister', [])
  .controller('OrganisationRegisterController', organisationRegisterController)
  .name;

  /*@ngInject*/
  export function organisationRegisterController(Auth,$state,$http) {
    this.Auth = Auth;
    this.$state = $state;
    this.$http = $http;
    this.errors = {};
      //register function called from view
      var vm = this;

      if(form.$invalid) {
      //alert('Please fill the form Correctly.');
      return false;
    }

      this.register = function (form) {

      if(!this.matchPasswords() || this.form.$invalid) {
        //alert('Please fill the form Correctly.');
        return false;
      }

        //register function in service, used to add Org to database
        Auth.addUser({
        name: this.org.name,
        email: this.org.email,
        domainName: this.org.domain,
        phone: this.org.phone,
        password: this.org.password,
        website: this.org.website,
        address: this.org.address,
        about: this.org.about,
        role: 'Organisation'

      })
      .then((data)=>{

        this.$http.post('/api/channels/',{name:"wall", type:"wall"})
          .success(function(channel){
            //alert("data in channels");
                 //alert(JSON.stringify(channel));
                 //alert(data._id);
                 vm.Auth.addChannelInOrg({userId:data._id, channelId:channel._id})
                  .then((data)=>{
                    //alert("channel added in org");
                  });
          });
        // this.Auth.createChannelForWall({name:"wall",type:"wall"})
        //       .then((data)=>{
        //         //alert("data in channels");
        //         //alert(data);
        //       })
        //alert("added in user Schema for organisation");
        //Create Channel for Organisation Wall
      });

    //Change state to go to login
    this.$state.go('login');

  }




  }
