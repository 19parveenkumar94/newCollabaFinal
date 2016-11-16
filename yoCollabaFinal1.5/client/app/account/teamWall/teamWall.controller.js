// 'use strict';
'use strict';


import emojione from 'emojione/lib/js/emojione.min';

export default class TeamWallController {
  message = '';
  Auth;
  $state;
  $http;
  socket;
  Upload;
  $timeout;
  title='';
  team={};
  channel={};
  channelId='';
  chatHistory=[];
  currentUser={};
  self;
//  self;
/*@ngInject*/
  constructor(Auth,$state,$scope,$http,socket,Upload,$timeout,$mdDialog,$rootScope,$sce,MessageService) {
    this.message = 'Hello';
    this.edit='';
    this.Auth=Auth;
    this.comment='';
    this.trustAsHtml=$sce.trustAsHtml;
    this.$state=$state;
    this.$http=$http;
    this.socket=socket;
    this.$mdDialog=$mdDialog;
    this.Upload = Upload;
    this.$timeout = $timeout;
    this.message = '';
    this.title = '';
    this.team = $rootScope.team;
    this.channel = $rootScope.channel;
    this.channelId = this.channel._id;
    this.chatHistory = [];
    this.currentUser=this.Auth.getCurrentUserSync();
    this.MessageService=MessageService;
    $scope.$on('$destroy', function() {
      alert($rootScope.channel._id);

          socket.roomLeave($rootScope.channel._id);

      });
  }


  // this.Auth=Auth;
  // this.$state=$state;
  // this.$http=$http;
  // this.socket=socket;
  // this.Upload = Upload;
  // this.$timeout = $timeout;
  // this.message = '';
  // this.title = '';
  // this.team = $rootScope.team;
  // this.channel = $rootScope.channel;
  // this.channelId = this.channel._id;
  // this.chatHistory = [];



  convert(message){

    ////alert(message);
    return emojione.shortnameToImage(message);
  }




  showVideo(event, video) {
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
        ////alert(this.video);
        this.closeDialog = function() {
          $mdDialog.hide();
        }
      }
    // .then(function () {});
  }

$onInit(){


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
      // //Get all teams for that user and set in select option
      // for (var i = 0; i < response.data.channels.length; i++) {
      //   if(response.data.channels[i].name=="wall"){
      //     this.channelId=response.data.channels[i]._id;
      //     this.channelIndex = i;
      //     //this.chatHistory=response.data.channels[i].history;
      //     break;
      //   }
      // }
      //Connect to that room for chatting
      console.log('room called()');
      this.socket.room(this.channelId);
      // console.log('Before online users()');
      //
      // console.log('After online users()');
      //Set history in the chatHistory array coming from the api
      if (this.channel.history.length != 0) {
        ////alert("in team wall chat histroy");
        for (var i = 0; i < this.channel.history.length; i++) {

          ////alert(this.channel.history[i].message);
          var extension = this.channel.history[i].message.split('.');
          if(extension.length>1&&extension.length<3)
          {
            //if the chat element is file it's href needs to be from client folder
            var messageUrl = this.channel.history[i].message.split('\\');
            messageUrl.splice(0,1);
            messageUrl= messageUrl.join("/");
            this.chatHistory.unshift({
              sender: this.channel.history[i].user,
              message: messageUrl,
              title: this.channel.history[i].title,
              type: this.channel.history[i].messageType,
              comments:this.channel.history[i].comments,
              ext:extension[extension.length-1]
            });
          }
          else {
            //text chats
            this.chatHistory.unshift({
              sender: this.channel.history[i].user,
              message: this.convert(this.channel.history[i].message),
              title: this.channel.history[i].title,
              video:this.channel.history[i].video,
              thumbNail:this.channel.history[i].thumbNail,
              type: this.channel.history[i].messageType,
              comments:this.channel.history[i].comments,
              ext:extension[extension.length-1]
            });
          }
        }
      }
      console.log(this.chatHistory);
      console.log("InitMethod channel: " + this.channel._id);
    });
    //Updating chat messages when new message is set on the room
  this.socket.syncUpdatesChats(data => {
    var extension = data.message.split('.');
    //alert(JSON.stringify(data));
    if(extension.length>1&&extension.length<3)
    {
      //if the chat element is file it's href needs to be from client folder
      //alert("in yellow")
      var messageUrl = data.message.split('\\');
      messageUrl.splice(0,1);
      messageUrl= messageUrl.join("/");
      this.chatHistory.unshift({
        sender: data.sender,
        message: messageUrl,
        type: data.type,
        title: data.title,
        ext:extension[extension.length-1]
      });
    }
    else {
      //text chats
      //alert("in blue");
      this.chatHistory.unshift({
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
    console.log(this.chatHistory);
  });
  });
}



deletePost(post){
  this.chatHistory.splice(this.chatHistory.indexOf(post), 1);
  console.log(post);
  this.$http.post('/api/users/deleteMessage/' + this.channelId, post)
  .then(response => {
    console.log(response.data);
  });
}
editPost(post,index){
this.chatHistory[index].hide=!this.chatHistory[index].hide;
}
editMessage(post){
  this.message=this.edit;
  this.deletePost(post);
  this.sendMessage();
}
addComment(post,index){
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
sendMessage(){
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
  // sendMessage() {
  //   ////alert(this.message);
  //   ////alert(JSON.stringify(this.channel._id));
  //   //If the input field is not empty
  //   if (this.message) {
  //     //Emit the socket with senderName, message and channelId
  //     this.socket.sendMessage({
  //       'sender': this.userName,
  //       'message': this.message,
  //       'title': this.title,
  //       'type':'text',
  //       'room': this.channel._id
  //     });
  //     //TODO- save the messages on server side
  //     //Hit api to update chat history in the db
  //     this.$http.post('/api/users/saveMessage/' + this.channel._id, {
  //       data: {
  //         'user': this.userName,
  //         'message': this.message,
  //         'type': 'text',
  //         'title': this.title
  //       }
  //     })
  //     .then(response => {
  //       console.log(response.data);
  //     });
  //     //Empty the input field
  //     this.message = '';
  //     this.title = '';
  //   }
  // }
  //to upload a file
  upload(file, errFiles) {
      console.log('upload file initiated');
      this.f = file;
      this.errFile = errFiles && errFiles[0];
      if (file) {
        file.upload = this.Upload.upload({
          'user': this.userName,
          'type': 'file',
          url: 'api/users/uploads',
          'title': this.title,
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
                'title': this.title,
                'room': this.channel._id
              });
              //Hit api to update chat history in the db
              console.log('before sending file message');
              ////alert(this.channelId);
              this.$http.post('/api/users/saveMessage/' + this.channel_id, {
                data: {
                  'user': this.userName,
                  'message': response.data.filePath,
                  'title': this.title,
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
