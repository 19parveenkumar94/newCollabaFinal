import crypto from 'crypto';
mongoose.Promise = require('bluebird');
import mongoose, {Schema} from 'mongoose';
import Organisation from '../organisation/organisation.model';
import User from '../user/user.model';
import Team from '../team/team.model';

var ChannelSchema = new Schema({
  name: String,
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  type: String,
  history: [{
    user: String,
    message: String,
    messageType: String,
    time: {
      type: Date,
      default: Date.now
    }
  }]
});

export default mongoose.model('Channel', ChannelSchema);
