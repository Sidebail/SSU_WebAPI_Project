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
  let {sort, order} = req.query; // performance?sort=name&order=asc
  if (!sort) sort = "name";
  if (!order) order = 'asc';
  const sorting = sort, ordering = order;
  sort = {
    [sort]: order === 'desc' ? -1 : 1
  };

  let query = {};
  let {q} = req.query;
  if (!q) q = '';
  q = q.trim();
  if (q.length >= 2) {
    query = {
      $or: [
        {name: new RegExp(`^${q}`, "i")},
        {name: new RegExp(`${q}`, "i")},
        {name: new RegExp(`${q}$`, "i")},
        {notes: new RegExp(`^${q}`, "i")},
        {notes: new RegExp(`${q}`, "i")},
        {notes: new RegExp(`${q}$`, "i")},
        /*
        {"stages.one": new RegExp(`^${q}`, "i")},
        {"stages.one": new RegExp(`${q}`, "i")},
        {"stages.one": new RegExp(`${q}$`, "i")},
        */
      ]
    };
  }
  const performances = await Performance.find(query).sort(sort).lean();
  res.render('performance/index', {performances, sorting, ordering, q});
});

//*GET* Detailed View of single performance
router.get('/:id', async (req,res) =>{
  const id = req.params.id;
  if(id == "5dd70b631c9d44000047006c")
  {
    //do nothing because this is the "None." template
  }
  else
  {
    //find selected id from url
    const performance = await Performance.findById(id);
    const artist = await Artists.findById(performance.artist);
  
    res.render('performance/details', {performance, artist});
  }
});

// Delete Performance (GET)
router.get('/:id/delete',async(req,res) =>{
  const id = req.params.id;
  if(id == "5dd70b631c9d44000047006c"){ /*do nothing because it's a template */ }
  else
  {
    const performance = await Performance.findByIdAndDelete(id);
    res.redirect('/performance');
  }
}); 

//*GET* Update Form
router.get('/:id/update', async(req, res) => {
  const id = req.params.id;
  if(id == "5dd70b631c9d44000047006c"){ /*do nothing because it's a template */ }
  else
  {
    //find performance by id and update
    const performance = await Performance.findById(id);
    const artist = await Artists.find();

    res.render('performance/update', { performance, artist });
  }
});

//UPDATE the performance
router.post('/:id/update', async (req,res) =>{
  //require form
  const id = req.params.id;
  if(id == "5dd70b631c9d44000047006c"){ /*do nothing because it's a template */ }
  else
  {
    const body = req.body;
    const performance = await Performance.findByIdAndUpdate(id, body);
    res.redirect(`/performance/${performance._id}`);
  }
});

module.exports = router;