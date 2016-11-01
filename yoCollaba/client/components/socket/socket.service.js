'use strict';

import * as _ from 'lodash';
import angular from 'angular';
import io from 'socket.io-client';

function Socket(socketFactory) {
  'ngInject';
  // socket.io now auto-configures its connection when we ommit a connection url

  var ioSocket = io('', {
    // Send auth token on connection, you will need to DI the Auth service above
    // 'query': 'token=' + Auth.getToken()
    path: '/socket.io-client'
  });

  var socket = socketFactory({
    ioSocket
  });

  return {
    socket,
    //Send room channelId to join
    room(channelId){
      socket.emit('room',channelId);
    },
    //Send Message to channel on
    sendMessage(data){
      socket.emit('channel-message',data);
    },
    //Update the chats from particular channel
    syncUpdatesChats(cb){
      socket.on('channel-message',function(data){
        console.log("Get info:"+data);
        cb(data);
      });
    },
      /**
      * Register listeners to sync an array with updates on a model
      *
      * Takes the array we want to sync, the model name that socket updates are sent from,
      * and an optional callback function after new items are updated.
      *
      * @param {String} modelName
      * @param {Array} array
      * @param {Function} cb
      */
      syncUpdates(modelName, array, cb) {
        cb = cb || angular.noop;

        /**
        * Syncs item creation/updates on 'model:save'
        */
        socket.on(`${modelName}:save`, function(item) {
          var oldItem = _.find(array, {
            _id: item._id
          });
          var index = array.indexOf(oldItem);
          var event = 'created';

          // replace oldItem if it exists
          // otherwise just add item to the collection
          if(oldItem) {
            array.splice(index, 1, item);
            event = 'updated';
          } else {
            array.push(item);
          }

          cb(event, item, array);
        });

        /**
        * Syncs removed items on 'model:remove'
        */
        socket.on(`${modelName}:remove`, function(item) {
          var event = 'deleted';
          _.remove(array, {
            _id: item._id
          });
          cb(event, item, array);
        });
      },

      /**
      * Removes listeners for a models updates on the socket
      *
      * @param modelName
      */
      unsyncUpdates(modelName) {
        socket.removeAllListeners(`${modelName}:save`);
        socket.removeAllListeners(`${modelName}:remove`);
      }
    };
  }

  export default angular.module('yoCollabaFinalApp.socket', [])
  .factory('socket', Socket)
  .name;
