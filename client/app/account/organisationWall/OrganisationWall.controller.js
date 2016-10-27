'use strict';
const angular = require('angular');

/*@ngInject*/
export function OrganisationWallController(Auth,$state,$http,socket,Upload,$timeout) {
  this.message = 'Hello';
  this.Auth=Auth;
  this.$state=$state;
  this.$http=$http;
  this.socket=socket;
  this.Upload = Upload;
  this.$timeout = $timeout;
  this.message = '';
  this.teams = [];
  this.channel = '';
  this.channelId = '';
  this.chatHistory = [];
  var self = this;

this.currentUser=this.Auth.getCurrentUserSync();

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

      for (var i = 0; i < response.data.channels.length; i++) {
        if(response.data.channels[i].name=="wall"){
          this.channelId=response.data.channels[i]._id;
          //this.chatHistory=response.data.channels[i].history;
          break;
        }
      }


      //Connect to that room for chatting
      this.socket.room(this.channelId);
      //Set history in the chatHistory array coming from the api
      if (this.channelId.history.length != 0) {
        for (var i = 0; i < this.channelId.history.length; i++) {
          var extension = this.channelId.history[i].message.split('.');
          if(extension.length>1)
          {
            //if the chat element is file it's href needs to be from client folder
            var messageUrl = this.channelId.history[i].message.split('\\');
            messageUrl.splice(0,1);
            messageUrl= messageUrl.join("/");
            self.chatHistory.unshift({
              sender: this.channelId.history[i].user,
              message: messageUrl,
              type: this.channelId.history[i].messageType,
              ext:extension[extension.length-1]
            });
          }
          else {
            //text chats
            self.chatHistory.unshift({
              sender: this.channelId.history[i].user,
              message: this.channelId.history[i].message,
              type: this.channelId.history[i].messageType,
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
    if(extension.length>1)
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
      self.chatHistory.unshift({
        sender: data.sender,
        message: data.message,
        type: data.type,
        ext:extension[extension.length-1]
      });
    }
  });
  });


  this.sendMessage=function() {
    alert(this.message);
    alert(JSON.stringify(this.channelId));
    //If the input field is not empty
    if (this.message) {
      //Emit the socket with senderName, message and channelId
      this.socket.sendMessage({
        'sender': this.userName,
        'message': this.message,
        'type':'text',
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
              alert(this.channelId);
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


}

export default angular.module('collabaApp.OrganisationWall', [])
  .controller('OrganisationWallController', OrganisationWallController)
  .name;
