'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

//Keep Definitive routes above Variable routes

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/getOrgList', controller.getOrgList);

router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.put('/:id', controller.upsert);

router.post('/', controller.create);
router.post('/findOrgbyName', controller.findOrgbyName);
router.post('/add', controller.add);
router.post('/addTeamInUser2', controller.addTeamInUser3);
router.post('/addUserInOrg', controller.addUserInOrg);


//router.post('/findMember', controller.findMember);
router.post('/updateTeam', controller.updateTeam);
router.post('/addChannel',auth.isAuthenticated(), controller.addChannel);

router.post('/uploads', controller.uploadFile);
router.post('/domainCheck', controller.domainCheck);
router.post('/addUser', controller.addUser);
//Find if user Already Exists
router.post('/checkExisting', controller.checkExisting);
router.post('/deleteMemberFromChannel', controller.deleteMemberFromChannel);
router.post('/saveMessage/:channelId', controller.saveMessage);
/*router.post('/findOrgByNamePartial', controller.findOrgByNamePartial);*/



module.exports = router;	
