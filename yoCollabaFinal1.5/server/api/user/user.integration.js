'use strict';

import app from '../..';
import User from './user.model';
import Channel from '../channel/channel.model';
import Organisation from '../organisation/organisation.model';
import Team from '../team/team.model';
import request from 'supertest';

describe('User API:', function() {
  var user,user1,organisation,team,channel;

  // Clear users before testing
  before(function() {
    return User.remove().then(function() {
      return Organisation.remove().then(function(){
        user = new User({
          name: 'Fake User',
          email: 'test@example.com',
          password: 'password'
        });
        user1= new User({
          name: 'Fake User1',
          email: 'test1@example.com',
          password: 'password'
        });
        organisation = new User({
          name: 'yellow',
          email: 'fake@example.com',
          password:'password',
          status: 'permanent',
          domainName:'example.com',
          members:[user._id,user1._id]
        });

        team=new Team({
          name: 'TechLeap',
          organisation: organisation._id,
          teamLeadEmail: user.email,
          members: [user._id,user1._id]
        });

        channel=new Channel({
          name: 'general',
          team: team._id,
          members: [user._id,user1._id]
        })

        user.organisation=organisation._id;
        user.teams.push(team._id);
        user.channels.push(channel._id);

        user1.organisation=organisation._id;
        user1.teams.push(team._id);
        user1.channels.push(channel._id);

        organisation.teams.push(team._id);

        team.channels.push(channel._id);


        return user.save().then(function(){
          return user1.save().then(function(){
            return organisation.save().then(function(){
              return team.save().then(function(){
                return channel.save().then(function(){

                })
              })
            })
          })
        });
      });
    });
  });

  var token;
  before(function(done) {
    request(app)
      .post('/auth/local')
      .send({
        email: 'test@example.com',
        password: 'password'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });


  // Clear users after testing
  after(function() {
     User.remove();
     Organisation.remove();
     Team.remove();
     return Channel.remove();


  });


  describe('GET /api/users/:id', function(){

    it('should find a user by id',function(done){
      request(app)
        .get('/api/users/'+user._id)
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(!err){
            console.log("-------result-------");
            expect(res.body.name).to.equal(user.name);
            done();
          }
          else{
            console.log('------------------error-----------');
          }
        });

    })
  });
  describe('POST /api/users/add', function(){

    it('should add a new user',function(done){
      request(app)
        .post('/api/users/add')
        .send({
            name: 'parveen',
            email: 'parveen@example.com',
            password: 'password'

        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(!err){
            console.log("-------result-------");
            expect(res.body.name).to.equal('parveen');
            done();
          }
          else{
            console.log('------------------error-----------');
          }
        });

    })
  });
  describe('POST /api/users/findOrgbyName', function(){

    it('should find a org by its name',function(done){
      request(app)
        .post('/api/users/findOrgbyName')
        .send({
            name: 'yellow'


        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(!err){
            console.log("-------result-------");
            expect(res.body.domainName).to.equal('example.com');
            done();
          }
          else{
            console.log('------------------error-----------');
          }
        });

    })
  });

  describe('POST /api/users/addTeamInUser2', function(){

    it('should add a team in user team Array',function(done){
      request(app)
        .post('/api/users/addTeamInUser2')
        .send({
            email: 'test@example.com',
            team: '4eed2d88c3dedf0d0300001c'


        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(!err){
            console.log("-------result-------");
            expect(res.body.teams.length).to.equal(2);
            done();
          }
          else{
            console.log('------------------error-----------');
          }
        });

    })
  });
  describe('POST /api/users/addUserInOrg', function(){

    it('should add a user in Organisation',function(done){
      request(app)
        .post('/api/users/addUserInOrg')
        .send({
            orgId: organisation._id,
            userId: '4eed2d88c3dedf0d0300001c'


        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(!err){
            console.log("-------result-------");
            expect(res.body.members.length).to.equal(3);
            done();
          }
          else{
            console.log('------------------error-----------');
          }
        });

    })
  });
  describe('POST /api/users/updateTeam', function(){

    it('should  add Team in org',function(done){
      request(app)
        .post('/api/users/updateTeam')
        .send({
            organisationId: organisation._id,
            teamId: '4eed2d88c3dedf0d0300001c'


        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(!err){
            console.log("-------result-------");
            expect(res.body.teams.length).to.equal(2);
            done();
          }
          else{
            console.log('------------------error-----------');
          }
        });

    })
  });

  describe('POST /api/users/addChannel', function(){

    it('should  add channel in user',function(done){
      request(app)
        .post('/api/users/addChannel')
        .send({
            userId: user1._id,
            channelId: '4eed2d88c3dedf0d0300001c'


        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(!err){
            console.log("-------result-------");
            expect(res.body.channels.length).to.equal(2);
            done();
          }
          else{
            console.log('------------------error-----------');
          }
        });

    })
  });
  describe('POST /api/users/domainCheck', function(){

    it('should  check domain of a user in organisation',function(done){
      request(app)
        .post('/api/users/domainCheck')
        .send({
            orgname: 'yellow',
            domain: 'example.com'


        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(!err){
            console.log("-------result-------");
            expect(res.body.result).to.equal('found');
            done();
          }
          else{
            console.log('------------------error-----------');
          }
        });

    })
  });
  describe('POST /api/users/checkExisting', function(){

    it('should if a user is registered in a org or not',function(done){
      request(app)
        .post('/api/users/checkExisting')
        .send({

            email: 'test1@example.com'


        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(!err){
            console.log("-------result-------");
            expect(res.body.name).to.equal('Fake User1');
            done();
          }
          else{
            console.log('------------------error-----------');
          }
        });

    })
  });
  describe('POST /api/users/deleteMemberFromChannel', function(){

    it('should delete a member from channel',function(done){
      request(app)
        .post('/api/users/deleteMemberFromChannel')
        .send({

            memberId:user1._id,
            channelId:channel._id


        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(!err){
            console.log("-------result-------");
            expect(res.body).to.equal(true);
            done();
          }
          else{
            console.log('------------------error-----------');
          }
        });

    })
  });
  describe('POST /api/users/saveProfilePic', function(){

    it('should save the url of the profile pic the user',function(done){
      request(app)
        .post('/api/users/saveProfilePic')
        .send({
          data:{

            userId:user1._id,
            message:'as.jpg'


        }
      })
        .expect(200)
        .end((err, res) => {
          if(!err){
            console.log("-------result-------");

            expect(res.text).to.equal('Data saved');
            done();
          }
          else{
            console.log(err);
            console.log('------------------error-----------');
          }
        });

    })
  });

  describe('POST /api/users/saveMessage/:channelId', function(){

    it('should save the message in a given channel',function(done){
      request(app)
        .post('/api/users/saveMessage/'+channel._id)
        .send({
          data:{

          user: 'parveen',
          message:'yellow',


        }
      })
        .expect(200)
        .end((err, res) => {
          if(!err){
            console.log("-------result-------");

            expect(res.text).to.equal('Data saved');
            done();
          }
          else{
            console.log(err);
            console.log('------------------error-----------');
          }
        });

    })
  });
  describe('POST /api/users/deleteMessage/:channelId', function(){

    it('should save the Delete in a given channel',function(done){
      request(app)
        .post('/api/users/deleteMessage/'+channel._id)
        .send({


          sender: 'parveen',
          message:'yellow',



      })
        .expect(200)
        .end((err, res) => {
          if(!err){
            console.log("-------result-------");

            expect(res.text).to.equal('Data saved');
            done();
          }
          else{
            console.log(err);
            console.log('------------------error-----------');
          }
        });

    })
  });


  // describe('GET /api/users/me', function() {
  //   var token;
  //
    // before(function(done) {
    //   request(app)
    //     .post('/auth/local')
    //     .send({
    //       email: 'test@example.com',
    //       password: 'password'
    //     })
    //     .expect(200)
    //     .expect('Content-Type', /json/)
    //     .end((err, res) => {
    //       token = res.body.token;
    //       done();
    //     });
    // });
  //
  //   it('should respond with a user profile when authenticated', function(done) {
  //     request(app)
  //       .get('/api/users/me')
  //       .set('authorization', `Bearer ${token}`)
  //       .expect(200)
  //       .expect('Content-Type', /json/)
  //       .end((err, res) => {
  //         expect(res.body._id.toString()).to.equal(user._id.toString());
  //         done();
  //       });
  //   });
  //
  //   it('should respond with a 401 when not authenticated', function(done) {
  //     request(app)
  //       .get('/api/users/me')
  //       .expect(401)
  //       .end(done);
  //   });
  // });
});
