'use strict';

import angular from 'angular';
import SettingsController from './settings.controller';

export default angular.module('collabaMineApp.settings', [])
  .controller('SettingsController', SettingsController)
  .name;
