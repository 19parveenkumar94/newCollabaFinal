'use strict';
// @flow

import angular from 'angular';


type User = {
 name: string;
 email: string;
 password: string;
};

export default class SignupController {
 user: User = {
   name: '',
   email: '',
   password: ''
 };
 errors = {};
 found=0;
 submitted = false;
 registered = false;
 Auth;
 $state;

 /*@ngInject*/
 constructor(Auth, $state, $stateParams) {
   this.Auth = Auth;
   this.$state = $state;
   this.$stateParams = $stateParams;
   this.user.orgName = $stateParams.orgName;
   this.user.teamId = $stateParams.teamId;
   this.user.email = $stateParams.email;
  this.checkExisting();
   ////alert($stateParams.teamId);

   ////alert($stateParams.orgName);
 }

 //Check if User is already registered(already Existing).
 checkExisting() {
   var email = this.user.email;
   var teamId = this.user.teamId;

   console.log('Inside checkExisting : ' + email);

   this.Auth.checkExisting(email, teamId)
     .then((user) => {
       if(user) {
         console.log(user);
         //Do some work in Auth.service' function
         console.log('User already registered. Redirecting to Login.');
         this.$state.go('login');
       }
     })
 }



 checkDomainOrg(){
   //alert(this.user.email.split('@')[1]);
   this.Auth.checkDomainOrg({domain:this.user.email.split('@')[1],orgname:this.user.orgName})
             .then((data)=>{
               if(data=="found")
               this.found=0;
               else if(data=="notfound")
               this.found=1;
               console.log(data);
             })
 }




 register(form) {
   this.submitted = true;
    if(form.$invalid) {
      //alert('Please fill the form Correctly.');
      return false;
    }

    // if(this.found == 1)
    //   //alert("domain name or organisation name is incorrect or doesnot Exists");
     ////alert(this.$stateParams.orgId+" "+(!this.$stateParams.orgId));
     if(!this.$stateParams.orgId){
       //alert("in org nt defined");
       var orgId;
       this.Auth.findOrgbyName({name:this.user.orgName})
       .then((org)=>{
         console.log(org);
         this.Auth.addUser({
           name: this.user.name,
           email: this.user.email,
           password: this.user.password,
           role: 'user',
           organisation: org._id,
           channels:org.channels
         }).then((data)=>{

           console.log("added user in user schema");
           ////alert(org.channels[0]);
           this.Auth.addUserInChannel({userId:data._id,channelId:org.channels[0]})
               .then((data)=>{
                 //alert("channle added in user");
                 console.log(data);

               });
           this.Auth.addUserInOrg({orgId:org._id, userId:data._id})
                     .then((data)=>{
                       //alert("added in org");
                       this.$state.go('login');
                     });


         })
       });

     }
     else {

       //alert("in this");
       //create a user with given orgid and team id
       this.Auth.findOrgbyName({name:this.user.orgName})
       .then((org)=>{
        this.Auth.addUser({
         name: this.user.name,
         email: this.user.email,
         password: this.user.password,
        //change role to user
         role: 'user',
         organisation: this.$stateParams.orgId,
         teams: [this.$stateParams.teamId],
         channels:org.channels
       })
         .then((data) => {
           // Account created, redirect to home
           ////alert("populate");
           //populate the data of the user in organisation and team
           this.Auth.addUserInChannel({userId:data._id,channelId:org.channels[0]})
               .then((data)=>{
                 //alert("user added in channel");
                 console.log(data);

               });
           this.Auth.populateUserId(this.$stateParams.orgId,this.$stateParams.teamId, data._id);
           this.$state.go('login');
         })
         .catch(err => {
           err = err.data;
           this.errors = {};
           // Update validity of form fields that match the mongoose errors
           angular.forEach(err.errors, (error, field) => {
             form[field].$setValidity('mongoose', false);
             this.errors[field] = error.message;
           });
         });
       });
       }


 }

 }
