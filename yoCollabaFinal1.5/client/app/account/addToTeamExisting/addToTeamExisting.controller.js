'use strict';
const angular = require('angular');

/*@ngInject*/
export function addToTeamExistingController(Auth,$state,$stateParams) {

  this.Auth=Auth;
  this.$state=$state;
  this.$stateParams=$stateParams;
  alert($stateParams.teamId+" "+$stateParams.email+" "+$stateParams.orgName+" "+$stateParams.role);
  this.Auth.addTeamInUser($stateParams.email,$stateParams.teamId)
            .then((user)=>{
              console.log("team added in user");
              console.log(user);
              this.Auth.addUserInTeam({teamId:$stateParams.teamId,userId:user._id})
                        .then((team) =>{
                          console.log("user added in team");
                          console.log(team);
                          alert("added in team and user");
                          alert(team.channels[0]+" "+user._id);
                          this.Auth.addChannelInUser({'channelId':team.channels[0],'userId':user._id});


                                  this.Auth.addUserInChannel({'teamId':$stateParams.teamId,'userId':user._id})
                                        .then((data)=>{
                                          console.log('addes user in channel');
                                          return data;
                                        })


                        });

            })
            this.$state.go('login');

}

export default angular.module('yoCollabaFinalApp.addToTeamExisting', [])
  .controller('AddToTeamExistingController', addToTeamExistingController)
  .name;
