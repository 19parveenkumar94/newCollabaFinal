'use strict';
const angular = require('angular');
const ngFileUpload = require('ng-file-upload');
/*@ngInject*/
export function teamDashBoardController(Auth, $state, $http, socket, Upload, $timeout, $mdDialog) {
  var vm = this;

  this.message = 'Hello';
  this.Auth = Auth;
  this.$state = $state;
  this.$http = $http;
  this.socket = socket;
  this.Upload = Upload;
  this.$timeout = $timeout;
  this.message = '';
  this.teams = [];
  this.channels = [];
  this.channelId = '';
  this.chatHistory = [];

  this.id = '';
  this.userName = '';
  this.isTeamLead = false;
  vm.isGeneralChannel = true;
  this.currentUser = this.Auth.getCurrentUserSync();


  this.showFileStatus = false;
  this.percent = 0;
  this.teamsChannel = [];
  
  vm.selectedMembers = [];
  //  var toggle = false;
  this.toggle = false;
  this.currentChannel;
  this.currentTeam;
  this.showAddChannel = false;
  //alert(JSON.stringify(this.currentUser));
  vm.team = {};

  // this.showDialog=function (ev) {
  //      var parentEl = angular.element(document.body);
  //      $mdDialog.show({
  //        parent: parentEl,
  //        targetEvent: ev,
  //        template:
  //          '<md-dialog aria-label="List dialog">' +
  //          '  <md-dialog-content>'+
  //          '    <md-list>'+
  //          '      <md-list-item ng-repeat="item in vm.currentTeam.members">'+
  //          '       <p>Number {{item.name}}</p>' +
  //          '      '+
  //          '    </md-list-item></md-list>'+
  //          '  </md-dialog-content>' +
  //          '  <md-dialog-actions>' +
  //          '    <md-button ng-click="closeDialog()" class="md-primary">' +
  //          '      Close Dialog' +
  //          '    </md-button>' +
  //          '  </md-dialog-actions>' +
  //          '</md-dialog>'
  //     });
  //   }


  var originatorEv;

    this.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    this.pin = function(chat){
      alert("Pin to Wall clicked");
      alert(JSON.stringify(chat));
      if(chat.type == 'text')
      {
        vm.pinnedMessage = {
          'user': chat.sender,
          'message': chat.message,
          'messageType': chat.type,
        };
      }
      else if(chat.type == "file"){
        var tempMessage = "client/" + chat.message;
        var tempArr = tempMessage.split("/");
        var url = tempArr.join("\\");
        vm.pinnedMessage = {
          'user': chat.sender,
          'message': url,
          'messageType': chat.type,
        };
      }
      this.Auth.pinChatInChannel( {
              channelId:this.currentUser.organisation.channels[0], chat:vm.pinnedMessage})
          .then(data => {
              alert("chat added in org wall history");
          });

    }

  console.log(this.currentUser);
  //ajax call to get the teams data
  for(var i=0; i<this.currentUser.teams.length; i++){
  
  this.$http.get('/api/teams/' + this.currentUser.teams[i]._id)
  .success(function(data) {
    console.log("Hi I'm inside AJAX.");
    console.log(data);
    vm.team = data;
    vm.team.inChannel = [];
    for(var i=0; i<vm.team.channels.length; i++){
    for(var j=0; j<vm.team.channels[i].members.length; j++){
    if(vm.currentUser.name == vm.team.channels[i].members[j].name){
      vm.team.inChannel.push(vm.team.channels[i]);
  }
  }
}
  vm.teamsChannel.push(vm.team);
  });
}
/*for(var i=0;i<vm.teamsChannel.length;i++)
{
  vm.teamsChannel[i].inChannel = [];
for(var j=0;j<vm.teamsChannel[i].channels.length;i++){
for(var k=0;k<vm.teamsChannel[i].channels[j].members.length;k++){
  if(vm.currentUser.name==vm.teamsChannel[i].channels[j].members[k].name){
      vm.inChannel.push(vm.teamsChannel[i].channels[j]);
    }
}
}
}*/
console.log(vm.teamsChannel);
console.log(this.teamsChannel);
  // function displayTeam(data){
  //   vm.team = data;
  //   console.log(vm.team);
  //   }
  //Get user Info, Organisations, Teams and channels
  this.Auth.getCurrentUser()
  .then(currentUser => {
    this.id = currentUser._id;
    console.log('id:'+this.id);
    this.$http.get('/api/users/' + this.id)
    .then(response => {
      //On response from the api
      console.log("Response Data: " + JSON.stringify(response.data));
      //set the userName
      this.userName = response.data.name;
      //TODO: change channels according to teams
      //Get all teams for that user and set in select option
      this.teams = response.data.teams;
      //Set the default team name in the select option
      //this.selectedTeam = this.teams[0].name;
      for (var i = 0; i < response.data.channels.length; i++) {
        this.channels.push(response.data.channels[i]);
      }
      //set default channel id
      vm.channelId = response.data.channels[0]._id;
      //Connect to that room for chatting
      this.socket.room(this.channelId);
      //Set history in the chatHistory array coming from the api
      if (response.data.channels[0].history.length != 0) {
        for (var i = 0; i < response.data.channels[0].history.length; i++) {
          var extension = response.data.channels[0].history[i].message.split('.');
          if(extension.length>1)
          {
            //if the chat element is file it's href needs to be from client folder
            var messageUrl = response.data.channels[0].history[i].message.split('\\');
            messageUrl.splice(0,1);
            messageUrl= messageUrl.join("/");
            vm.chatHistory.unshift({
              sender: response.data.channels[0].history[i].user,
              message: messageUrl,
              type: response.data.channels[0].history[i].messageType,
              ext:extension[extension.length-1]
            });
          }
          else {
            //text chats
            vm.chatHistory.unshift({
              sender: response.data.channels[0].history[i].user,
              message: response.data.channels[0].history[i].message,
              type: response.data.channels[0].history[i].messageType,
              ext:extension[extension.length-1]
            });
          }
        }
      }
      console.log("InitMethod channel: " + this.channelId);
    });
    //Updating chat messages when new message is set on the room
  this.socket.syncUpdatesChats(data => {
    var extension = data.message.split('.');
    if(extension.length > 1)
    {
      //if the chat element is file it's href needs to be from client folder
      var messageUrl = data.message.split('\\');
      messageUrl.splice(0,1);
      messageUrl = messageUrl.join("/");
      vm.chatHistory.unshift({
        sender: data.sender,
        message: messageUrl,
        type: data.type,
        ext:extension[extension.length-1]
      });
    }
    else {
      //text chats
      vm.chatHistory.unshift({
        sender: data.sender,
        message: data.message,
        type: data.type,
        ext:extension[extension.length-1]
      });
    }
  });
  });
  // On changing channel, click method
    this.channelClick = function(channel, team) {
      
      this.toggle = true;
      
      console.log(channel);
      console.log(team);

      this.currentChannel = channel;
      this.currentTeam = team;

      if(this.currentTeam.teamLeadEmail == this.currentUser.email) {
        vm.isTeamLead = true;
        this.showAddChannel = true;
      } else {
        vm.isTeamLead = false;
        this.showAddChannel = false;
      }

      if(vm.currentChannel.name == 'general')
          vm.isGeneralChannel = true;
      else
        vm.isGeneralChannel = false;

      console.log('Current User is Team Lead : ' + vm.isTeamLead);

      //Empty the chat history
      vm.chatHistory = [];
      //Set new channelId in the current scope
      vm.channelId = channel._id;
      //Set new chat room on the server side
      vm.socket.room(this.channelId);
      //Hit the api to get chat history for current channel id
      vm.$http.get('/api/channels/'+ this.channelId)//+ this.id + "/"
      .then(response => {
        console.log("channel: " + this.channelId);
        console.log(response.data);
        //Set history in the chatHistory array coming from the api
        if (response.data.history.length != 0) {
          for (var i = 0; i < response.data.history.length; i++) {
            var extension = response.data.history[i].message.split('.');
            if(extension.length > 1)
            {
              //if the chat element is file it's href needs to be from client folder
              var messageUrl = response.data.history[i].message.split('/');
              messageUrl.splice(0,1);
              messageUrl = messageUrl.join("/");
              vm.chatHistory.unshift({
                sender: response.data.history[i].user,
                message: messageUrl,
                type: response.data.history[i].messageType,
                ext:extension[extension.length-1]
              });
            }
            else {
              //text chats
              vm.chatHistory.unshift({
                sender: response.data.history[i].user,
                message: response.data.history[i].message,
                type: response.data.history[i].messageType,
                ext: extension[extension.length-1]
              });
            }
          }
         this.sendChatHistory(vm.chatHistory);
        }
      });
    }
    

    this.sendChatHistory = function(chatHistory) {
      console.log(chatHistory);
      vm.chatHistory = chatHistory;
      console.log(vm.chatHistory);
    }
//   this.openLink = function(url) {
//     var ext = url.split('/');
//     ext=ext[ext.length-1];
//     var file = fs.createWriteStream("file."+ext);
//       var config = {
//           headers:  {
//               'Authorization': Auth.getToken(),
//           }
//       };
//       console.log('In open link');
//       $http.get(url, config,function(response) {
//   response.pipe(file);
// });
//   }
  this.sendMessage = function() {
    console.log(this.message);
    //If the input field is not empty
    if (this.message) {
      //Emit the socket with senderName, message and channelId
      this.socket.sendMessage({
        'sender': this.userName,
        'message': this.message,
        'type': 'text',
        'room': this.channelId
      });
      //TODO- save the messages on server side
      //Hit api to update chat history in the db
      this.$http.post('/api/users/saveMessage/' + this.channelId, {
        data: {
          'user': this.userName,
          'message': this.message,
          'type': 'text'
        }
      })
      .then(response => {
        console.log(response.data);
      });
      //Empty the input field
      this.message = '';
    }
  }
  //to upload a file
  this.upload = function (file, errFiles) {
      console.log('File Upload initiated.');
      this.f = file;
      this.errFile = errFiles && errFiles[0];
      if (file) {
        file.upload = this.Upload.upload({
          'user': this.userName,
          'type': 'file',
          url: 'api/users/uploads',
          file: file
        });
        file.upload.then(response => {
          this.$timeout(() => {
            this.showFileStatus = false;
            this.percent = 0;
            file.result = response.data;
            console.log(response.data);
              //Emit the socket with senderName, fileName and channelId
              this.socket.sendMessage({
                'sender': this.userName,
                'message': response.data.filePath,
                'type': 'file',
                'room': this.channelId
              });
              //Hit api to update chat history in the db
              console.log('before sending file message');
              this.$http.post('/api/users/saveMessage/' + this.channelId, {
                data: {
                  'user': this.userName,
                  'message': response.data.filePath,
                  'type': 'file'
                }
              })
              .then(response => {
                console.log(response.data);
              });
          });
        }, response => {
          if (response.status > 0)
            console.log(response.status + ": " + response.data);
        }, evt => {
          this.showFileStatus = true;
          this.percent = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
      }
    };


//to add a new channel
    this.addChannel = function(team){
      alert(this.channelName + " " + team._id + " " + team.name);
      // console.log(vm.selectedMembers);
      console.log(Object.keys(vm.selectedMembers));
      //ajax call to get channels
      this.$http.post('/api/channels/', {name:this.channelName})
        .success(function(data) {
          console.log(data);
          console.log(vm.currentUser.teams[0].members.length);
          var a = { members: vm.currentUser.teams[0].members };
          console.log(a);
          alert(data._id);
          vm.Auth.addMembersInChannel({channelId:data._id,members:Object.keys(vm.selectedMembers),teamId:team._id});
          vm.Auth.addChannelInTeam({channelId:data._id,teamId:team._id});
          for(var i=0; i<Object.keys(vm.selectedMembers).length; i++) {
            vm.Auth.addChannelInUser({userId:Object.keys(vm.selectedMembers)[i],channelId:data._id});
          }
      });
    }


//to add a member
  this.addMember = function(team) {
    alert("in sending mail");
//send a mail to the member with the entereed email
    var postData = {
      email: this.addMemberEmail,
      message: 'You have been requested to join ' + team.name + '! '
              +'Please Click on the following link to join 127.0.0.1:3000/signup/' 
              + team._id + '/' + this.currentUser.organisation._id + "/" 
              + this.currentUser.organisation.name + "/" + this.addMemberEmail
    };
    
    console.log(postData);

    this.$http.post('/email', postData)
      .success(function(data) {
        // Show success message
        alert("you have sent a mail to a new member");
        console.log('mail sent successfully');
      })
      .error(function(data) {
        // Show error message
      console.log(' XXX Error: mail not sent! ');
      });
    }

  //Allow deletion of a Channel.
  vm.allowChannelDeletion = function(cName) {
    if(cName == 'general' || cName == 'wall')
      return false;

    return true;
  }

  //Delete Channel
  vm.deleteChannel = function(cName, cId) {
    if(vm.allowChannelDeletion(cName) == false) 
      return false;

    if(confirm(" Confirm Delete Channel '" + cName + "' ?") == false)
      return false;
    
    console.log("Deleting Channel : '" + cName + "', " + cId);

    vm.$http.post('/api/channels/deleteChannel', { channelId: cId, teamId: vm.currentTeam._id})
        .success(function(data) {
          vm.$state.go('teamDashBoard');
          console.log('Channel Successfully Deleted.');
        })
        .error(function(err) {
          console.error(err);
        });

    return true;
  }

  //Allow Deletion of a Member
  vm.allowMemberDeletion = function(mName) {
    if(mName == vm.currentUser.name 
        || vm.currentChannel.name == 'general' || vm.currentChannel.name == 'wall')
      return false;

    return true;
  }

  //Delete Member from Current Channel
  vm.deleteMemberFromChannel = function(mName, mId) {
    if(vm.allowMemberDeletion(mName) == false) 
      return false;

    if(confirm(" Confirm Delete Member '" + mName + "' from '" + vm.currentChannel.name + "' ?") == false)
      return false;
    var cId = vm.currentChannel._id;
    
    console.log("Deleting Member : '" + mName + "', " + mId + " from '" + vm.currentChannel.name + "'.");

    vm.$http.post('/api/users/deleteMemberFromChannel', {memberId: mId, channelId: cId})
        .success(function(data) {
          vm.$state.go('teamDashBoard');
          console.log('Member Successfully Deleted.');
        })
        .error(function(err) {
          console.error(err);
        });

    return true;
  }

  

}


export default angular.module('yoCollabaFinalApp.teamDashBoard', [])
.controller('TeamDashBoardController', teamDashBoardController)
.name;
