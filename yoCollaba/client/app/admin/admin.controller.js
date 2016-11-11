'use strict';

export default class AdminController {
  users: Object[];
  organisations: Object[];
  /*@ngInject*/
  constructor(User, Organisation, Auth,$http) {
    // Use the User $resource to fetch all users
    this.$http=$http;
    this.Auth = Auth;
    this.users = User.query();
    this.organisations = Organisation.query();
    console.log(this.organisations);
}

  /*delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }*/

  accept(organisation){


    var postData = {
      email: organisation.email,
      name: organisation.name,
      message: 'Your request to register your organisation has been accepted'
      };

    console.log(organisation);
    var a = {status : 'permanent'}

    //this.Auth.acceptOrganisation(organisation);
    this.$http.put('/api/organisations/'+organisation._id,a).success(function(response){
      //  console.log(response);
        this.$http.post()
        console.log('approvalStatus set to true in db');
      });


      this.$http.post('/email', postData)
       .success(function(data) {
         // Show success message
         console.log('mail sent successfully');
       })
       .error(function(data) {
         // Show error message
           console.log(' XXX Error: mail not sent! ');
       });

       this.organisations.splice(this.organisations.indexOf(organisation), 1);

  }

  reject(organisation){
    this.organisations.splice(this.organisations.indexOf(organisation), 1);
  }

}
