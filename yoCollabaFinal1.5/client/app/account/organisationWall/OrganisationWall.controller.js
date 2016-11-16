'use strict';
const angular = require('angular');
import emojione from 'emojione/lib/js/emojione.min';
/*@ngInject*/
export function OrganisationWallController(Auth,$state,$http,socket,Upload,$timeout,$sce,MessageService) {
  this.message = 'Hello';
  this.Auth=Auth;
  this.MessageService=MessageService
  this.$state=$state;
  this.$http=$http;
  this.trustAsHtml=$sce.trustAsHtml;
  this.socket=socket;
  this.Upload = Upload;
  this.title = '';
  this.$timeout = $timeout;
  this.message = '';
  this.teams = [];
  this.channel = '';
  this.channelId = '';
  this.comment='';
  this.chatHistory = [];
  this.emoji="";
  var self = this;
this.currentUser=this.Auth.getCurrentUserSync();
this.convert=function(message){

  //alert(message);
  return emojione.shortnameToImage(message);
}
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
          this.channelIndex = i;
          //this.chatHistory=response.data.channels[i].history;
          break;
        }
      }
      //Connect to that room for chatting
      this.socket.room(this.channelId);
      //Set history in the chatHistory array coming from the api
      if (response.data.channels[this.channelIndex].history.length != 0) {
        for (var i = 0; i < response.data.channels[this.channelIndex].history.length; i++) {
          var extension = response.data.channels[this.channelIndex].history[i].message.split('.');
          if(extension.length>1&&extension.length<3)
          {
            //if the chat element is file it's href needs to be from client folder
            var messageUrl = response.data.channels[this.channelIndex].history[i].message.split('\\');
            messageUrl.splice(0,1);
            messageUrl= messageUrl.join("/");
            self.chatHistory.unshift({
              sender: response.data.channels[this.channelIndex].history[i].user,
              message: messageUrl,
              title: response.data.channels[this.channelIndex].history[i].title,
              type: response.data.channels[this.channelIndex].history[i].messageType,
              comments:response.data.channels[this.channelIndex].history[i].comments,
              ext:extension[extension.length-1]
            });
          }
          else {
            //text chats
            self.chatHistory.unshift({
              sender: response.data.channels[this.channelIndex].history[i].user,
              message: this.convert(response.data.channels[this.channelIndex].history[i].message),
              title: response.data.channels[this.channelIndex].history[i].title,
              video: response.data.channels[this.channelIndex].history[i].video,
              thumbNail: response.data.channels[this.channelIndex].history[i].thumbNail,
              type: response.data.channels[this.channelIndex].history[i].messageType,
              comments:response.data.channels[this.channelIndex].history[i].comments,
              ext:extension[extension.length-1]
            });
          }
        }
      }
      console.log(self.chatHistory);
      console.log("InitMethod channel: " + this.channelId);
    });
    //Updating chat messages when new message is set on the room
  this.socket.syncUpdatesChats(data => {
    var extension = data.message.split('.');
    console.log(JSON.stringify(data));
    if(extension.length>1&&extension.length<3)
    {

      //if the chat element is file it's href needs to be from client folder
      var messageUrl = data.message.split('\\');
      messageUrl.splice(0,1);
      messageUrl= messageUrl.join("/");
      self.chatHistory.unshift({
        sender: data.sender,
        message: messageUrl,
        type: data.type,
        title: data.title,
        ext:extension[extension.length-1]
      });
    }
    else {
      //text chats
      self.chatHistory.unshift({
        sender: data.sender,
        message: this.convert(data.message),
        type: data.type,
        title: data.title,
        video:data.video,
        thumbNail:data.thumbNail,
        comments:[],
        ext:extension[extension.length-1]
      });
    }
  });
  });
this.deletePost = function(post){
  this.chatHistory.splice(this.chatHistory.indexOf(post), 1);
  console.log(post);
  this.$http.post('/api/users/deleteMessage/' + this.channelId, post)
  .then(response => {
    console.log(response.data);
  });
}
this.editPost = function(post,index){
this.chatHistory[index].hide=!this.chatHistory[index].hide;
}
this.editMessage = function(post){
  this.message=this.edit;
  this.deletePost(post);
  this.sendMessage();
}

this.addComment=function(post,index){
  if(this.comment){
  post.comment=this.comment;
  ////alert(post.comment);
  this.chatHistory[index].comments.push({user:this.currentUser.name,comment:this.comment});
  this.Auth.addComment({channelId:this.channelId,post:post})
            .then(data=>{
              ////alert("comment added");
            })
}
}


  this.sendMessage=function() {
    console.log(this.message);
    //If the input field is not empty
    if (this.message) {
      //Emit the socket with senderName, message and channelId
      this.MessageService.sendMessage(this.currentUser.name,this.message,this.title,this.channelId);
      //Empty the input field
      this.message = '';
      this.title = "";
      //this.title="";
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
              //alert(this.channelId);
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
