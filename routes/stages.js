/*
stages.js
CRUD + Routes for Stages
*/

//import express + create router for Stages
const _ = require('lodash');
var express = require('express');
var router = express.Router();
var Stage = require('../models/Stage');
var Stages = require('../models/Stage');
var Artist = require('../models/Artist');


//*GET* stages creation form
router.get('/create', async(req, res) => {
  res.render('stage/create', {})
});

//*POST* create stage after form completion
router.post('/create', async (req, res) => {
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
  try {
    const stages = await Stage.find({$or: [{deleted: false}, {deleted: {$exists: false}}]}).lean();
    res.render('stage/index', {stages});
  }
  catch (error) {
    console.error(error.message);
    res.status(500).end('Something went wrong');
  }
});

//*GET* Detailed View of single Stage
router.get('/:id', async (req,res) =>{
  try {
    const {id} = req.params;
    const stage = 
      await Stage
        .findOne({_id: id, $or: [{deleted: false}, {deleted: {$exists: false}}]})
        .lean();
    if (!stage) {
      return res.status(404).end('Stage not found');
    }
    res.render('stage/details', {stage});
  }
  catch (error) {
    console.error(error.message);
    res.status(500).end('Something went wrong');
  }
});

// Delete Stage (GET)
router.get('/:id/delete', async(req,res) =>{
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
router.get('/:id/update', async(req, res) => {
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
router.post('/:id/update', async (req,res) =>{
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