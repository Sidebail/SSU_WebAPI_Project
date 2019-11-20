/*
performances.js
CRUD + Routes for performances
*/

//import express + create router for performances
var express = require('express');
var router = express.Router();
var Performance = require('../models/performance');
var Artists = require('../models/artist');
/*require authentication for certain routes
const requireAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    
    return res.redirect('/login');
  };
*/



//*GET* performance creation form
router.get('/create', async(req, res) => {
    const artists = await Artists.find();
    res.render('performance/create', {artists});
});

//*POST* create performance after form completion
router.post('/create', async(req, res) => {
  //require form
  const body = req.body;
  
  //create new performance
  const newPerformance = new Performance(body);
  const performance = await newPerformance.save();
  res.redirect(`/performance/${performance._id}`);
});

/* GET performance page. */
router.get('/', async(req,res) => {
    const performances = await Performance.find();

    res.render('performance/index', {performances});
});

//*GET* Detailed View of single performance
router.get('/:id', async (req,res) =>{
  const id = req.params.id;

  //find selected id from url
  const performance = await Performance.findById(id);
  const artist = await Artists.findById(performance.artist);

  res.render('performance/details', {performance, artist});
});

// Delete Performance (GET)
router.get('/:id/delete',async(req,res) =>{
  const id = req.params.id;
  
  const performance = await Performance.findByIdAndDelete(id);
  res.redirect('/performance');
}); 

//*GET* Update Form
router.get('/:id/update', async(req, res) => {
  const id = req.params.id;

  //find performance by id and update
  const performance = await Performance.findById(id);
  const artist = await Artists.find();

  res.render('performance/update', { performance, artist });
});

//UPDATE the performance
router.post('/:id/update', async (req,res) =>{
  //require form
  const id = req.params.id;
  const body = req.body;

  const performance = await Performance.findByIdAndUpdate(id, body);

  res.redirect(`/performance/${performance._id}`);
});

module.exports = router;