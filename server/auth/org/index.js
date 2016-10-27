'use strict';

import express from 'express';
import passport from 'passport';
import {signTokenOrg} from '../auth.service';

var router = express.Router();

router.post('/', function(req, res, next) {
  passport.authenticate('org-local', function(err, organisation, info) {
    var error = err || info;
    if(error) {
      return res.status(401).json(error);
    }
    if(!organisation) {
      return res.status(404).json({message: 'Something went wrong, please try again.'});
    }
      console.log("yellow black magic");
      console.log(organisation._id+" "+organisation.email);
    var token = signTokenOrg(organisation._id, organisation.email);
    console.log("creating token here");
    res.json({ token :token,organisation:organisation});
  })(req, res, next);
});




export default router;
