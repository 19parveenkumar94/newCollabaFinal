import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
  $http;
  socket;
  awesomeThings = [];
  newThing = '';

  /*@ngInject*/
  constructor($http, $scope, socket) {
    this.$http = $http;
    this.socket = socket;
    this.showSearch = false;
    this.notFound=true;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  $onInit() {
    this.$http.get('/api/things')
      .then(response => {
        this.awesomeThings = response.data;
        this.socket.syncUpdates('thing', this.awesomeThings);
      });
  }

  addThing() {
    if(this.newThing) {
      this.$http.post('/api/things', {
        name: this.newThing
      });
      this.newThing = '';
    }
  }



  check(){
    var self = this;
    console.log(this.organisation);
    this.$http.post('/api/organisations/findOrgbyName', {name:this.organisation})
     .success(function(data) {
       console.log(data);
        if(data.name!=undefined)
          {

            self.showSearch=true;

          }else{
            self.notFound=true;
            self.showSearch=false;
          }

     })
     .error(function(data) {
       // Show error message
         console.log(' Error ');
     });

  }



  deleteThing(thing) {
    this.$http.delete(`/api/things/${thing._id}`);
  }
}

export default angular.module('yoCollabaFinalApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
