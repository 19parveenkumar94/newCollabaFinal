'use strict';

export default class LoginController {
  user = {
    name: '',
    email: '',
    password: ''
  };
  errors = {
    login: undefined
  };
  submitted = false;


  /*@ngInject*/
  constructor(Auth, $state) {
    this.Auth = Auth;
    this.$state = $state;
  }

  login(form) {
    this.submitted = true;

    if(form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
        .then(() => {
          // Logged in, redirect to home
          //Check if user is Admin 
          if(this.Auth.isAdminSync()) {
            this.$state.go('admin');
          }
          else if(this.Auth.getCurrentUserSync().role == 'organization') {
            if(this.Auth.getCurrentUserSync().status == 'pending') {
              alert('Your status is Pending.');
              
            }
          }
          this.$state.go('main');
        })
        .catch(err => {
          this.errors.login = err.message;
        });
    }
  }
}
