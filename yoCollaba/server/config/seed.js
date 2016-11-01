/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import Organisation from '../api/organisation/organisation.model';
import Team from '../api/team/team.model';
import Channel from '../api/channel/channel.model';


/* Create Users (17 in Total, 1 Admin)
Add Organisation, teams and Channels later. */
var userList = [];
userList.push(new User({ provider: 'local', role: 'admin', name: 'Admin', email: 'admin@example.com', password: 'admin'}) );
userList.push(new User({ provider: 'local', role: 'teamLead', name: 'aditya', email: 'aditya@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'teamMember', name: 'gaurav', email: 'gaurav@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'teamMember', name: 'nikesh', email: 'nikesh@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'teamMember', name: 'parveen', email: 'parveen@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'teamLead', name: 'ahmar', email: 'ahmar@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'teamMember', name: 'shubh', email: 'shubh@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'teamMember', name: 'mohini', email: 'mohini@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'teamMember', name: 'komal', email: 'komal@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'teamLead', name: 'aarushi', email: 'aarushi@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'teamMember', name: 'yogita', email: 'yogita@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'teamMember', name: 'ankita', email: 'ankita@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'teamMember', name: 'divya', email: 'divya@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'teamLead', name: 'priyanka', email: 'priyanka@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'teamMember', name: 'luv', email: 'luv@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'teamMember', name: 'atul', email: 'atul@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'teamMember', name: 'yogendra', email: 'yogendra@example.com', password: '123'}) );



/* Create Organisations (Total 2)
Add Teams and Members later. */
var orgList = [];
orgList.push(new Organisation({ name: 'Collabo-Enterprises', email: 'collabo@collabo.com', password: '123',
    website: 'www.collabo.com', about: 'Collabo Enterprises', address: 'Collabo Enterprises, India',
    phone: '1111111111', status: 'permanent'}) );

orgList.push(new Organisation({ name: 'Niit-Technologies', email: 'niit@niit-tech.com', password: '123',
    website: 'www.niit-tech.com', about: 'NIIT Technologies', address: 'NIIT Technologies, India',
    phone: '2222222222', status: 'permanent'}) );


/*  Push Members into Organisations and vice-versa. */
for(var i=1; i<userList.length; ++i) {
  if(i < userList.length/2 + 1) {
    orgList[0].members.push(userList[i]._id);
    userList[i].organisation = orgList[0]._id;
  }
  else {
    orgList[1].members.push(userList[i]._id);
    userList[i].organisation = orgList[1]._id;
  }
}



/*  Create Channels (Total 8),
each team has 2 Channels, One Public and One Private */
var channelList = [];

channelList.push(new Channel ({ name: 'public', members: [userList[1]._id, userList[2]._id, userList[3]._id, userList[4]._id] }) );
channelList.push(new Channel ({ name: 'private', members: [userList[1]._id, userList[2]._id, userList[3]._id]}) );

channelList.push(new Channel ({ name: 'public', members: [userList[5]._id, userList[6]._id, userList[7]._id, userList[8]._id] }) );
channelList.push(new Channel ({ name: 'private', members: [userList[5]._id, userList[6]._id, userList[7]._id] }) );

channelList.push(new Channel ({ name: 'public', members: [userList[9]._id, userList[10]._id, userList[11]._id, userList[12]._id] }) );
channelList.push(new Channel ({ name: 'private', members: [userList[9]._id, userList[10]._id, userList[11]._id] }) );

channelList.push(new Channel ({ name: 'public', members: [userList[13]._id, userList[14]._id, userList[15]._id, userList[16]._id] }) );
channelList.push(new Channel ({ name: 'private', members: [userList[13]._id, userList[14]._id, userList[15]._id] }) );




/* Add Teams (Total 4) [2 for each Organization]
Add organisations, channels and Members later */
var teamList = [];

teamList.push(new Team({ name: orgList[0].name + ' Team 1',
    organisation: orgList[0]._id,
    teamLeadEmail: userList[1].email,
    members: [userList[1]._id, userList[2]._id, userList[3]._id, userList[4]._id],
    channels: [channelList[0]._id, channelList[1]._id] }) );

teamList.push(new Team({ name: orgList[0].name + ' Team 2',
    organisation: orgList[0]._id,
    teamLeadEmail: userList[5].email,
    members: [userList[5]._id, userList[6]._id, userList[7]._id, userList[8]._id],
    channels: [channelList[2]._id, channelList[3]._id] }) );


teamList.push(new Team ({ name: orgList[1].name + ' Team 1',
    organisation: orgList[1]._id,
    teamLeadEmail: userList[9].email,
    members: [userList[9]._id, userList[10]._id, userList[11]._id, userList[12]._id],
    channels: [channelList[4]._id, channelList[5]._id] }) );

teamList.push(new Team({ name: orgList[1].name + ' Team 2',
    organisation: orgList[1]._id,
    teamLeadEmail: userList[13].email,
    members: [userList[13]._id, userList[14]._id, userList[15]._id, userList[16]._id],
    channels: [channelList[6]._id, channelList[7]._id] }) );




/*  Push Teams into organisations */
for(var i=0; i<teamList.length; ++i) {
  orgList[parseInt(i/2)].teams.push(teamList[i]._id);
}


/*Push Teams into Channels*/
for(var i=0; i<channelList.length ; ++i) {
  channelList[i].team = teamList[parseInt(i/2)]._id;
}


/*  Pushing Teams and Channels into Users */
for(var i=1; i<userList.length; ++i) {
  userList[i].teams.push(teamList[parseInt((i-1)/4)]._id);
}




/*  Pushing Channels into Users   */
userList[1].channels.push(channelList[0]._id);
userList[1].channels.push(channelList[1]._id);

userList[2].channels.push(channelList[0]._id);
userList[2].channels.push(channelList[1]._id);

userList[3].channels.push(channelList[0]._id);
userList[3].channels.push(channelList[1]._id);

userList[4].channels.push(channelList[0]._id);


userList[5].channels.push(channelList[2]._id);
userList[5].channels.push(channelList[3]._id);

userList[6].channels.push(channelList[2]._id);
userList[6].channels.push(channelList[3]._id);

userList[7].channels.push(channelList[2]._id);
userList[7].channels.push(channelList[3]._id);

userList[8].channels.push(channelList[2]._id);


userList[9].channels.push(channelList[4]._id);
userList[9].channels.push(channelList[5]._id);

userList[10].channels.push(channelList[4]._id);
userList[10].channels.push(channelList[5]._id);

userList[11].channels.push(channelList[4]._id);
userList[11].channels.push(channelList[5]._id);

userList[12].channels.push(channelList[4]._id);


userList[13].channels.push(channelList[6]._id);
userList[13].channels.push(channelList[7]._id);

userList[14].channels.push(channelList[6]._id);
userList[14].channels.push(channelList[7]._id);

userList[15].channels.push(channelList[6]._id);
userList[15].channels.push(channelList[7]._id);

userList[16].channels.push(channelList[6]._id);


//Check the Added Data.
console.log('User List : ' + userList);
console.log('Organisation List : ' + orgList);
console.log('Team List : ' + teamList);
console.log('Channel List : ' + channelList);



//Delete already existing data and seed above data to DB
User.find({})
  .remove()
  .then(() => {
    Organisation.find({})
      .remove()
      .then(() => {
        Team.find({})
          .remove()
          .then(() => {
            Channel.find({})
              .remove()
              .then(() => {
                //Add new data here
                User.create(userList[0], userList[1], userList[2], userList[3], userList[4], userList[5]
                  , userList[6], userList[7], userList[8], userList[9], userList[10], userList[11]
                  , userList[12], userList[13], userList[14], userList[15], userList[16]);
                Organisation.create(orgList[0], orgList[1]);
                Team.create(teamList[0], teamList[1], teamList[2], teamList[3]);
                Channel.create(channelList[0], channelList[1], channelList[2], channelList[3]
                  , channelList[4], channelList[5], channelList[6], channelList[7]);
              });
          });
      });
  });


//db.organisations.find({'name': /Pride/});
