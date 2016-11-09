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
userList.push(new User({ provider: 'local', role: 'user', name: 'gaurav', email: 'gaurav@example.com', password: '123'}) );
userList.push(new User({ provider: 'local', role: 'user', name: 'aditya', email: 'aditya@example.com', password: '123'}) );
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
//userList - 17, 18
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


/*  Create Channels (Total 14),
Each team has 2 Channels, One General and One Special
Including 2 Organisation Level Walls - 0, 7 
4 Team Level Walls - 3, 6, 10, 13 */
var channelList = [];
//Organisation Level Wall for userList[17] - 0
channelList.push(new Channel({name: 'wall', members: [userList[1]._id, userList[2]._id, userList[3]._id, userList[4]._id,
      userList[5]._id, userList[6]._id, userList[7]._id, userList[8]._id]}));

channelList.push(new Channel ({ name: 'general', members: [userList[1]._id, userList[2]._id, userList[3]._id, userList[4]._id] }) );
channelList.push(new Channel ({ name: 'special', members: [userList[1]._id, userList[2]._id, userList[3]._id]}) );
//teamWall
channelList.push(new Channel ({ name: 'wall', members: [userList[1]._id, userList[2]._id, userList[3]._id, userList[4]._id] }) );

channelList.push(new Channel ({ name: 'general', members: [userList[2]._id, userList[5]._id, userList[6]._id, userList[7]._id, userList[8]._id] }) );
channelList.push(new Channel ({ name: 'special', members: [userList[5]._id, userList[6]._id, userList[7]._id, userList[8]._id] }) );
//teamWall
channelList.push(new Channel ({ name: 'wall', members: [userList[2]._id, userList[5]._id, userList[6]._id, userList[7]._id, userList[8]._id] }) );


//Organisation Level Wall for Org[18] - 7
channelList.push(new Channel({name: 'wall', members: [userList[9]._id, userList[10]._id, userList[11]._id, userList[12]._id,
      userList[13]._id, userList[14]._id, userList[15]._id, userList[16]._id]}));

channelList.push(new Channel ({ name: 'general', members: [userList[9]._id, userList[10]._id, userList[11]._id, userList[12]._id] }) );
channelList.push(new Channel ({ name: 'special', members: [userList[9]._id, userList[10]._id, userList[11]._id] }) );
//teamWall
channelList.push(new Channel ({ name: 'wall', members: [userList[9]._id, userList[10]._id, userList[11]._id, userList[12]._id] }) );

channelList.push(new Channel ({ name: 'general', members: [userList[10]._id, userList[13]._id, userList[14]._id, userList[15]._id, userList[16]._id] }) );
channelList.push(new Channel ({ name: 'special', members: [userList[13]._id, userList[14]._id, userList[15]._id, userList[16]._id] }) );
//teamWall
channelList.push(new Channel ({ name: 'wall', members: [userList[10]._id, userList[13]._id, userList[14]._id, userList[15]._id, userList[16]._id] }) );

//Organization level Walls



/*  Pushing Wall Channel's into organisations */
userList[17].channels.push(channelList[0]._id);
userList[18].channels.push(channelList[7]._id);




/* Add Teams (Total 4) [2 for each Organization]
Add organisations, channels and Members later */
var teamList = [];
teamList.push(new Team({ name: userList[17].name + ' Team 1',
    organisation: userList[17]._id,
    teamLeadEmail: userList[1].email,
    members: [ userList[1]._id, userList[2]._id, userList[3]._id, userList[4]._id ],
    channels: [channelList[1]._id, channelList[2]._id, channelList[3]._id] }) );

teamList.push(new Team({ name: userList[17].name + ' Team 2',
    organisation: userList[17]._id,
    teamLeadEmail: userList[5].email,
    members: [userList[2]._id, userList[5]._id, userList[6]._id, userList[7]._id, userList[8]._id],
    channels: [channelList[4]._id, channelList[5]._id, channelList[6]._id] }) );

teamList.push(new Team ({ name: userList[18].name + ' Team 1',
    organisation: userList[18]._id,
    teamLeadEmail: userList[9].email,
    members: [userList[9]._id, userList[10]._id, userList[11]._id, userList[12]._id],
    channels: [channelList[8]._id, channelList[9]._id, channelList[10]._id] }) );

teamList.push(new Team({ name: userList[18].name + ' Team 2',
    organisation: userList[18]._id,
    teamLeadEmail: userList[13].email,
    members: [userList[10]._id, userList[13]._id, userList[14]._id, userList[15]._id, userList[16]._id],
    channels: [channelList[11]._id, channelList[12]._id, channelList[13]._id] }) );



/*  Push Teams into organisations */
for(var i=0; i<teamList.length; ++i) {
    if(i < teamList.length/2) {
        userList[17].teams.push(teamList[i]._id);
    }
    else {
        userList[18].teams.push(teamList[i]._id);
    }
}




/*	Push Teams into Channels */
for(var i=1, len=channelList.length; i<len ; ++i) {
	if(i < 7) 
		channelList[i].team = teamList[parseInt((i-1)/3)]._id;
  	if(i > 7)
  		channelList[i].team = teamList[parseInt((i-2)/3)]._id;
}

//Push Organisation into Organisation Wall's team attribute
channelList[0].team = userList[17]._id;
channelList[7].team = userList[18]._id;


/*  Pushing Teams into Users */
for(var i=1, len=userList.length-2; i<len; ++i) {
  userList[i].teams.push(teamList[parseInt((i-1)/4)]._id);
}


//Push Teams into users with more than one teams
userList[2].teams.push(teamList[1]._id);
userList[10].teams.push(teamList[3]._id);






//Pushing Channels into Users (Optimised) 
for(var i=1, len=userList.length-2; i<len; ++i) {
	//insert orgWall
	if(i <= 8)
		userList[i].channels.push(channelList[0]._id);
	else
		userList[i].channels.push(channelList[7]._id);

	//insert other Channels
	if(i <= 4) {
		userList[i].channels.push(channelList[1]._id);
		userList[i].channels.push(channelList[3]._id);//teamWall
		if(i != 4)
			userList[i].channels.push(channelList[2]._id);
	}
	else if(i <= 8) {
		userList[i].channels.push(channelList[4]._id);
		userList[i].channels.push(channelList[5]._id);
		userList[i].channels.push(channelList[6]._id);//teamWall
	}
	else if(i <= 12) {
		userList[i].channels.push(channelList[8]._id);
		userList[i].channels.push(channelList[10]._id);//teamWall
		if(i != 12)
			userList[i].channels.push(channelList[9]._id);
	}
	else {
		userList[i].channels.push(channelList[11]._id);
		userList[i].channels.push(channelList[12]._id);
		userList[i].channels.push(channelList[13]._id);//teamWall
	}
}



//Add Channels to Users Existing in More than One Teams.
userList[2].channels.push(channelList[4]._id);//team 2 Channel
userList[2].channels.push(channelList[6]._id);//team 2 Wall

userList[10].channels.push(channelList[11]._id);//team 2 Channel
userList[10].channels.push(channelList[13]._id);// team 2 Wall



/*//Check the Added Data.
console.log('User List : ' + userList);
console.log('Team List : ' + teamList);
console.log('Channel List : ' + channelList);*/




/*  Delete already existing data and seed above data to DB */
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
                User.create(userList);

                Team.create(teamList);

                Channel.create(channelList);
              });
          });
    });



console.log('Data Seeded Successfully.');