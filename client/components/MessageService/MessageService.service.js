'use strict';
const angular = require('angular');

function MessageService($http,socket,Upload,$q) {
  // AngularJS will instantiate a singleton by calling "new" on this function
  'ngInject';

  var Message = {
    sendMessage(userName,message,channelId){
      console.log('In message service 1');
      var url = message;
      var fullUrl=message;
      var video="";
      var thumbNail="";
      var media={};
      var urlRegex = /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/;
      if(urlRegex.test(url))
      {
        var deferred = $q.defer();
        url = url.replace(urlRegex, function(url) {
          console.log('In replace');
          $http.get("https://api.embedly.com/1/extract?url=" + url + "&key=e8580fd696c543e98bae8970a7370325")
          .then((data, status) => {
            //Scrapped message
            alert("in extract");
            $http.get("https://api.embedly.com/1/oembed?url=" + fullUrl +"&key=e8580fd696c543e98bae8970a7370325")
            .then((oembed,status)=>{
              alert("in oembed");
            console.log(oembed.data);
            // if(oembed.data.html)
            //   deferred.resolve('<a href="' + data.data.url + '" target="_blank">' + url + '<br/>' + '<blockquote><img src="' + data.data.favicon_url + '" height="30px"/>&nbsp; &nbsp;<span>' + data.data.provider_name + '</span><br/><br/><p>' + data.data.description + '</p></blockquote></a>'+oembed.data.html);
            //   else {
            //     deferred.resolve('<a href="' + data.data.url + '" target="_blank">' + url + '<br/>' + '<blockquote><img src="' + data.data.favicon_url + '" height="30px"/>&nbsp; &nbsp;<span>' + data.data.provider_name + '</span><br/><br/><p>' + data.data.description + '</p></blockquote></a>');
            //   }

            video=oembed.data.html;
            thumbNail=oembed.data.thumbnail_url;
             deferred.resolve({url:'<a href="' + fullUrl + '" target="_blank">' + fullUrl + '<br/>' + '<blockquote><img src="' + data.data.favicon_url + '" height="30px"/>&nbsp; &nbsp;<span>' + data.data.provider_name + '</span><br/><br/><p>' + data.data.description + '</p></blockquote></a>',video:oembed.data.html,thumbNail:oembed.data.thumbnail_url});

            })

            return '<a href="' + data.data.url + '" target="_blank">' + url + '<br/>' + '<blockquote><img src="' + data.data.favicon_url + '" height="30px"/>&nbsp; &nbsp;<span>' + data.data.provider_name + '</span><br/><br/><p>' + data.data.description + '</p></blockquote></a>';
          });
        });
        deferred.promise.then(function(data){
          console.log('url:'+data.url);
          console.log('user name:'+userName);
          console.log('channelId:'+channelId);
          //update in channel through socket.
          socket.sendMessage({
            'sender': userName,
            'message': data.url,
            'type':'text',
            'room': channelId,
            'video':data.video,
            'thumbNail':data.thumbNail

          });
          //send the message to the database
          $http.post('/api/users/saveMessage/' + channelId, {
            data: {
              'user': userName,
              'message': data.url,
              'type': 'text',
              'video':data.video,
              'thumbNail':data.thumbNail
            }
          })
          .then(response => {
            console.log(response.data);
          });
        });
      }
      else
      {
        //update in channel through socket.
        socket.sendMessage({
          'sender': userName,
          'message': url,
          'type':'text',
          'room': channelId
        });
        //send the message to the database
        $http.post('/api/users/saveMessage/' + channelId, {
          data: {
            'user': userName,
            'message': url,
            'type': 'text'
          }
        })
        .then(response => {
          console.log(response.data);
        });
      }
    }
  };
  return Message;
}

export default angular.module('yoCollabaFinalApp.MessageService', [])
.factory('MessageService', MessageService)
.name;
