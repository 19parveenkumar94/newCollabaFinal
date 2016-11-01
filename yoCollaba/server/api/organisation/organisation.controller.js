/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/organisations              ->  index
 * POST    /api/organisations              ->  create
 * GET     /api/organisations/:id          ->  show
 * PUT     /api/organisations/:id          ->  upsert
 * PATCH   /api/organisations/:id          ->  patch
 * DELETE  /api/organisations/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Organisation from './organisation.model';


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

// Gets a list of Organisations
export function index(req, res) {
  return Organisation.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Organisation from the DB
export function show(req, res) {
  return Organisation.findById(req.params.id)
  .populate('members teams')
  .exec()
    .then((data) =>{
      res.send(data);
    })
    .catch(handleError(res));
}

//function to find a organisatioon given an email
export function findOrg(req,res){

  return Organisation.findOne({email:req.body.email})
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
export function domainCheck(req,res){
  return Organisation.findOne({domainName:req.body.domain})
                      .then((org)=>{
                        if(org){
                          console.log("found organisation with domainName");
                          res.send(org);
                        }
                        else{
                          console.log("not found organisation with domainName");
                        }
                      })
}
export function addUserInOrg(req,res){
  return Organisation.findOne({name:req.body.orgName})
                      .then((org)=>{
                        if(org){
                          org.members.push(req.body.teamId);
                          org.save();
                          return org;
                        }
                      })
}
export function me(req, res, next) {
  var userId = req.organisation._id;
  console.log("black magic");
  console.log(req.organisation._id);
  return Organisation.findOne({ _id: userId }, '-salt -password')
    .exec()
    .then(user => { // don't ever give out the password or salt
      if(!user) {
        return res.status(401).end();
      }
      res.send(user);
    })
    .catch(err => next(err));
}

export function findOrgbyName(req,res){

  return Organisation.findOne({name:req.body.name})
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

//Find Organization given a Partial Name (Returns an Array)
export function findOrgbyNamePartial(req,res) {
  var searchName = req.body.name;
  console.log(searchName);
  // { $regex: searchName, $options: 'i'} for search like a given name
  return Organisation.find({name:  { $regex: searchName, $options: 'i'}})
    .exec()
    .then((org) => {
        if(org != null && org.length != 0) {
            console.log("Found Organisation : " + org);
            res.send(org);
        }
        else {
            console.log('Not Found');
            res.send(false);
        }
    });
}



export function updateTeam(req,res){
  return Organisation.findOne({_id:req.body.organisationId})
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
export function addUser(req,res){
  return Organisation.findOne({_id:req.body.organisationId})
                      .then((org)=>{
                        console.log()
                        if(org){
                          org.members.push(req.body.userId);
                          org.save();
                          res.send(org);
                        }

                      })
}
// Creates a new Organisation in the DB
export function create(req, res) {
  console.log(req.body);
  var newOrganisation = new Organisation(req.body);
  newOrganisation.status = 'pending';
  newOrganisation.save()
    .then(() =>{
      console.log("black magic");
    })
    .catch(handleError(res));
}

// Upserts the given Organisation in the DB at the specified ID
export function upsert(req, res) {
  console.log("hi");
  console.log(req.body);
  if(req.body._id) {
    delete req.body._id;
  }
  return Organisation.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Organisation in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Organisation.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Organisation from the DB
export function destroy(req, res) {
  return Organisation.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
