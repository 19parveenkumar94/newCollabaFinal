/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */


'use strict';
import User from '../api/user/user.model';
import Team from '../api/team/team.model';
import Channel from '../api/channel/channel.model';


/* Create Users (17 in Total, 1 Admin)
Add Organisation, teams and Channels later. */



var userList = [];
userList.push(new User({ provider: 'local', role: 'admin', name: 'Admin', email: 'admin@example.com', password: 'admin'}) );
userList.push(new User({ provider: 'local', role: 'user', name: 'aditya', email: 'aditya@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'user', name: 'gaurav', email: 'gaurav@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'user', name: 'nikesh', email: 'nikesh@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'user', name: 'parveen', email: 'parveen@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'user', name: 'ahmar', email: 'ahmar@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'user', name: 'shubh', email: 'shubh@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'user', name: 'mohini', email: 'mohini@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'user', name: 'komal', email: 'komal@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'user', name: 'aarushi', email: 'aarushi@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'user', name: 'yogita', email: 'yogita@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'user', name: 'ankita', email: 'ankita@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'user', name: 'divya', email: 'divya@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'user', name: 'priyanka', email: 'priyanka@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'user', name: 'luv', email: 'luv@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'user', name: 'atul', email: 'atul@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'user', name: 'yogendra', email: 'yogendra@example.com', password: '123'}) );



/** Create Organisations (Total 2)
(Organisation is also a type of User)
Add Teams and Members later. */
//var orgList = [];17, 18
userList.push(new User({ name: 'Collabo-Enterprises', email: 'collabo@collabo.com', password: '123',
    role: 'Organisation', website: 'www.collabo.com', about: 'Collabo Enterprises', address: 'Collabo Enterprises, India',
    phone: '1111111111', status: 'permanent', domainName: 'gmail.com'}) );

userList.push(new User({ name: 'Niit-Technologies', email: 'niit@niit-tech.com', password: '123',
    role: 'Organisation', website: 'www.niit-tech.com', about: 'NIIT Technologies', address: 'NIIT Technologies, India',
    phone: '2222222222', status: 'permanent', domainName: 'niit-tech.com'}) );



/*  Push Members into Organisations and vice-versa. */
for(var i=1, len=userList.length-2; i<len; ++i) {
  if(i < len/2 + 1) {
    userList[17].members.push(userList[i]._id);
    userList[i].organisation = userList[17]._id;
  }
  else {
    userList[18].members.push(userList[i]._id);
    userList[i].organisation = userList[18]._id;
  }
}


/*  Create Channels (Total 10),
each team has 2 Channels, One General and One Special
Including 2 Organisation Level Walls */
var channelList = [];
channelList.push(new Channel ({ name: 'general', members: [userList[1]._id, userList[2]._id, userList[3]._id, userList[4]._id] }) );
channelList.push(new Channel ({ name: 'special', members: [userList[1]._id, userList[2]._id, userList[3]._id]}) );

channelList.push(new Channel ({ name: 'general', members: [userList[2]._id, userList[5]._id, userList[6]._id, userList[7]._id, userList[8]._id] }) );
channelList.push(new Channel ({ name: 'special', members: [userList[2]._id, userList[5]._id, userList[6]._id, userList[7]._id] }) );

channelList.push(new Channel ({ name: 'general', members: [userList[9]._id, userList[10]._id, userList[11]._id, userList[12]._id] }) );
channelList.push(new Channel ({ name: 'special', members: [userList[9]._id, userList[10]._id, userList[11]._id] }) );

channelList.push(new Channel ({ name: 'general', members: [userList[10]._id, userList[13]._id, userList[14]._id, userList[15]._id, userList[16]._id] }) );
channelList.push(new Channel ({ name: 'special', members: [userList[10]._id, userList[13]._id, userList[14]._id, userList[15]._id] }) );

//Organization level Walls
channelList.push(new Channel({name: 'wall', members: [userList[1]._id, userList[2]._id, userList[3]._id, userList[4]._id,
      userList[5]._id, userList[6]._id, userList[7]._id, userList[8]._id]}));

channelList.push(new Channel({name: 'wall', members: [userList[9]._id, userList[10]._id, userList[11]._id, userList[12]._id,
      userList[13]._id, userList[14]._id, userList[15]._id, userList[16]._id]}));


/*  Pushing Wall Channel's into organisations */
userList[17].channels.push(channelList[8]._id);
userList[18].channels.push(channelList[9]._id);



/* Add Teams (Total 4) [2 for each Organization]
Add organisations, channels and Members later */
var teamList = [];
teamList.push(new Team({ name: userList[17].name + ' Team 1',
    organisation: userList[17]._id,
    teamLeadEmail: userList[1].email,
    members: [ userList[1]._id, userList[2]._id, userList[3]._id, userList[4]._id ],
    channels: [channelList[0]._id, channelList[1]._id] }) );

teamList.push(new Team({ name: userList[17].name + ' Team 2',
    organisation: userList[17]._id,
    teamLeadEmail: userList[5].email,
    members: [userList[2]._id, userList[5]._id, userList[6]._id, userList[7]._id, userList[8]._id],
    channels: [channelList[2]._id, channelList[3]._id] }) );

teamList.push(new Team ({ name: userList[18].name + ' Team 1',
    organisation: userList[18]._id,
    teamLeadEmail: userList[9].email,
    members: [userList[9]._id, userList[10]._id, userList[11]._id, userList[12]._id],
    channels: [channelList[4]._id, channelList[5]._id] }) );

teamList.push(new Team({ name: userList[18].name + ' Team 2',
    organisation: userList[18]._id,
    teamLeadEmail: userList[13].email,
    members: [userList[10]._id, userList[13]._id, userList[14]._id, userList[15]._id, userList[16]._id],
    channels: [channelList[6]._id, channelList[7]._id] }) );



/*  Push Teams into organisations */
for(var i=0; i<teamList.length; ++i) {
    if(i < teamList.length/2) {
        userList[17].teams.push(teamList[i]._id);
    }
    else {
        userList[18].teams.push(teamList[i]._id);
    }
}




/*Push Teams into Channels*/
for(var i=0, len=channelList.length-2; i<len ; ++i) {
  channelList[i].team = teamList[parseInt(i/2)]._id;
}

//Push Organisation into Wall Channel's team attribute
channelList[8].team = userList[17]._id;
channelList[9].team = userList[18]._id;


/*  Pushing Teams into Users */
for(var i=1, len=userList.length-2; i<len; ++i) {
  userList[i].teams.push(teamList[parseInt((i-1)/4)]._id);
}


//Push Teams into users with more than one teams
userList[2].teams.push(teamList[1]._id);
userList[10].teams.push(teamList[3]._id);





/*  Pushing Channels into Users   */
userList[1].channels.push(channelList[0]._id);
userList[1].channels.push(channelList[1]._id);
userList[1].channels.push(channelList[8]._id);

//Exists in more than One team
userList[2].channels.push(channelList[0]._id);
userList[2].channels.push(channelList[1]._id);
userList[2].channels.push(channelList[2]._id);
userList[2].channels.push(channelList[3]._id);
userList[2].channels.push(channelList[8]._id);

userList[3].channels.push(channelList[0]._id);
userList[3].channels.push(channelList[1]._id);
userList[3].channels.push(channelList[8]._id);

userList[4].channels.push(channelList[0]._id);
userList[4].channels.push(channelList[8]._id);

userList[5].channels.push(channelList[2]._id);
userList[5].channels.push(channelList[3]._id);
userList[5].channels.push(channelList[8]._id);

userList[6].channels.push(channelList[2]._id);
userList[6].channels.push(channelList[3]._id);
userList[6].channels.push(channelList[8]._id);

userList[7].channels.push(channelList[2]._id);
userList[7].channels.push(channelList[3]._id);
userList[7].channels.push(channelList[8]._id);

userList[8].channels.push(channelList[2]._id);
userList[8].channels.push(channelList[8]._id);


userList[9].channels.push(channelList[4]._id);
userList[9].channels.push(channelList[5]._id);
userList[9].channels.push(channelList[9]._id);

//Exists in more than One team
userList[10].channels.push(channelList[4]._id);
userList[10].channels.push(channelList[5]._id);
userList[10].channels.push(channelList[6]._id);
userList[10].channels.push(channelList[7]._id);
userList[10].channels.push(channelList[9]._id);


userList[11].channels.push(channelList[4]._id);
userList[11].channels.push(channelList[5]._id);
userList[11].channels.push(channelList[9]._id);

userList[12].channels.push(channelList[4]._id);
userList[12].channels.push(channelList[9]._id);

userList[13].channels.push(channelList[6]._id);
userList[13].channels.push(channelList[7]._id);
userList[13].channels.push(channelList[9]._id);

userList[14].channels.push(channelList[6]._id);
userList[14].channels.push(channelList[7]._id);
userList[14].channels.push(channelList[9]._id);

userList[15].channels.push(channelList[6]._id);
userList[15].channels.push(channelList[7]._id);
userList[15].channels.push(channelList[9]._id);

userList[16].channels.push(channelList[6]._id);
userList[16].channels.push(channelList[9]._id);





//Check the Added Data.
/*console.log('User List : ' + userList);
console.log('Team List : ' + teamList);
console.log('Channel List : ' + channelList);*/
console.log('Data Seeded Successfully.');



/*  Delete already existing data and seed above data to DB
*/
User.find({})
    .remove()
    .then(() => {
        Team.find({})
          .remove()
          .then(() => {
            Channel.find({})
              .remove()
              .then(() => {
                //Add new data here
                User.create(userList[0], userList[1], userList[2], userList[3],
                    userList[4], userList[5], userList[6], userList[7], userList[8],
                    userList[9], userList[10], userList[11], userList[12], userList[13],
                    userList[14], userList[15], userList[16], userList[17], userList[18]);

                Team.create(teamList[0], teamList[1], teamList[2], teamList[3]);

                Channel.create(channelList[0], channelList[1], channelList[2], channelList[3]
                  , channelList[4], channelList[5], channelList[6], channelList[7], channelList[8], channelList[9]);
              });
          });
    });
