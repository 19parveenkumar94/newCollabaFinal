'use strict';

var express = require('express');
var controller = require('./channel.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.post('/addUser', controller.addUser);
router.post('/addUserInChannel', controller.addUserInChannel);

router.post('/addMembersInChannel', controller.addMembersInChannel);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
