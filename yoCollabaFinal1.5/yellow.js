'use strict';
import mongoose from 'mongoose';
var app = require('../..');
import Employee from './employee.model';
import Organisation from '../organisation/organisation.model';
import User from '../user/user.model';
import Channel from '../../components/models/channel.model';
import Wall from '../../components/models/wall.model';
import Team from '../../components/models/team.model';
import request from 'supertest';

var newEmployee;

describe('Employee API:', function() {
  var user, user1, employee, employee1, token, organisation, team, channel, wall, historyWallId;

  before(function(done) {
    return User.remove().then(function() {
      return Employee.remove().then(function() {
        return Organisation.remove().then(function() {

          employee = new Employee({
            name: 'Fake User',
            email: 'test@example.com',
            role: 'employee',
            designation: 's/w',
            department: 'IT'
          });
          employee1 = new Employee({
            name: 'Fake User1',
            email: 'test1@example.com',
            role: 'employee',
            designation: 's/w',
            department: 'IT'
          });
          user = new User({
            name: 'Fake User',
            email: 'test@example.com',
            password: 'password'
          });
          user1 = new User({
            name: 'Fake User1',
            email: 'test1@example.com',
            password: 'password'
          });
          organisation = new Organisation({
            name: 'Ally',
            email: 'fake@ally.com',
            members: [employee._id, employee1._id]
          });
          team = new Team({
            name: 'TechLeap',
            organisation: organisation._id,
            members: [{
              member: employee._id,
              role: 'member'
            }, {
              member: employee1._id,
              role: 'team_admin'
            }]
          });
          channel = new Channel({
            name: 'Maask',
            members: [employee._id, employee1._id],
            team: team._id
          });
          wall = new Wall({
            name: 'Techleap General',
            owner: {
              owner_id: team._id,
              owner_type: 'team'
            }
          });
          employee.organisation = organisation._id;
          employee.teams.push(team._id);
          employee.channels.push(channel._id);

          employee1.organisation = organisation._id;
          employee1.teams.push(team._id);
          employee1.channels.push(channel._id);

          organisation.teams.push(team._id);
          organisation.restricted_walls.push({
            wall: wall._id,
            team: team._id
          });

          team.channels.push(channel._id);

          return user.save().then(function() {
            return user1.save().then(function() {
              return employee.save().then(function() {
                return employee1.save().then(function() {
                  return organisation.save().then(function() {
                    return team.save().then(function() {
                      return channel.save().then(function() {
                        return wall.save().then(function() {
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
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  after(function() {
    User.remove();
    Employee.remove();
    Organisation.remove();
    Team.remove();
    Channel.remove();
    return Wall.remove();
  });

  describe('GET /api/employees', function() {
    var employees;

    beforeEach(function(done) {
      request(app)
        .get('/api/employees')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          employees = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(employees)
        .to
        .be
        .instanceOf(Array);
    });
  });

  describe('GET /api/employees/:id/getEmployeeInfo', function() {
    it('should respond with particular employee Info', function(done) {
      request(app)
        .get('/api/employees/' + employee.email + '/getEmployeeInfo')
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (!err) {
            console.log("------------result---------");
            expect(res.body._id.toString()).to.equal(employee._id.toString());
            expect(res.body.name).to.equal(employee.name);
            expect(res.body.organisation._id.toString()).to.equal(organisation._id.toString());
            done();
          } else {
            console.log("-------------Error----------");
          }

        });
    });

  });
  describe('GET /api/employees/getChannelInfo', function() {
    it('should respond with particular channel Info', function(done) {
      request(app)
        .get('/api/employees/' + channel._id + '/getChannelInfo')
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (!err) {
            console.log("------------result---------");
            expect(res.body._id.toString()).to.equal(channel._id.toString());
            expect(res.body.name).to.equal(channel.name);
            done();
          } else {
            console.log("-------------Error----------");
          }

        });
    });
  })

  describe('GET /api/employees/getWallInfo', function() {
    it('should respond with particular wall Info', function(done) {
      request(app)
        .get('/api/employees/' + wall._id + '/getWallInfo')
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (!err) {
            console.log("------------result---------");
            expect(res.body._id.toString()).to.equal(wall._id.toString());
            expect(res.body.name).to.equal(wall.name);
            done();
          } else {
            console.log("-------------Error----------");
          }

        });
    });
  })

  describe('POST /api/employees/saveMessage', function() {
    it('should save message in channel model', function(done) {
      request(app)
        .post('/api/employees/' + channel._id + '/saveMessage')
        .send({
          data: {
            employee_name: employee.name,
            employee_email: employee.email,
            message: 'Hello ',
            messageType: 'text'
          }
        })
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (!err) {
            console.log("------------result---------");
            expect(res.body.data).to.equal('Success');
            done();
          } else {
            console.log("-------------Error----------");
          }

        });
    });
  });

  describe('POST /api/employees/savePost', function() {
    it('should save post in wall model', function(done) {
      request(app)
        .post('/api/employees/' + wall._id + '/savePost')
        .send({
          data: {
            employee_name: employee.name,
            employee_email: employee.email,
            message: 'Hello '
          }
        })
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (!err) {
            console.log("------------result---------");
            expect(res.body.data).to.equal('Success');
            historyWallId = res.body.history;
            done();
          } else {
            console.log("-------------Error----------");
          }

        });
    });

    it('should respond with a 401 if wall does not exist', function(done) {
      request(app)
        .post('/api/employees/' + new mongoose.Types.ObjectId('4eed2d88c3dedf0d0300001c') + '/savePost')
        .send({
          data: {
            employee_name: employee.name,
            employee_email: employee.email,
            message: 'Hello '
          }
        })
        .set('authorization', `Bearer ${token}`)
        .expect(401)
        .end(done);
    });
  });

  describe('POST /api/employees/saveComment', function() {
    it('should save comment in wall model', function(done) {
      request(app)
        .post('/api/employees/' + wall._id + '/saveComment')
        .send({
          historyId: historyWallId,
          name: employee.name,
          email: employee.email,
          message: "Comment on my post"
        })
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (!err) {
            console.log("------------result---------");
            expect(res.body.data).to.equal('Success');
            done();
          } else {
            console.log("-------------Error----------");
          }

        });
    });
  });

  describe('POST /api/employees/personalChat', function() {
    it('should create a new channel for personal chat', function(done) {
      request(app)
        .post('/api/employees/personalChat')
        .send({
          emp1: employee._id,
          emp2: employee1._id
        })
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (!err) {
            console.log("------------result---------");
            var channelId = employee._id.toString().substring(12, 24) + employee1._id.toString().substring(12, 24);

            expect(res.body._id.toString()).to.equal(channelId);
            done();
          } else {
            console.log("-------------Error----------");
            console.log(err);
            done();
          }

        });
    });
  });
  // describe('POST /api/employees', function() {
  //   beforeEach(function(done) {
  //     request(app)
  //       .post('/api/employees')
  //       .send({
  //         name: 'New Employee',
  //         info: 'This is the brand new employee!!!'
  //       })
  //       .expect(201)
  //       .expect('Content-Type', /json/)
  //       .end((err, res) => {
  //         if (err) {
  //           return done(err);
  //         }
  //         newEmployee = res.body;
  //         done();
  //       });
  //   });
  //
  //   it('should respond with the newly created employee', function() {
  //     expect(newEmployee.name)
  //       .to
  //       .equal('New Employee');
  //     expect(newEmployee.info)
  //       .to
  //       .equal('This is the brand new employee!!!');
  //   });
  // });
  //
  // describe('GET /api/employees/:id', function() {
  //   var employee;
  //
  //   beforeEach(function(done) {
  //     request(app)
  //       .get(`/api/employees/${newEmployee._id}`)
  //       .expect(200)
  //       .expect('Content-Type', /json/)
  //       .end((err, res) => {
  //         if (err) {
  //           return done(err);
  //         }
  //         employee = res.body;
  //         done();
  //       });
  //   });
  //
  //   afterEach(function() {
  //     employee = {};
  //   });
  //
  //   it('should respond with the requested employee', function() {
  //     expect(employee.name)
  //       .to
  //       .equal('New Employee');
  //     expect(employee.info)
  //       .to
  //       .equal('This is the brand new employee!!!');
  //   });
  // });
  //
  // describe('PUT /api/employees/:id', function() {
  //   var updatedEmployee;
  //
  //   beforeEach(function(done) {
  //     request(app)
  //       .put(`/api/employees/${newEmployee._id}`)
  //       .send({
  //         name: 'Updated Employee',
  //         info: 'This is the updated employee!!!'
  //       })
  //       .expect(200)
  //       .expect('Content-Type', /json/)
  //       .end(function(err, res) {
  //         if (err) {
  //           return done(err);
  //         }
  //         updatedEmployee = res.body;
  //         done();
  //       });
  //   });
  //
  //   afterEach(function() {
  //     updatedEmployee = {};
  //   });
  //
  //   it('should respond with the original employee', function() {
  //     expect(updatedEmployee.name)
  //       .to
  //       .equal('New Employee');
  //     expect(updatedEmployee.info)
  //       .to
  //       .equal('This is the brand new employee!!!');
  //   });
  //
  //   it('should respond with the updated employee on a subsequent GET', function(done) {
  //     request(app)
  //       .get(`/api/employees/${newEmployee._id}`)
  //       .expect(200)
  //       .expect('Content-Type', /json/)
  //       .end((err, res) => {
  //         if (err) {
  //           return done(err);
  //         }
  //         let employee = res.body;
  //
  //         expect(employee.name)
  //           .to
  //           .equal('Updated Employee');
  //         expect(employee.info)
  //           .to
  //           .equal('This is the updated employee!!!');
  //
  //         done();
  //       });
  //   });
  // });
  //
  // describe('PATCH /api/employees/:id', function() {
  //   var patchedEmployee;
  //
  //   beforeEach(function(done) {
  //     request(app)
  //       .patch(`/api/employees/${newEmployee._id}`)
  //       .send([{
  //         op: 'replace',
  //         path: '/name',
  //         value: 'Patched Employee'
  //       }, {
  //         op: 'replace',
  //         path: '/info',
  //         value: 'This is the patched employee!!!'
  //       }])
  //       .expect(200)
  //       .expect('Content-Type', /json/)
  //       .end(function(err, res) {
  //         if (err) {
  //           return done(err);
  //         }
  //         patchedEmployee = res.body;
  //         done();
  //       });
  //   });
  //
  //   afterEach(function() {
  //     patchedEmployee = {};
  //   });
  //
  //   it('should respond with the patched employee', function() {
  //     expect(patchedEmployee.name)
  //       .to
  //       .equal('Patched Employee');
  //     expect(patchedEmployee.info)
  //       .to
  //       .equal('This is the patched employee!!!');
  //   });
  // });
  //
  // describe('DELETE /api/employees/:id', function() {
  //   it('should respond with 204 on successful removal', function(done) {
  //     request(app)
  //       .delete(`/api/employees/${newEmployee._id}`)
  //       .expect(204)
  //       .end(err => {
  //         if (err) {
  //           return done(err);
  //         }
  //         done();
  //       });
  //   });
  //
  //   it('should respond with 404 when employee does not exist', function(done) {
  //     request(app)
  //       .delete(`/api/employees/${newEmployee._id}`)
  //       .expect(404)
  //       .end(err => {
  //         if (err) {
  //           return done(err);
  //         }
  //         done();
  //       });
  //   });
  // });
});
