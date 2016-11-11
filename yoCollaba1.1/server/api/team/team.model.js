'use strict';

import crypto from 'crypto';
mongoose.Promise = require('bluebird');
import mongoose, {
  Schema
} from 'mongoose';
import Organisation from '../organisation/organisation.model';
import User from '../user/user.model';
import Channel from '../channel/channel.model';

var TeamSchema = new Schema({
  name: String,
  organisation: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  teamLeadEmail:String,
  members: [
     {
      type: Schema.Types.ObjectId,
      ref: 'User'

  }],
  channels: [{
    type: Schema.Types.ObjectId,
    ref: 'Channel'
  }]
});

export default mongoose.model('Team', TeamSchema);
