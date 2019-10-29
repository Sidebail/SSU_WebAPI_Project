/*
stages.js
CRUD + Routes for Stages
*/

//import express + create router for Stages
var express = require('express');
var router = express.Router();
var Stage = require('../models/stage');

//TO DO BELOW


//*GET* stages creation form
router.get('/create', (req, res) => res.render('stage/create'));

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


  res.render('stage/details', {stage});
});

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

  res.render('stage/update', { stage });
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