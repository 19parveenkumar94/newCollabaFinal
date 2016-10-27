'use strict';

export function UserResource($resource) {
  'ngInject';

  return $resource('/api/users/:id/:controller', {
    id: '@_id'
  }, {
    changePassword: {
      method: 'PUT',
      params: {
        controller: 'password'
      }
    },
    get: {
      method: 'GET',
      params: {
        id: 'me'
      }
    }
    ,updateTeam: {
        method: 'POST',
        params: {
          controller: 'updateTeam'
        }
      }
      ,domainCheck: {
          method: 'POST',
          params: {
            controller: 'domainCheck'
          }
        }

    ,

    add: {
      method: 'POST',
      params: {
        controller: 'add'
      }
    }
    ,
    addChannel: {
      method: 'POST',
      params: {
        controller: 'addChannel'
      }
    },
    findOrgbyName:{
      method: 'POST',
      params: {
        controller: 'findOrgbyName'
      }
    }
    ,
    findMember: {
      method: 'POST',
      params: {
        controller: 'findMember'
      }
    }
    ,
    addTeamInUser1:{
      method: 'POST',
      params:{
        controller: 'addTeamInUser2'
      }
    },
    addUser: {
      method: 'POST',
      params: {
        controller: 'addUser'
      }
    }

    ,addUserInOrg: {
        method: 'POST',
        params: {
          controller: 'addUserInOrg'
        }
      }


  });
}
