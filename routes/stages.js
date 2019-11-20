/*
stages.js
CRUD + Routes for Stages
*/

//import express + create router for Stages
var express = require('express');
var router = express.Router();
var Stage = require('../models/stage');
var Performances = require('../models/performance');
var Artist = require('../models/artist');


//*GET* stages creation form
router.get('/create', async(req, res) => {
  const performances = await Performances.find();
  res.render('stage/create', {performances})
});

//*POST* create stage after form completion
router.post('/create', async(req, res) => {
  //require form
  const body = req.body;
  
  //create new stage 
  const newStage = new Stage(body);
  const stage = await newStage.save();
  res.redirect(`/stage/${stage._id}`);
});

/* GET stage page. */
router.get('/', async(req,res) => {
    const stages = await Stage.find();

    res.render('stage/index', {stages});
});

//*GET* Detailed View of single Stage
router.get('/:id', async (req,res) =>{
  const id = req.params.id;

  //find selected id from url
  const stage = await Stage.findById(id);
  const performers = stage.performance
  const artists = Artist.find()
  const perfObjs = []
  const artObjs = []
  for (const obj of performers){
    perfObjs.push(await Performances.findById(obj))
  }
  res.render('stage/details', {stage, perfObjs, artObjs});
});

async function getInfo(performs){
  var perfObjs = []
  for (const element of performs){
    var obj = await Performances.findById(element)
    perfObjs.push(obj)
  }
  return perfObjs
}

// Delete Stage (GET)
router.get('/:id/delete',async(req,res) =>{
  const id = req.params.id;
  
  const stage = await Stage.findByIdAndDelete(id);
  res.redirect('/stage');
}); 

//*GET* Update Form
router.get('/:id/update', async(req, res) => {
  const id = req.params.id;

  //find artist by id and update
  const stage = await Stage.findById(id);
  const performances = await Performances.find();
  res.render('stage/update', { stage, performances});
});

//UPDATE the stage
router.post('/:id/update', async (req,res) =>{
  //require form
  const id = req.params.id;
  const body = req.body;

  const stage = await Stage.findByIdAndUpdate(id, body);

  res.redirect(`/stage/${stage._id}`);
});

module.exports = router;