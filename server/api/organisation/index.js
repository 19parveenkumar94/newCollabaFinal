'use strict';

var express = require('express');
var controller = require('./organisation.controller');

import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', controller.index);
router.get('/:id',controller.show);
router.get('/me', controller.me);

router.post('/findOrg', controller.findOrg);
router.post('/updateTeam', controller.updateTeam);
router.post('/addUser', controller.addUser);
router.post('/findOrgbyName', controller.findOrgbyName);
router.post('/domainCheck', controller.domainCheck);
router.post('/addUserInOrg', controller.addUserInOrg);
router.post('/findOrgbyNamePartial', controller.findOrgbyNamePartial);


router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

//router.put('/:id/accept', controller.upsert);

module.exports = router;
