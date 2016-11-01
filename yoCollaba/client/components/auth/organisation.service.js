'use strict';

export function OrganisationResource($resource) {
  'ngInject';

  return $resource('/api/organisations/:id/:controller', {
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
    },

    accept: {
    method: 'PUT',
    params: {
      controller: 'accept'
    }
  },
  find: {
    method: 'POST',
    params: {
      controller: 'findOrg'
    }
  }
  ,updateTeam: {
      method: 'POST',
      params: {
        controller: 'updateTeam'
      }
    }
    ,addUser: {
        method: 'POST',
        params: {
          controller: 'addUser'
        }
      }
      ,domainCheck: {
          method: 'POST',
          params: {
            controller: 'domainCheck'
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
