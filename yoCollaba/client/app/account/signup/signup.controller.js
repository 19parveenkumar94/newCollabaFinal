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
 Auth;
 $state;

 /*@ngInject*/
 constructor(Auth, $state,$stateParams) {
   this.Auth = Auth;
   this.$state = $state;
   this.$stateParams=$stateParams;
   this.user.orgName=$stateParams.orgName;
   this.user.teamId=$stateParams.teamId;
   //alert($stateParams.teamId);

   //alert($stateParams.orgName);
 }



 checkDomainOrg(){
   alert(this.user.email.split('@')[1]);
   this.Auth.checkDomainOrg(this.user.email.split('@')[1])
             .then((data)=>{
               this.found=1;
               console.log(data);
             })
 }


 register() {
   //this.submitted = true;
//

     //alert(this.$stateParams.orgId+" "+(!this.$stateParams.orgId));
     if(!this.$stateParams.orgId){
       //alert("in org nt defined");
       this.Auth.addUser({
         name: this.user.name,
         email: this.user.email,
         password: this.user.password,
         role: 'teamMember',
         organisation: this.user.orgName
       }).then((data)=>{

         console.log("added user in user schema");
         this.Auth.addUserInOrg({orgName:this.user.orgName,userId:data._id})
                   .then((data)=>{
                     console.log("added in org");
                   })
       })
     }
     else {


       //create a user with given orgid and team id
        this.Auth.addUser({
         name: this.user.name,
         email: this.user.email,
         password: this.user.password,
         role: this.$stateParams.role,
         organisation: this.$stateParams.orgId,
         teams: [this.$stateParams.teamId]
       })
         .then((data) => {
           // Account created, redirect to home
           //alert("populate");
           //populate the data of the user in organisation and team
           this.Auth.populateUserId(this.$stateParams.orgId,this.$stateParams.teamId,data._id);
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
       }


 }
}
