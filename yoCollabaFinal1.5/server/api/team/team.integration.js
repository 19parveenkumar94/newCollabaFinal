'use strict';

var app = require('../..');
import User from '../user/user.model';
import Channel from '../channel/channel.model';
import Organisation from '../organisation/organisation.model';
import Team from './team.model';
import request from 'supertest';

var newTeam;

describe('Team API:', function() {
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

  describe('GET /api/teams', function() {
    var teams;

    beforeEach(function(done) {
      request(app)
        .get('/api/teams')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          teams = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(teams).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/teams', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/teams')
        .send({
          name: 'New Team',
          //info: 'This is the brand new team!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newTeam = res.body;
          done();
        });
    });

    it('should respond with the newly created team', function() {
      expect(newTeam.name).to.equal('New Team');
      //expect(newTeam.info).to.equal('This is the brand new team!!!');
    });
  });

  describe('GET /api/teams/:id', function() {
    var teams;

    beforeEach(function(done) {
      request(app)
        .get('/api/teams/'+team._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          teams = res.body;
          done();
        });
    });

    afterEach(function() {
      teams = {};
    });

    it('should respond with the requested team', function() {
      expect(teams.name).to.equal('TechLeap');
      //expect(team.info).to.equal('This is the brand new team!!!');
    });
  });
  describe('POST /api/teams/addUser', function() {
    var teams;

    beforeEach(function(done) {
      request(app)
        .post('/api/teams/addUser')
        .send({
          teamId: team._id,
          userId: '4eed2d88c3dedf0d0300001c'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          teams = res.body;
          done();
        });
    });

    afterEach(function() {
      teams = {};
    });

    it('should respond with adding a menber', function() {
      expect(teams.members.length).to.equal(3);
      //expect(team.info).to.equal('This is the brand new team!!!');
    });
  });
  describe('POST /api/teams/channelUpdate', function() {
    var teams;

    beforeEach(function(done) {
      request(app)
        .post('/api/teams/channelUpdate')
        .send({
          teamId: team._id,
          channelId: '4eed2d88c3dedf0d0300001c'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          teams = res.body;
          done();
        });
    });

    afterEach(function() {
      teams = {};
    });

    it('should respond with adding a menber', function() {
      expect(teams.channels.length).to.equal(2);
      //expect(team.info).to.equal('This is the brand new team!!!');
    });
  });

  describe('PUT /api/teams/:id', function() {
    var updatedTeam;

    beforeEach(function(done) {
      request(app)
        .put('/api/teams/'+team._id)
        .send({
          name: 'Updated Team',
          //info: 'This is the updated team!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedTeam = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedTeam = {};
    });

    it('should respond with the original team', function() {
      expect(updatedTeam.name).to.equal('TechLeap');
      //expect(updatedTeam.info).to.equal('This is the brand new team!!!');
    });

    it('should respond with the updated team on a subsequent GET', function(done) {
      request(app)
        .get('/api/teams/'+team._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let teams = res.body;

          expect(teams.name).to.equal('Updated Team');
          //expect(team.info).to.equal('This is the updated team!!!');

          done();
        });
    });
  });

  describe('PATCH /api/teams/:id', function() {
    var patchedTeam;

    beforeEach(function(done) {
      request(app)
        .patch('/api/teams/'+team._id)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Team' }
          //{ op: 'replace', path: '/info', value: 'This is the patched team!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedTeam = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedTeam = {};
    });

    it('should respond with the patched team', function() {
      expect(patchedTeam.name).to.equal('Patched Team');
      //expect(patchedTeam.info).to.equal('This is the patched team!!!');
    });
  });

  describe('DELETE /api/teams/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/teams/${newTeam._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when team does not exist', function(done) {
      request(app)
        .delete(`/api/teams/${newTeam._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
