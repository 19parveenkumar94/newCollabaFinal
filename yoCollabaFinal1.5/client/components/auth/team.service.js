'use strict';

export function TeamResource($resource) {
  'ngInject';

  return $resource('/api/teams/:id/:controller', {
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
    addUser: {
      method: 'POST',
      params: {
        controller: 'addUser'
      }
    }
    ,
    channelUpdate: {
      method: 'POST',
      params: {
        controller: 'channelUpdate'
      }
    }

  });
}
