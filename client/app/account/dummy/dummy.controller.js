'use strict';
const angular = require('angular');

/*@ngInject*/
export function dummyController() {
  this.message = 'Hello';
}

export default angular.module('yoCollabaFinalApp.dummy', [])
  .controller('DummyController', dummyController)
  .name;
