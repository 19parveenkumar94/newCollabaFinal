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
    }

  });
}
