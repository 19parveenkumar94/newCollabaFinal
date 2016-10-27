'use strict';
const angular = require('angular');


export default angular.module('yoCollabaFinalApp.organisationRegister', [])
  .controller('OrganisationRegisterController', organisationRegisterController)
  .name;

  /*@ngInject*/
  export function organisationRegisterController(Auth,$state,$http) {
    this.Auth=Auth;
    this.$state = $state;
    this.$http=$http;
      //register function called from view
      var self=this;
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

        this.$http.post('/api/channels/',{name:"wall",type:"wall"})
          .success(function(channel){
            alert("data in channels");
                 alert(JSON.stringify(channel));
                 alert(data._id);
                 self.Auth.addChannelInOrg({userId:data._id,channelId:channel._id})
                  .then((data)=>{
                    alert("channel added in org");
                  });
          });
        // this.Auth.createChannelForWall({name:"wall",type:"wall"})
        //       .then((data)=>{
        //         alert("data in channels");
        //         alert(data);
        //       })
        alert("added in user Schema for organisation");
        //Create Channel for Organisation Wall
      });

    //Change state to go to login
    this.$state.go('loginOrganisation');

  }


  }
