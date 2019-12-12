/*
stages.js
CRUD + Routes for Stages
*/

//import express + create router for Stages
const _ = require('lodash');
var express = require('express');
var router = express.Router();
var Stage = require('../models/stage');
var Stages = require('../models/stage');
var Artist = require('../models/artist');

//require authentication for certain routes
const requireAuth = (req, res, next) => {
  if(req.user == null || req.user.role == "common"){
    return res.status(404).end('Never should have come here!');
  }
  if (req.user.role == "admin") return next();
  
  return res.redirect('/login');
};

//*GET* stages creation form
router.get('/create', requireAuth, async(req, res) => {
  res.render('stage/create', {})
});

//*POST* create stage after form completion
router.post('/create', requireAuth, async (req, res) => {
  var user = req.user
  try {
    const data = _.pick(req.body, ['name', 'notes', 'size', 'image']);
    const stage = await Stage.create(data);
    res.redirect(`/stage/${stage._id}`);
  }
  catch (error) {
    console.error(error.message);
    res.status(500).end('Something went wrong');
  }
});

/* GET stage page. */
router.get('/', async(req,res) => {
  var user = req.user
  try {
    const stages = await Stage.find({$or: [{deleted: false}, {deleted: {$exists: false}}]}).lean();
    res.render('stage/index', {stages, user});
  }
  catch (error) {
    console.error(error.message);
    res.status(500).end('Something went wrong');
  }
});

//*GET* Detailed View of single Stage
router.get('/:id', async (req,res) =>{
  var user = req.user
  try {
    const {id} = req.params;
    const stage = 
      await Stage
        .findOne({_id: id, $or: [{deleted: false}, {deleted: {$exists: false}}]})
        .lean();
    if (!stage) {
      return res.status(404).end('Stage not found');
    }
    res.render('stage/details', {stage, user});
  }
  catch (error) {
    console.error(error.message);
    res.status(500).end('Something went wrong');
  }
});

// Delete Stage (GET)
router.get('/:id/delete', requireAuth, async(req,res) =>{
  var user = req.user
  try {
    const {id} = req.params;
    const stage = await Stage.findOne({_id: id});
    if (!stage) {
      return res.status(404).end('Stage not found');
    }
    stage.deleted = true;
    await stage.save();
    res.redirect('/stage');
  }
  catch (error) {
    console.error(error.message);
    res.status(500).end('Something went wrong');
  }
}); 

//*GET* Update Form
router.get('/:id/update', requireAuth, async(req, res) => {
  try {
    const {id} = req.params;
    const stage = await Stage.findOne({_id: id, deleted: false}).lean();
    if (!stage) {
      return res.status(404).end('Stage not found');
    }
    res.render('stage/update', { stage });
  }
  catch (error) {
    console.error(error.message);
    res.status(500).end('Something went wrong');
  }
});

//UPDATE the stage
router.post('/:id/update', requireAuth, async (req,res) =>{
  var user = req.user
  try {
    const {id} = req.params;
    const data = _.pick(req.body, ['name', 'notes', 'size', 'image']);
    
    const stage = await Stage.findOne({_id: id, deleted: false});
    if (!stage) {
      return res.status(404).end('Stage not found');
    }
    
    Object.assign(stage, data);
    await stage.save();

    res.redirect(`/stage/${stage._id}`);
  }
  catch (error) {
    console.error(error.message);
    res.status(500).end('Something went wrong');
  }
});


module.exports = router;