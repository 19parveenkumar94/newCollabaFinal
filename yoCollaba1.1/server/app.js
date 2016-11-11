/**
 * Main application file
 */

'use strict';

import express from 'express';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import config from './config/environment';
import http from 'http';

// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1); // eslint-disable-line no-process-exit
});

// Populate databases with sample data
if(config.seedDB) {
  require('./config/seed');
}

// Setup server
var app = express();
var server = http.createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
require('./config/socketio').default(socketio);
require('./config/express').default(app);
require('./routes').default(app);

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yogita.uc@gmail.com',    // your email here
    pass: 'urbanclap'          // your password here
  }
});

app.post('/email',function(req,res){
  var htmlContent = '<p>Name: ' + req.body.name + '</p>' +
                    '<p>Email: ' + req.body.email + '</p>' +
                    '<p>Message: ' + req.body.message + '</p>';

  var mailFrom = 'yogita.uc@gmail.com'
  var mailOptions = {
    to: req.body.email,                  // your email here
    subject: 'New message',
    from: mailFrom,
    sender: mailFrom,
    html: htmlContent
  };
  transporter.sendMail(mailOptions, function(err, info){
    if (err) {
      console.log(err);
    }else{
      console.log('Message sent: ' + info.response);
      return res.json(201, info);
    }
  });
});


setImmediate(startServer);

// Expose app
exports = module.exports = app;
