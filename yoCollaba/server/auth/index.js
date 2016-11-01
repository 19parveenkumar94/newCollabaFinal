'use strict';
import express from 'express';
import config from '../config/environment';
import User from '../api/user/user.model';
import Organisation from '../api/organisation/organisation.model';

// Passport Configuration
require('./local/passport').setup(User, config);
require('./google/passport').setup(User, config);
require('./org/passport').setup(Organisation , config);

var router = express.Router();

router.use('/local', require('./local').default);
router.use('/google', require('./google').default);
router.use('/org' , require('./org').default);
export default router;
