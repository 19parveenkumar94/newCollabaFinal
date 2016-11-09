/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/channels              ->  index
 * POST    /api/channels              ->  create
 * GET     /api/channels/:id          ->  show
 * PUT     /api/channels/:id          ->  upsert
 * PATCH   /api/channels/:id          ->  patch
 * DELETE  /api/channels/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Channel from './channel.model';
import User from '../user/user.model';
import Team from '../team/team.model';


function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Channels
export function index(req, res) {
  return Channel.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Channel from the DB
export function show(req, res) {
  return Channel.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
export function addUser(req,res){
  return Channel.findOne({team:req.body.teamId,name:req.body.name})
                .then((channel) => {
                  channel.members.push(req.body.userId);
                  channel.save();
                  res.send(channel);
                })
}


export function addUserInChannel(req,res){
  return Channel.findOne({_id:req.body.channelId})
                .then((channel) => {
                  channel.members.push(req.body.userId);
                  channel.save();
                  res.send(channel);
                })
}
//server side code to save the pinned message in the org wall channel
export function pinChatInChannel(req,res){
  return Channel.findOne({_id:req.body.channelId})
                .then((channel)=>{
                  channel.history.push(req.body.chat);
                  channel.save();
                  res.send(channel);
                })
}
// Creates a new Channel in the DB
export function create(req, res) {
  return Channel.create(req.body)
    .then((data)=>{
      res.send(data);
    })
    .catch(handleError(res));
}
export function addMembersInChannel(req,res){
  return Channel.findOne({_id:req.body.channelId})
                .then((channel)=>{
                  channel.members=req.body.members;
                  channel.team=req.body.teamId;
                  channel.save();
                  console.log("hello saved in channel members")
                  res.send(channel);
                })
}
// Upserts the given Channel in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Channel.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Channel in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Channel.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Channel from the DB
export function destroy(req, res) {
  return Channel.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}


//Delete a Channel from the DB and it's Dependencies 
export function deleteChannel(req, res) {
  var cId = req.body.channelId, tId = req.body.teamId;
  console.log('Inside POST api/channels/deleteChannel : ' + cId + ", " + tId);

  //Remove Channel from Team
  Team.findOne({ _id: tId }, function(err, team) {
    if(err)
      console.error(err);
    else {
      var idx = team.channels.indexOf(cId);
      team.channels.splice(idx, 1);
      team.save();
    }
  });


  //Remove Channel from all Members of the Channel and from Channel Schema
  Channel.findOne( { _id: cId }, function(err, channel) {
    if(err) 
      console.error(err);
    else {
      var memberList = channel.members;
      console.log(memberList);
      for(var i=0; i<memberList.length; ++i) {
        //Remove Channel from User
        User.findOne({ _id: memberList[i] }, function(err, user) {
          console.log('User : ------------------------' + user);
          var idx = user.channels.indexOf(cId);
          user.channels.splice(idx, 1);
          user.save();
        });
      }
      //Remove Channel from DB
      channel.remove();
    }
  });
  
  res.send(true);
}
