'use strict';

export function ChannelResource($resource) {
  'ngInject';

  return $resource('/api/channels/:id/:controller', {
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
    ,
    addUser: {
      method: 'POST',
      params: {
        id: 'addUser'
      }
    }
    ,
    addUserInChannel: {
      method: 'POST',
      params: {
        id: 'addUserInChannel'
      }
    }

    ,
    addMembersInChannel: {
      method: 'POST',
      params: {
        id: 'addMembersInChannel'
      }
    }
});
}
