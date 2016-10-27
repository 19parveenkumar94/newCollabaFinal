'use strict';
// @flow

class _User {
  _id: string = '';
  name: string = '';
  email: string = '';
  role: string = '';
  $promise = undefined;
}

export function AuthService($location, $http, $cookies, $q, appConfig, Util, User, Team, Organisation, Channel) {
  'ngInject';

  var safeCb = Util.safeCb;
  var currentUser: _User = new _User();
  var userRoles = appConfig.userRoles || [];
  /**
   * Check if userRole is >= role
   * @param {String} userRole - role of current user
   * @param {String} role - role to check against
   */
  var hasRole = function(userRole, role) {
    return userRoles.indexOf(userRole) >= userRoles.indexOf(role);
  };

  if($cookies.get('token') && $location.path() !== '/logout') {
    currentUser = User.get();
  }

  var Auth = {

    register(organisation){
      console.log(organisation);
      Organisation.save(organisation);
    },

    acceptOrganisation(organisation){
      console.log(organisation);
      Organisation.accept(organisation);
    },

//check if organiation is logged in or not
    isOrganisation(){
          console.log($cookies.get('organisation'));
        if($cookies.get('organisation')!=undefined){
            return true;
        }else{
          return false;
        }

        },
//get name of current organisation logged in
        getCurrentOrganisation(){
        if($cookies.get('organistion')!=undefined){
        return null
      }else{
            return $cookies.get('organisation');
        }
        },


    /**
     * Authenticate user and save token
     *
     * @param  {Object}   user     - login info
     * @param  {Function} callback - function(error, user)
     * @return {Promise}
     */
    login({

      email,
      password
    }, callback ? : Function) {
      return $http.post('/auth/local', {
        email,
        password
      })
        .then(res => {
          console.log(res.data);
          $cookies.put('token', res.data.token);
          currentUser = User.get();
          return currentUser.$promise;
        })
        .then(user => {
          safeCb(callback)(null, user);
          return user;
        })
        .catch(err => {
          Auth.logout();
          safeCb(callback)(err.data);
          return $q.reject(err.data);
        });
    },


    //login for the organisation
    loginOrganisation2({
      email,
      password
    },callback ? : Function){
      return $http.post('/auth/org',{
        email,
        password
      })
      .then(res => {
        //putting the token genrerated in the cookies
        console.log(res.data);
        $cookies.put('token',res.data.token);
        $cookies.put('organisation', res.data.organisation.name);
        $cookies.put('organisationId', res.data.organisation._id);

        return res.data.organisation;
      })
      .catch(err => {
        alert("error");
        Auth.logoutOrganisation();
        safeCb(callback)(err.data);
        return $q.reject(err.data);
      });
    },
    loginOrganisation(org){
      console.log("here finding");
      return Organisation.find(org)
            .$promise.then((data) =>{
              $cookies.put('organisation', data.name);
              $cookies.put('organisationId', data._id);

              console.log("inside Found");
              console.log(data);
              return data;
            });


    },
    /**
     * Delete access token and user info
     */
     logoutOrganisation(){
       $cookies.remove('token');
       $cookies.remove('organisationId');

     },
    logout() {
      $cookies.remove('token');
      $cookies.remove('token');
    $cookies.remove('organisation');
    $cookies.remove('organisationId');
      currentUser = new _User();
    },

    /**
     * Create a new user
     *
     * @param  {Object}   user     - user info
     * @param  {Function} callback - function(error, user)
     * @return {Promise}
     */

     //to crate the user in database given a data
     addUser(data){

        return User.add(data)
                    .$promise.then((data) =>{
                      console.log(data);
                      return data;
                    })


     },

     //check the domain of the organisation
     checkDomainOrg(data){
       alert(data);
       return User.domainCheck(data)
                          .$promise.then((data)=>{
                            console.log(data);
                            if(data.result=="notfound"){
                              alert("notfound")
                              return "notfound";
                              }
                              else if(data.result=="found"){
                                alert("found");
                                return "found";
                              }
                          })
                          // .then(()=>{
                          //   alert("notfound");
                          //   return "notfound";
                          // })
     },

     addChannelInUser(data){
       User.addChannel(data)
            .$promise.then((data)=>{
              console.log(data);
              return data;
            })
     },
     InUser(email,teamId){
       alert(email+" "+teamId);
       return User.addTeamInUser1({email:email,team:teamId})
                  .$promise.then((data)=>{
                    console.log(data);
                    return data;
                  })
     },


     addUserInTeam(data){
       return Team.addUser(data)
                  .$promise.then((data)=>{
                    console.log(data);
                    return data;
                  })

     }
     ,

         addChannelInTeam(data){
           return Team.channelUpdate(data)
                       .$promise.then((data) => {
                         console.log("channel updated in team");
                         return data;
                       })

         },

          //adding a user in channel given channel id
          addUserInChannel(data){
          return  Channel.addUserInChannel(data)
                   .$promise.then((data)=>{
                     console.log("added user in channel");
                     return data;
                   });
          }
     ,

     addMembersInChannel(data){
       Channel.addMembersInChannel(data)
              .$promise.then((data)=>{
                console.log("members added in channel");
                return data;
              })
     }
,


     addTeamInOrg(orgId,teamId){

       return User.updateTeam({'organisationId':orgId,'teamId':teamId})
                          .$promise.then((data)=>{
                            console.log("===updateTeam==="+JSON.stringify(data));
                            return data;
                          });

     },

     //adding a user in channel given channel id
    //  addUserInChannel(data){
    //    Channel.addUser(data)
    //           .$promise.then((data)=>{
    //             console.log("added user in channel");
    //             return data;
    //           });
    //  },

//adding a user in organisation given org name
     addUserInOrg(data){
       return User.addUserInOrg(data)
                    .$promise.then((data)=>{
                      console.log("user added on org");
                      return data;
                    });
     },

     populateUserId(orgId, teamId, userId){
       console.log("Inside Populate User Id: "+orgId);
        User.addUser({'organisationId':orgId,'userId':userId})
                    .$promise.then((data)=>{
                      console.log("user added in organisation");
                      Channel.addUser({'teamId':teamId,'userId':userId})
                              .$promise.then((data) => {
                                console.log('user added in channel');
                                User.addChannel({'channelId':data._id,'userId':userId})
                                    .$promise.then((data) => {
                                      console.log('channel added in user');
                                      return data;
                                    })
                              })
                      Team.addUser({'teamId':teamId,'userId':userId})
                            .$promise.then((data)=>{
                              console.log('user added in team');
                              return data;
                            })
                    })

     },
findOrgbyName(data){
  return User.findOrgbyName(data)
      .$promise.then((data)=>{
        console.log(data);
        return data;
      })
},
     addChannelInUser(data){
       User.addChannel(data)
            .$promise.then((data)=>{
              console.log(data);
              return data;
            })
     },
//Function
      findMember(email,orgId){
          return $http.get('/api/organisations/'+orgId)
          .success(function(data) {
            // console.log("inside success");
            // var x=0;
            // console.log(data);
            // for(var i=0;i<data.members.length;i++)
            // {
            //   if(data.members[i].email==email)
            //   {
            //     console.log(data.members[i].email+" "+email);
            //     console.log("found member");
            //     x=1;
            //     return data.members[i];
            // }
            //}
          return data;

          })
          .error(function(data) {
            // Show error message
              console.log(' Error ');
          });

      },

    createUser(user, callback ? : Function) {
      return User.save(user, function(data) {
        $cookies.put('token', data.token);
        currentUser = User.get();
        return safeCb(callback)(null, user);
      }, function(err) {
        Auth.logout();
        return safeCb(callback)(err);
      })
        .$promise;
    },
    addTeam(data){
       //alert("in auth service");
      return Team.save({name:data.name,teamLeadEmail:data.email,organisation:data.Organisation})
                  .$promise.then((data) =>{
                    console.log("team------"+JSON.stringify(data));
                    console.log("saved in team databases");
                    return data._id;
                  });
    },
    addChannelInTeam(data){
      return Team.channelUpdate(data)
                  .$promise.then((data) => {
                    console.log("channel updated in team");
                    return data;
                  })

    },
    addChannelInOrg(data){
      alert("inside auth service");
      return User.addChannel(data)
                .$promise.then((data)=>{
                  console.log("channel in org");
                  return data;
                });
    },
    createChannel(data){
      console.log("inside createChannel");
      return Channel.save({name:'general',team:data})
                    .$promise.then((data)=>{
                      console.log("channel in db");
                      return data;
                    })
    },
    /**
     * Change password
     *
     * @param  {String}   oldPassword
     * @param  {String}   newPassword
     * @param  {Function} callback    - function(error, user)
     * @return {Promise}
     */
    changePassword(oldPassword, newPassword, callback ? : Function) {
      return User.changePassword({
        id: currentUser._id
      }, {
        oldPassword,
        newPassword
      }, function() {
        return safeCb(callback)(null);
      }, function(err) {
        return safeCb(callback)(err);
      })
        .$promise;
    },

    /**
     * Gets all available info on a user
     *
     * @param  {Function} [callback] - function(user)
     * @return {Promise}
     */
    getCurrentUser(callback ? : Function) {
      var value = _.get(currentUser, '$promise') ? currentUser.$promise : currentUser;

      return $q.when(value)
        .then(user => {
          safeCb(callback)(user);
          return user;
        }, () => {
          safeCb(callback)({});
          return {};
        });
    },

    /**
     * Gets all available info on a user
     *
     * @return {Object}
     */
    getCurrentUserSync() {
      return currentUser;
    },

    /**
     * Check if a user is logged in
     *
     * @param  {Function} [callback] - function(is)
     * @return {Promise}
     */
    isLoggedIn(callback ? : Function) {
      return Auth.getCurrentUser(undefined)
        .then(user => {
          let is = _.get(user, 'role');

          safeCb(callback)(is);
          return is;
        });
    },

    /**
     * Check if a user is logged in
     *
     * @return {Bool}
     */
    isLoggedInSync() {
      return !!_.get(currentUser, 'role');
    },

    /**
     * Check if a user has a specified role or higher
     *
     * @param  {String}     role     - the role to check against
     * @param  {Function} [callback] - function(has)
     * @return {Promise}
     */
    hasRole(role, callback ? : Function) {
      return Auth.getCurrentUser(undefined)
        .then(user => {
          let has = hasRole(_.get(user, 'role'), role);

          safeCb(callback)(has);
          return has;
        });
    },

    /**
     * Check if a user has a specified role or higher
     *
     * @param  {String} role - the role to check against
     * @return {Bool}
     */
    hasRoleSync(role) {
      return hasRole(_.get(currentUser, 'role'), role);
    },

    /**
     * Check if a user is an admin
     *   (synchronous|asynchronous)
     *
     * @param  {Function|*} callback - optional, function(is)
     * @return {Bool|Promise}
     */
    isAdmin() {
      return Auth.hasRole.apply(Auth, [].concat.apply(['admin'], arguments));
    },

    /**
     * Check if a user is an admin
     *
     * @return {Bool}
     */
    isAdminSync() {
      return Auth.hasRoleSync('admin');
    },

    /**
     * Get auth token
     *
     * @return {String} - a token string used for authenticating
     */
    getToken() {
      return $cookies.get('token');
    }
    ,
    checkExisting(email, teamId) {
      console.log('checkExisting in Auth.service');
      return $http.post('/api/users/checkExisting', {email: email})
        .then(function(res) {
          //console.log(res.data);
            if(res.data) {
              /* add user in team,  add team in user,
              add user in general channel of team,  add general channel in user.
              */
              var userId = res.data._id;
              Channel.addUser({'teamId':teamId, 'userId':userId})
                  .$promise.then((data) => {
                      console.log('user added in channel');
                      User.addChannel({'channelId':data._id,'userId':userId})
                          .$promise.then((data) => {
                              console.log('channel added in user');
                              return data;
                          });
                  });
              Team.addUser({'teamId':teamId, 'userId':userId})
                  .$promise.then( (data) => {
                      console.log('user added in team');
                      return data;
                  });
              User.addTeamInUser1({email:email, team:teamId})
                  .$promise.then((data)=>{
                    console.log(data);
                    return data;
                  });
              return res.data;
            }
          },
          function(err) {
          if(err) {
            console.error(err);
            return err;//should I return error or not.
          }
        });
    }
  };


  return Auth;
}
