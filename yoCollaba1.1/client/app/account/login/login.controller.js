'use strict';
// @flow

type User = {
  name: string;
  email: string;
  password: string;
};

export default class LoginController {
  user: User = {
    name: '',
    email: '',
    password: ''
  };
  errors = {
    login: undefined
  };
  submitted = false;
  Auth;
  $state;

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
          //check if admin
/*          alert(this.Auth.getCurrentUserSync().role)
*/          if(this.Auth.isAdminSync()){
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
}
