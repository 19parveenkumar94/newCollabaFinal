'use strict';
const angular = require('angular');
const ngFileUpload = require('ng-file-upload');
import emojione from 'emojione/lib/js/emojione.min';
/*@ngInject*/
export function teamDashBoardController(Auth,$state,$http,socket,Upload,$timeout,$mdDialog,$rootScope, $scope, $mdToast,Notification,$sce,MessageService) {
  this.message = 'Hello';
  this.Auth=Auth;
  this.Notification=Notification;
  this.$state=$state;
  this.$http=$http;
  this.socket=socket;
  this.Upload = Upload;
  this.$timeout = $timeout;
  this.message = '';
  this.teams = [];
  this.channels = [];
  this.channelId = '';
  this.chatHistory = [];
  this.channelExists='';
  this.channelCreated=[];
  this.$scope=$scope;
  this.currentChatUser='';
  this.$mdDialog=$mdDialog;
  this.isTeamLead = false;
  this.isGeneralChannel = true;
  this.id = '';
  this.userTyping=[];
  this.userName = '';
  this.isTeamLead=0;
  this.currentUser=this.Auth.getCurrentUserSync();
  //alert("organisation channel");
  //alert(this.currentUser.organisation.channels[0]);
  if(this.currentUser.role=='teamLead')
  this.isTeamLead=1;
  this.showFileStatus=false;
  this.percent=0;
  this.teamsChannel = [];
  this.trustAsHtml = $sce.trustAsHtml;
  this.MessageService = MessageService;
  var self = this;
   self.selectedMembers=[];
   this.toggle=false;
//  var toggle = false;
  this.toggle = false;
  this.onlineUsers=[];
  this.currentChannel;
  this.currentTeam;
  this.onlineUsers=[];
  this.showAddChannel = false;
  this.convert=function(message){

    //alert(message);
    return emojione.shortnameToImage(message);
  }
  var self=this;
  self.team = {};
  $scope.$on('$destroy', function() {
      socket.removeFromOnlineUserList({name:Auth.getCurrentUserSync().name,email:Auth.getCurrentUserSync().email})
      if(self.channelId){
        //alert("leave");
        self.socket.roomLeave(self.channelId);
      }
    });
this.socket.addOnlineUsers({name:this.currentUser.name,email:this.currentUser.email});
this.currentChannel=this.currentUser.organisation.channels[0];

this.socket.room(this.currentUser.organisation.channels[0]);
self.channelId=this.currentUser.organisation.channels[0]
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

    this.teamWall=function(c,t){
      //alert("in team wall");
      $rootScope.channel=c;
      $rootScope.team=t;
      self.$state.go('teamWall');
    }


    this.isTyping =function() {
       this.socket.isTyping({name:this.currentUser.name,room:this.channelId});
     }


this.socket.syncDoneTyping(data=>{
  if(this.userTyping.indexOf(data.name)!=-1){
    alert("here");
    this.userTyping.splice(this.userTyping.indexOf(data.name),1);
  }
})

    this.socket.syncIsTyping(data =>{
    if(this.userTyping.indexOf(data.name)==-1){
    this.userTyping.push(data.name);
    }

    console.log(this.userTyping);
    if(this.userTyping.length<2){
     this.lessThanTwo=true;
    }

    if(data.name!=null){
    this.typing = true;
    }
    });

    this.doneTyping = function(data){
     console.log("done typing"+data)
     this.typing = false;
     this.userTyping.splice(this.userTyping.indexOf(data),1);
     this.socket.doneTyping({name:data,room:self.channelId});
    }












//pinning to team wall after clicking pin to team wall channel
    this.pinToTeamWall=function(chat){
      //alert("clicked in team wall");
      //alert(JSON.stringify(chat));
      if(chat.type=='text')
      {
        self.pinnedMessage={
          'user':chat.sender,
          'message':chat.message,
          'messageType':chat.type,
          'video':chat.video,
          'thumbNail':chat.thumbNail

        };
      }
      else if(chat.type=="file"){
        var tempMessage="client/"+chat.message;
        var tempArr=tempMessage.split("/");
         var url=tempArr.join("\\");
        self.pinnedMessage={
          'user':chat.sender,
          'message':url,
          'messageType':chat.type,

        };
      }
      var wall=this.currentTeam.channels.filter(function(req){
        return req.name=='wall';
      });
      ////alert(JSON.stringify(this.currentTeam.channels));
      //alert(JSON.stringify(wall));
      //alert(wall[0]._id);
      //alert(wall[0].name);
        this.Auth.pinChatInChannel({channelId:wall[0]._id,chat:self.pinnedMessage})
                  .then(data=>{
                    //alert("chat added in team wall history");
                  })

    }

//pinning to org wall after clicking pin to org wall channel
    this.pinToOrg=function(chat){
      //alert("clicked");
      //alert(JSON.stringify(chat));
      if(chat.type=='text')
      {
        self.pinnedMessage={
          'user':chat.sender,
          'message':chat.message,
          'messageType':chat.type,

        };
      }
      else if(chat.type=="file"){
        var tempMessage="client/"+chat.message;
        var tempArr=tempMessage.split("/");
         var url=tempArr.join("\\");
        self.pinnedMessage={
          'user':chat.sender,
          'message':url,
          'messageType':chat.type,

        };
      }
      this.Auth.pinChatInChannel({channelId:this.currentUser.organisation.channels[0],chat:self.pinnedMessage})
                .then(data=>{
                  //alert("chat added in org wall history");
                })

    }

  console.log(this.currentUser);
//ajax call to get the teams data
  for(var i=0;i<this.currentUser.teams.length;i++){
  if(this.currentUser.email == this.currentUser.teams[i].teamLeadEmail){
    self.isTeamLead
  }
  this.$http.get('/api/teams/'+this.currentUser.teams[i]._id)
  .success(function(data) {
    console.log("HI I AM INSIDIE AJAX");
    console.log(data);
    self.team=data;
    self.team.inChannel=[];
    for(var i=0;i<self.team.channels.length;i++){
    for(var j=0;j<self.team.channels[i].members.length;j++){
    if(self.currentUser.name==self.team.channels[i].members[j].name){
      self.team.inChannel.push(self.team.channels[i]);
  }
  }
}
  self.teamsChannel.push(self.team);
  //alert(JSON.stringify(self.teamsChannel.inChannel));

  });
}

/*for(var i=0;i<self.teamsChannel.length;i++)
{
  self.teamsChannel[i].inChannel = [];
for(var j=0;j<self.teamsChannel[i].channels.length;i++){
for(var k=0;k<self.teamsChannel[i].channels[j].members.length;k++){
  if(self.currentUser.name==self.teamsChannel[i].channels[j].members[k].name){
      self.inChannel.push(self.teamsChannel[i].channels[j]);
    }
}
}
}*/
console.log(self.teamsChannel);
console.log(this.teamsChannel);
  // function displayTeam(data){
  //   self.team = data;
  //   console.log(self.team);
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
      /*self.channelId = response.data.channels[0]._id;
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
            self.chatHistory.unshift({
              sender: response.data.channels[0].history[i].user,
              message: messageUrl,
              type: response.data.channels[0].history[i].messageType,
              ext:extension[extension.length-1]
            });
          }
          else {
            //text chats
            self.chatHistory.unshift({
              sender: response.data.channels[0].history[i].user,
              message: response.data.channels[0].history[i].message,
              type: response.data.channels[0].history[i].messageType,
              ext:extension[extension.length-1]
            });
          }
        }
      }
      console.log("InitMethod channel: " + this.channelId);*/
    });


    //function to display if a particular user is online given his email
    this.checkIfOnline=function(m){
      for(var i=0;i<this.onlineUsers.length;i++)
      {
        if(m.email==this.onlineUsers[i].email){
          ////alert("found");
          return true;
      }
      }
      ////alert("notfound");
      return false;
    }

    //updating the online users list
    this.socket.syncUpdatedOnlineUserList(data => {
    this.onlineUsers=data;
    });

    //notifications for users
    this.socket.syncNotifiaction(data => {
      var present=0;
      // //alert("notify");
      // //alert(this.channelId);
      // //alert(data.room);
      self.$http.get('/api/channels/'+ data.room)//+ this.id + "/"
      .then(response => {
        //alert("in room channel");
      for(var i=0;i<response.data.members.length;i++)
      {
        if(response.data.members[i]==this.currentUser._id)
        {
          present=1;
        }
      }
      //alert(present);
      //alert(data.room+" "+self.channelId);
      if(present==1)
      {
        if(data.room!=self.channelId&&self.channelId)
        {
          //alert("you have a message from "+data.room+" "+data.sender);
          this.Notification.warning("you have recieved a message in "+response.data.name+" by "+data.sender);
        }
      }
      });
    });
    //Updating chat messages when new message is set on the room
  this.socket.syncUpdatesChats(data => {

    var extension = data.message.split('.');
    if(data.messageType == 'file')
    {
      //if the chat element is file it's href needs to be from client folder
      var messageUrl = data.message.split('\\');
      messageUrl.splice(0,1);
      messageUrl= messageUrl.join("/");
      self.chatHistory.unshift({
        sender: data.sender,
        message: messageUrl,
        type: data.type,
        ext:extension[extension.length-1]
      });
    }
    else {
      //text chats
      //alert("data synced");
      console.log(JSON.stringify(data));
      self.chatHistory.unshift({
        sender: data.sender,
        message: this.convert(data.message),
        type: data.type,
        video:data.video,
        thumbNail:data.thumbNail,
        ext:extension[extension.length-1]
      });
    }
  });
  });


  this.showVideo=function(event, video) {
    this.$mdDialog.show({
      controller: VideoController,
      controllerAs: 'innervmVideo',
      template: require("./video.html"),
      parent: angular.element(document.body),
      locals: {
        video: video
      },
      targetEvent: event,
      clickOutsideToClose: true
    })

    /*@ngInject*/
    function VideoController( $sce,$mdDialog, video) {
        this.video= video;
        this.trustAsHtml=$sce.trustAsHtml;
        //alert(this.video);
        this.closeDialog = function() {
          $mdDialog.hide();
        }
      }
    // .then(function () {});
  }

  // On changing channel, click method
    this.channelClick=function(channel,team) {
      //alert('inside channel click');
      //alert(channel);
      this.pChat=false;
      if(this.toggle==false){
        this.toggle=true
      }
        else{
          this.toggle=true;
        }
      console.log(channel);
      console.log(team);
      this.currentChannel=channel;
      this.currentTeam = team;
      if(this.currentTeam.teamLeadEmail==this.currentUser.email){
        self.isTeamLead = true;
        this.showAddChannel=true;
      }else{
        self.isTeamLead = false;
        this.showAddChannel=false;
      }

      if(this.currentChannel.name == 'general')
          this.isGeneralChannel = true;
      else
        this.isGeneralChannel = false;

      console.log('Current User is Team Lead : ' + this.isTeamLead);


      if(self.channelId){
        //alert("leave");
        self.socket.roomLeave(self.channelId);
      }

      //Empty the chat history
      self.chatHistory = [];
      //Set new channelId in the current scope
      self.channelId = channel._id;
      //Set new chat room on the server side
      self.socket.room(this.channelId);
      //Hit the api to get chat history for current channel id
      self.$http.get('/api/channels/'+ this.channelId)//+ this.id + "/"
      .then(response => {
        console.log("channel: " + this.channelId);
        console.log(response.data);
        //Set history in the chatHistory array coming from the api
        if (response.data.history.length != 0) {
          for (var i = 0; i < response.data.history.length; i++) {
            var extension = response.data.history[i].message.split('.');
            if(response.data.history[i].messageType == 'file')
            {
              //if the chat element is file it's href needs to be from client folder
              var messageUrl = response.data.history[i].message.split('/');
              messageUrl.splice(0,1);
              messageUrl= messageUrl.join("/");
              self.chatHistory.unshift({
                sender: response.data.history[i].user,
                message: messageUrl,
                type: response.data.history[i].messageType,
                ext:extension[extension.length-1]
              });
            }
            else {
              //text chats
              self.chatHistory.unshift({
                sender: response.data.history[i].user,
                message: this.convert(response.data.history[i].message),
                type: response.data.history[i].messageType,
                video: response.data.history[i].video,
                thumbNail:response.data.history[i].thumbNail,
                ext:extension[extension.length-1]
              });
            }
          }
         this.sendChatHistory(self.chatHistory);
        }
      });
    }
     this.sendChatHistory=function(chatHistory){
    console.log(chatHistory);
    self.chatHistory=chatHistory;
    console.log(self.chatHistory);
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
  this.sendMessage=function() {
    console.log(this.message);
    //If the input field is not empty
    if (this.message) {
      //Emit the socket with senderName, message and channelId
      this.MessageService.sendMessage(this.userName,this.message,'post',this.channelId);
      //Empty the input field
      this.message = '';
    }
  }
  //to upload a file
  this.upload = function (file, errFiles) {
      console.log('upload file initiated');
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
            this.showFileStatus=false;
            this.percent=0;
            file.result = response.data;
            console.log(response.data);
              //Emit the socket with senderName, fileName and channelId
              this.socket.sendMessage({
                'sender': this.userName,
                'message': response.data.filePath,
                'type':'file',
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
          this.showFileStatus=true;
          this.percent = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
      }
    };
//to add a new channel
    this.addChannel=function(team){
      //alert(this.channelName+" "+team._id+" "+team.name);
      // console.log(self.selectedMembers);
      console.log(Object.keys(self.selectedMembers))
      //ajax call to get channels
      this.$http.post('/api/channels/',{name:this.channelName})
      .success(function(data){
        console.log(data);
        console.log(self.currentUser.teams[0].members.length);
        var a={members:self.currentUser.teams[0].members};
        console.log(a);
        //alert(data._id);
        self.Auth.addMembersInChannel({channelId:data._id,members:Object.keys(self.selectedMembers),teamId:team._id});
        self.Auth.addChannelInTeam({channelId:data._id,teamId:team._id});
        for(var i=0;i<Object.keys(self.selectedMembers).length;i++)
        {
          self.Auth.addChannelInUser({userId:Object.keys(self.selectedMembers)[i],channelId:data._id});
        }
      });
    }
    this.privateChat = function(user){
        this.pChat = true;
        this.currentChatUser=user;
         this.currentPrivateUser=this.Auth.getCurrentUserSync();
         this.channelExists=false;
           for(var i=0;i<this.currentUser.channels.length;i++){
           if(this.currentUser.channels[i].name==user.email+"-"+this.currentUser.email||this.currentUser.channels[i].name==this.currentUser.email+"-"+user.email){
           var channel = this.currentUser.channels[i];
           this.channelExists=true;
           this.privateChannel(channel);
           this.indexChannel = i;
           break;
         }
       }
       if(this.channelExists!=true&&this.channelCreated.indexOf(user.email)==-1){
         this.createPrivateChannel(user);
         }

       }

       this.createPrivateChannel = function(user){
         this.channelName=user.email+"-"+this.currentUser.email;
         this.$http.post('/api/channels/',{name:this.channelName})
         .success(function(data){
           console.log(data);
           //alert(data._id);
           self.selectedMembers=[self.currentUser._id,user._id]
           self.Auth.addMembersInChannel({channelId:data._id,members:self.selectedMembers});

           for(var i=0;i<self.selectedMembers.length;i++)
           {
             self.Auth.addChannelInUser({userId:self.selectedMembers[i],channelId:data._id});
           }
         self.channelCreated.push(user.email);
         self.privateChannel(data);
         });

       }


       this.privateChannel=function(channel) {

         console.log(channel);


         //Empty the chat history
         self.chatHistory = [];
         //Set new channelId in the current scope
         if(self.channelId){
           self.socket.roomLeave(self.channelId)
         }
         self.channelId = channel._id;
         console.log(self.channelId);
         //Set new chat room on the server side
         self.socket.room(self.channelId);
         //Hit the api to get chat history for current channel id
         self.$http.get('/api/channels/'+ this.channelId)//+ this.id + "/"
         .then(response => {
           console.log("channel: " + this.channelId);
           console.log(response.data);
           //Set history in the chatHistory array coming from the api
           if (response.data.history.length != 0) {
             for (var i = 0; i < response.data.history.length; i++) {
               var extension = response.data.history[i].message.split('.');
               if(extension.length>1)
               {
                 //if the chat element is file it's href needs to be from client folder
                 var messageUrl = response.data.history[i].message.split('/');
                 messageUrl.splice(0,1);
                 messageUrl= messageUrl.join("/");
                 self.chatHistory.unshift({
                   sender: response.data.history[i].user,
                   message: messageUrl,
                   type: response.data.history[i].messageType,
                   ext:extension[extension.length-1]
                 });
               }
               else {
                 //text chats
                 self.chatHistory.unshift({
                   sender: response.data.history[i].user,
                   message: response.data.history[i].message,
                   type: response.data.history[i].messageType,
                   ext:extension[extension.length-1]
                 });
               }
             }
            this.sendChatHistory(self.chatHistory);

           }
         });
       }



//to add a member
  this.addMember=function(team){
    //alert("in sending mail");
//send a mail to the member with the entereed email
    var postData = {
      email: this.addMemberEmail,
      message: 'You have been requested to join '+team.name+'! '
      +'Please Click on the following link to join 127.0.0.1:3000/signup/'+team._id+'/'+this.currentUser.organisation._id+"/"+this.currentUser.organisation.name+"/"+this.addMemberEmail
    };
    console.log(postData);
    this.$http.post('/email', postData)
    .success(function(data) {
      // Show success message
      //alert("you have sent a mail to a new member");
      console.log('mail sent successfully');
    })
    .error(function(data) {
      // Show error message
      console.log(' XXX Error: mail not sent! ');
    });
  }

  //Allow deletion of a Channel.
    this.allowChannelDeletion = function(cName) {
      if(cName == 'general' || cName == 'wall')
        return false;

      return true;
    }

    //Delete Channel
    this.deleteChannel = function(cName, cId) {
      if(this.allowChannelDeletion(cName) == false)
        return false;

      if(confirm(" Confirm Delete Channel '" + cName + "' ?") == false)
        return false;

      console.log("Deleting Channel : '" + cName + "', " + cId);

      this.$http.post('/api/channels/deleteChannel', { channelId: cId, teamId: this.currentTeam._id})
          .success(function(data) {
            this.$state.go('teamDashBoard');
            console.log('Channel Successfully Deleted.');
          })
          .error(function(err) {
            console.error(err);
          });

      return true;
    }


    //Allow Deletion of a Member
    this.allowMemberDeletion = function(mName) {
        if(mName == this.currentUser.name
            || this.currentChannel.name == 'general' || this.currentChannel.name == 'wall')
          return false;

        return true;
      }

      //Delete Member from Current Channel
      this.deleteMemberFromChannel = function(mName, mId) {
        if(this.allowMemberDeletion(mName) == false)
          return false;

        if(confirm(" Confirm Delete Member '" + mName + "' from '" + this.currentChannel.name + "' ?") == false)
          return false;
        var cId = this.currentChannel._id;

        console.log("Deleting Member : '" + mName + "', " + mId + " from '" + this.currentChannel.name + "'.");

        this.$http.post('/api/users/deleteMemberFromChannel', {memberId: mId, channelId: cId})
            .success(function(data) {
              self.$state.go('teamDashBoard');
              console.log('Member Successfully Deleted.');
            })
            .error(function(err) {
              console.error(err);
            });

        return true;
      }

}




//}
export default angular.module('yoCollabaFinalApp.teamDashBoard', [])
.controller('TeamDashBoardController', teamDashBoardController)
.name;
