'use strict';

import app from '../..';//picks up app.js from server
import User from './user.model';
import request from 'supertest';


describe('User API:', function() {
  var user;

  // Clear users before testing
  before(function() {
    return User.remove().then(function() {
      user = new User({
        name: 'Fake User',
        email: 'test@example.com',
        password: 'password'
      });

      return user.save();
    });
  });

  // Clear users after testing
  after(function() {
    return User.remove();
  });


  describe('GET /api/users/me', function() {
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

    it('should respond with a user profile when authenticated', function(done) {
      request(app)
        .get('/api/users/me')
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.body._id.toString()).to.equal(user._id.toString());
          done();
        });
    });

    it('should respond with a 401 when not authenticated', function(done) {
      request(app)
        .get('/api/users/me')
        .expect(401)
        .end(done);
    });
  });


  //Test api/users/:id
  describe('GET /api/users/:id', function() {
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

    it('Should respond with a User profile when authenticated.', function(done){
      request(app)
        .get('/api/users/:id')
        .set('authorization', 'Bearer ${token}')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
            expect(res.body._id.toString()).to.equal(user._id.toString());
            done();
        });
    });

    it('Should respond with 401 when Not authenticated.', function(done) {
      request(app)
        .get('/api/users/:id')
        .expect(401)
        .end(done);
    });
  });

});