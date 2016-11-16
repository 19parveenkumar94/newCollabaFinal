'use strict';
// @flow

const ngFileUpload = require('ng-file-upload');


type User = {
  name: string;
  email: string;
};

export default class UserController {
  user1: User = {
    name: '',
    email: '',
  };

  Auth;
  $state;

  //var vm = this;

  /*@ngInject*/
  constructor(Auth, $state , Upload, $timeout, $http) {
    this.Auth = Auth;
    this.$state = $state;
    console.log("=========================USER DISPLAY======================");
    this.user = this.Auth.getCurrentUserSync();
    this.Upload = Upload;
    this.$timeout = $timeout;
    this.$http = $http;

    console.log(this.user);


    //displayProfile();
    //var user = this.currentUser;
  }


displayProfile(){
  console.log("=========================USER DISPLAY======================");
  this.user = this.Auth.getCurrentUserSync();
  //var user = this.currentUser;
}


uploadPic(file, errFiles) {
    console.log('upload file initiated');
    this.f = file;
    this.errFile = errFiles && errFiles[0];
    if (file) {
      file.upload = this.Upload.upload({
        'userId': this.user._id,
        'type': 'file',
        url: 'api/users/addProfilePic',
        file: file
      });
      file.upload.then(response => {
        this.$timeout(() => {
          this.showFileStatus=false;
          this.percent=0;
          file.result = response.data;
          console.log(response.data);
            //Emit the socket with senderName, fileName and channelId
/*
            this.socket.sendMessage({
              'sender': this.userName,
              'message': response.data.filePath,
              'type':'file',
              'room': this.channelId
            });
            */
            //Hit api to update chat history in the db
            console.log('before sending file message');
            this.$http.post('/api/users/saveProfilePic/', {
              data: {
                'userId': this.user._id,
                'message': response.data.filePath,
//                'type': 'file'
              }
            })
            .then(response => {
              //  this.user.
              this.user = this.Auth.getCurrentUserSync();

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
  }



// uploadPic(){
//   console.log("Upload Pic function");
//
// }
/*
  login(form) {
    this.submitted = true;

    if(form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
        .then(() => {
          // Logged in, redirect to home
          //check if admin
          if(this.Auth.isAdminSync()){
            this.$state.go('admin')
          }else if(this.Auth.getCurrentUserSync().role=='Organisation'){
          //if not admin, go to team dashboard
          this.$state.go('organisationDashBoard');
        }
        else{
          this.$state.go('teamDashBoard');
        }

        })
        .catch(err => {
          this.errors.login = err.message;
        });
    }
  }
  */
}
