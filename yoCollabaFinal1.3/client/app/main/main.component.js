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
    this.notFound = true;
    this.orgList;

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

    // 
  }


  searchOrg(qry) {
    console.log(qry);
    var vm = this;
    var results;

    if(vm.orgList != undefined)
      return results = qry ? vm.orgList.filter(this.createFilterFor(qry)) : vm.orgList;


    return this.$http.get('/api/users/getOrgList')
      .then((res) => {
        console.log(res.data);
        vm.orgList = res.data;

        results = qry ? vm.orgList.filter(this.createFilterFor(qry)) : vm.orgList;
        return results;
      })
      .catch(function(err) {
        console.error(err);
      });
    
    
  }



  createFilterFor(qry) {
    var lowercaseQuery = angular.lowercase(qry);

    return function filterFn(org) {
      return (org.name.toLowerCase().indexOf(lowercaseQuery) === 0);
    }
  }


}

export default angular.module('yoCollabaFinalApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
