'use strict';

import User from './user.model';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import Channel from '../channel/channel.model';
import path from 'path';
import fs from 'fs';
import BusBoy from 'busboy';

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    return res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);
  };
}



export function updateTeam(req,res){
  return User.findOne({_id:req.body.organisationId})
                      .then((org)=>{
                        if(org){
                        org.teams.push(req.body.teamId);
                        org.save();
                        res.send(org);}
                        else{
                          res.send("notfound");
                        }
                      })
}

export function domainCheck(req,res){
  return User.findOne({domainName:req.body.domain,name:req.body.orgname})
                      .then((org)=>{
                        if(org){
                          console.log("found organisation with domainName");
                          res.send({result:"found"});
                        }
                        else{
                          console.log("not found organisation with domainName");
                          res.send({result:"notfound"});
                        }
                      })
}

export function findOrgbyName(req,res){

  return User.findOne({name:req.body.name})
                     .populate('teams members')
                     .exec()
                      .then((org) =>{

                        if(org){
                          console.log("found Organisation");
                        res.send(org);
                      }
                        else {
                          res.send("not found");
                        }
                      });
}



export function upsert(req, res) {
  console.log("hi");
  console.log(req.body);
  if(req.body._id) {
    delete req.body._id;
  }
  return User.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then((data)=>{
      return data;
    })
    .catch(handleError(res));
}
/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  console.log("in index of users");
  return User.find({role:'Organisation',status:'pending'}, '-salt -password').exec()
    .then(users => {
      console.log(users);
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

//aditya's chat fundtion for sending message
export function saveMessage(req, res) {
  var channelId = req.params.channelId;
  console.log("Save message:" + JSON.stringify(req.body));
  return Channel.findOne({
      _id: channelId
    })
    .exec()
    .then(channel => { // don't ever give out the password or salt
      if (!channel) {
        return res.status(401)
          .end();
      }
      var message = {
        user: req.body.data.user,
        message: req.body.data.message,
        messageType: req.body.data.type
      };
      channel.history.push(message);
      channel.save();
      res.send("Data saved");
    });
}


export function addUserInOrg(req,res){
  console.log(req.body);
  return User.findOne({_id:req.body.orgId})
                      .then((org)=>{
                          console.log("inside server adduserinorg");
                          org.members.push(req.body.userId);
                          org.save();
                          console.log(org);
                          res.send(org);

                      })
}

/**
 * Creates a new user
 */

 export function add(req,res){
   var x = new User(req.body);
   return x.save(req.body)
               .then((data) =>{
                 console.log("data added in user Schema")
                 res.send(data);
               })
 }

 export function addUser(req, res){
  return User.findOne({_id:req.body.organisationId})
                      .then((org)=>{
                        if(org){
                          console.log('Inside addUser() server');
                          org.members.push(req.body.userId);
                          org.save();
                          res.send(org);
                        }

                      })

}
 export function addTeamInUser3(req,res){
  console.log(req.body);
  return User.findOne({email:req.body.email})
              .then((user) =>{
                console.log(user);
                user.teams.push(req.body.team);
                user.save();
              res.send(user);
              })
}
export function addChannel(req,res){
  return User.findOne({_id:req.body.userId})
              .then((user) => {
                user.channels.push(req.body.channelId);
                user.save();
                res.send(user);
              })
}

export function create(req, res) {
  var newUser = new User(req.body);
  newUser.provider = 'local';

  newUser.save()
    .then(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({ token });
    })
    .catch(validationError(res));
}

/**
 * Get a single user
 */
 export function show(req, res, next) {
   var userId = req.params.id;
   console.log("Id::" + userId);
   return User.findOne({_id: userId}, '-salt -password')
     .populate('organisation channels teams')
     .exec()
     .then(user => { // don't ever give out the password or salt
       if (!user) {
         console.log('user not found');
         return res.status(401)
           .end();
       }
       console.log(user);
       res.json(user);
     })
     .catch(err => next(err));
 }

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id).exec()
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if(user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}




/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.findOne({ _id: userId }, '-salt -password')
    .populate('organisation teams channels members')
    .exec()
    .then(user => { // don't ever give out the password or salt
      if(!user) {
        return res.status(401).end();
      }
      res.send(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}

export function uploadFile(req, res) {
  var saveTo;
  var busboy = new BusBoy({
    headers: req.headers
  });
  req.pipe(busboy);
  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    console.log('-----Saving file');
    saveTo = path.join('./client/assets/uploads', path.basename(filename));
    console.log('++++++++++File being saved to: ' + saveTo);
    file.pipe(fs.createWriteStream(saveTo));
  });
  busboy.on('finish', function () {
    console.log(saveTo);
    res.status(200).json({'filePath':saveTo});
  });
}


export function checkExisting(req, res) {
    var email = req.body.email;

    User.findOne({email: email}, '-salt -password')
      .then(function(user) {
        if(user) 
          res.send(user);
        else
          res.send(null);
      });
}
