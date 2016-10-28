'use strict';
const angular = require('angular');

/*@ngInject*/
export function organisationDashBoardController(Auth,$state,$http,$cookies,$mdDialog) {
  var self=this;
  self.org = {};
this.Auth=Auth;
this.$state=$state;
this.$http=$http;
  this.setFormCheck=function(){
        this.showForm=1;
  }



  //Call to find organisation information by name

self.org=this.Auth.getCurrentUserSync();
console.log(self.org);





//toggles form in html page for add team
this.toggle=function(){
  if(this.show==false){
  this.show=true;
}else{
  this.show=false;
}
  }

//toggles data for members of team
  this.toggleMember=function(){
  if(this.showTeamInfo==false){
  this.showTeamInfo=true;
  }else{
  this.showTeamInfo=false;
  }
  }

  this.toggleTeam=function(){
  console.log("HI");
  if(this.showTeam==false){
  this.showTeam=true;
  }else{
  this.showTeam=false;
  }
  }

  this.toggleHide = function(index) {
      console.log(this.org.teams)
      this.org.teams[index].hide = !this.org.teams[index].hide;
    }


//poopulates menmbers for that team
this.getMembers = function(index){
this.$http.get('/api/teams/'+this.org.teams[index]._id)
   .success(function(data) {
     self.currentTeam=data;
});
this.teamId = team._id;
this.teamId.show = true;
}






//Add team to database, create general channel for team and send mail
this.addTeam=function(){
    console.log("here");
    var self=this;

    this.team.Organisation=self.org._id;

    this.Auth.addTeam(this.team)
        .then((data) =>{

            this.Auth.addTeamInOrg(self.org._id,data)
                      .then((data)=>{
                        console.log("team added in organisation user schema");
                      });
            this.Auth.createChannel(data)
                      .then((data)=>{

                        console.log(data);
                        console.log("channel created with team id");

                        this.Auth.addChannelInTeam({channelId:data._id,teamId:data.team})
                                  .then((data)=>{
                                    console.log('channel added in team');

                                  })

                      });
                      var postData = {
                        name: this.team.name,
                        email: this.team.email,
                        Teamname: this.team.name,
                        message: 'You have been requested to join '
                            + self.org.name + ' as a team lead! '
                            +'Please Click on the following link to join: '+
                            '127.0.0.1:3000/signup/'+data+'/'+
                            self.org._id + "/" + self.org.name + "/" + this.team.email
                        };

            this.$http.post('/email', postData)
             .success(function(data) {
               // Show success message
               console.log('mail sent successfully');
             })
             .error(function(data) {
               // Show error message
                 console.log(' XXX Error: mail not sent! ');
             });

          console.log("added in team");
        })
        .catch(err =>{
          console.log(err.message);
        });


         }
}

export default angular.module('yoCollabaFinalApp.organisationDashBoard', [])
  .controller('OrganisationDashBoardController', organisationDashBoardController)
  .name;
