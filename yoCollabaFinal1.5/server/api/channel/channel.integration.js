'use strict';

var app = require('../..');
import User from '../user/user.model';
import Channel from './channel.model';
import Organisation from '../organisation/organisation.model';
import Team from '../team/team.model';
import request from 'supertest';

var newChannel;

describe('Channel API:', function() {
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


    describe('GET /api/channels', function() {
      var channels;

      beforeEach(function(done) {
        request(app)
          .get('/api/channels')
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            if(err) {
              return done(err);
            }
            channels = res.body;
            done();
          });
      });

      it('should respond with JSON array', function() {
        expect(channels).to.be.instanceOf(Array);
      });
    });
    describe('POST /api/channels/addUser', function() {
      var channels;

      beforeEach(function(done) {
        request(app)
          .post('/api/channels/addUser')
          .send({
            name: 'general',
            teamId: team._id,
            userId: '4eed2d88c3dedf0d0300001c'
          })
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            if(err) {
              return done(err);
            }
            channels = res.body;
            done();
          });
      });

      it('should respond with the new added member', function() {
        expect(channels.members.length).to.equal(3);
      });
    });
    describe('POST /api/channels/addUserInChannel', function() {
      var channels;

      beforeEach(function(done) {
        request(app)
          .post('/api/channels/addUserInChannel')
          .send({

            channelId: channel._id,
            userId: '4eed2d88c3dedf0d0300001c'
          })
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            if(err) {
              return done(err);
            }
            channels = res.body;
            done();
          });
      });

      it('should respond with the new added member', function() {
        expect(channels.members.length).to.equal(4);
      });
    });

    describe('POST /api/channels/pinChatInChannel', function() {
      var channels;

      beforeEach(function(done) {
        request(app)
          .post('/api/channels/pinChatInChannel')
          .send({

            channelId: channel._id,
            chat: {
              user: user.name,
              message: 'yellow is the best'
            }
          })
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            if(err) {
              return done(err);
            }
            channels = res.body;
            done();
          });
      });

      it('should respond with the new added member', function() {
        expect(channels.history.length).to.equal(1);
      });
    });


    describe('POST /api/channels/addMembersInChannel', function() {
      var channels;

      beforeEach(function(done) {
        request(app)
          .post('/api/channels/addMembersInChannel')
          .send({

            channelId: channel._id,
            teamId: team._id,
            members: [user1._id]
          })
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            if(err) {
              return done(err);
            }
            channels = res.body;
            done();
          });
      });

      it('should respond with the new added member', function() {
        expect(channels.members.length).to.equal(1);
      });
    });





    // describe('POST /api/channels/deleteChannel', function() {
    //   var channels;
    //
    //   beforeEach(function(done) {
    //     request(app)
    //       .post('/api/channels/deleteChannel')
    //       .send({
    //
    //         channelId: channel._id,
    //       teamId: team._id
    //       })
    //       .expect(200)
    //       .expect('Content-Type', /json/)
    //       .end((err, res) => {
    //         if(err) {
    //           return done(err);
    //         }
    //         channels = res.body;
    //         done();
    //       });
    //   });
    //
    //   it('should respond with the new added member', function() {
    //     expect(channels).to.equal(true);
    //   });
    // });

  describe('POST /api/channels', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/channels')
        .send({
          name: 'New Channel',
          team: team._id,
          members:[user._id,user1._id]
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newChannel = res.body;
          done();
        });
    });

    it('should respond with the newly created channel', function() {
      expect(newChannel.name).to.equal('New Channel');
      //expect(newChannel.info).to.equal('This is the brand new channel!!!');
    });
  });

  describe('GET /api/channels/:id', function() {
    var reschannel;

    beforeEach(function(done) {
      request(app)
        .get('/api/channels/'+channel._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          reschannel = res.body;
          done();
        });
    });

    afterEach(function() {
      reschannel = {};
    });

    it('should respond with the requested channel', function() {
      expect(reschannel.name).to.equal('general');
      //expect(channel.info).to.equal('This is the brand new channel!!!');
    });
  });

  describe('PUT /api/channels/:id', function() {
    var updatedChannel;

    beforeEach(function(done) {
      request(app)
        .put('/api/channels/'+channel._id)
        .send({
          name: 'Updated Channel',

        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedChannel = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedChannel = {};
    });

    it('should respond with the original channel', function() {
      expect(updatedChannel.name).to.equal('general');
      //expect(updatedChannel.info).to.equal('This is the brand new channel!!!');
    });

    it('should respond with the updated channel on a subsequent GET', function(done) {
      request(app)
        .get('/api/channels/'+channel._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let reschannel = res.body;

          expect(reschannel.name).to.equal('Updated Channel');
          //expect(channel.info).to.equal('This is the updated channel!!!');

          done();
        });
    });
  });

  describe('PATCH /api/channels/:id', function() {
    var patchedChannel;

    beforeEach(function(done) {
      request(app)
        .patch('/api/channels/'+channel._id)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Channel' }
          //{ op: 'replace', path: '/info', value: 'This is the patched channel!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedChannel = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedChannel = {};
    });

    it('should respond with the patched channel', function() {
      expect(patchedChannel.name).to.equal('Patched Channel');
      //expect(patchedChannel.info).to.equal('This is the patched channel!!!');
    });
  });

  describe('DELETE /api/channels/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/channels/${newChannel._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when channel does not exist', function(done) {
      request(app)
        .delete(`/api/channels/${newChannel._id}`)
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
