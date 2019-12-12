/*
performances.js
CRUD + Routes for performances
*/

//import express + create router for performances
const _ = require('lodash');
var express = require('express');
var router = express.Router();
var Performance = require('../models/performance');
var PerformanceDate = require('../models/PerformanceDate');
var Artists = require('../models/artist');
var Stage = require('../models/stage');

//require authentication for certain routes
const requireAuth = (req, res, next) => {
  if(req.user == null || req.user.role == "common"){
    return res.status(404).end('Never should have come here!');
  }
  if (req.user.role == "admin") return next();
  
  return res.redirect('/login');
};



//*GET* performance creation form
router.get('/create', requireAuth, async(req, res) => {
    const artists = await Artists.find();
    res.render('performance/create', {artists});
});

//*POST* create performance after form completion
router.post('/create', requireAuth, async (req, res) => {
  try {
    const data = _.pick(req.body, ['name', 'notes', 'artists']);
    const performance = await Performance.create(data);
    res.redirect(`/performance/${performance._id}`);
  }
  catch (error) {
    console.error(error.message);
    res.status(500).end('Something went wrong');
  }
});

/* GET performance page. */
router.get('/', async(req,res) => {
  var user = req.user
  let stages = await Stage.find({$or: [{deleted: false}, {deleted: {$exists: false}}]}).lean();
  let {sort, order} = req.query; // performance?sort=name&order=asc
  if (!sort) sort = "createdAt";
  if (!order) order = 'desc';
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
      ]
    };
  }
  query.deleted = false;
  const performances = await Performance.find(query).sort(sort).lean();
  res.render('performance/index', {performances, stages, sorting, ordering, q, user});
});


router.get('/stage', async(req,res) => {
  var user = req.user

  //get stages
  let stages = await Stage.find({$or: [{deleted: false}, {deleted: {$exists: false}}]}).lean();
  
  //get currently selected Stage
  const selectedStage = req.query
  var selectedStageId = selectedStage['stages']

  //get dates by stage
  var performanceDatesByStage = await PerformanceDate.where('stages', selectedStageId)
  
  var dateIdArray = [];
  performanceDatesByStage.forEach(element => {
    dateIdArray.push(element['_id']);
  });
  
  var performanceArray = [];
  var performances = await Performance.find()
  performances.forEach(element => {
    var tempDates = JSON.stringify(element['performanceDates'])
    dateIdArray.forEach(dateIdEle => {
      if(tempDates.includes(dateIdEle)){
        if(!performanceArray.includes(element)){
          performanceArray.push(element);
          console.log(element);
        }
        //nuffin
      }
      else{
        //not a match
      }
    });
  });

  var performances = performanceArray
  q = ""
  var sorting = "createAt";
  var ordering = 'desc';

  //render view
  res.render('performance/index', {performances, stages, sorting, ordering, q, user});
});

//*GET* Detailed View of single performance
router.get('/:id', async (req, res) =>{
  var user = req.user
  try {
    const {id} = req.params;
    const performance = 
      await Performance
        .findOne({_id: id, deleted: false})
        .populate('artists')
        .lean();
    if (!performance) {
      return res.status(404).end('Performance not found');
    }

    let performanceDates = 
      await PerformanceDate
        .find({_id: performance.performanceDates, deleted: false})
        .populate('stages')
        .sort({'startsAt': 1})
        .lean();
    performanceDates = 
      performanceDates.map((performanceDate) => {
        performanceDate.stages = performanceDate.stages.map((stage) => stage.name).join(', ');
        return performanceDate;
      });
    performance.performanceDates = performanceDates;

    const stages = await Stage.find({$or: [{deleted: false}, {deleted: {$exists: false}}]}).lean();

    res.render('performance/details', {performance, stages, user});
  }
  catch (error) {
    console.error(error.message);
    res.status(500).end('Something went wrong');
  }
});

router.post('/:id/dates', async (req, res) =>{
  var user = req.user
  try {
    const {id} = req.params;
    const performance = await Performance.findOne({_id: id, deleted: false});
    if (!performance) {
      return res.status(404).end('Performance not found');
    }

    const data = _.pick(req.body, ['startsAt', 'durationHours', 'stages']);
    data.durationHours = parseFloat(data.durationHours);
    const performanceDate = await PerformanceDate.create(data);

    if (!performance.performanceDates || !Array.isArray(performance.performanceDates)) {
      performance.performanceDates = [];
    }
    performance.performanceDates.push(performanceDate._id);
    await performance.save();

    res.redirect(`/performance/${id}`);
  }
  catch (error) {
    console.error(error.message);
    res.status(500).end('Something went wrong');
  }
});

router.get('/:id/dates/:dateId/delete', requireAuth, async (req, res) =>{
  var user = req.user
  try {
    const {id, dateId} = req.params;
    const performance = await Performance.findOne({_id: id, deleted: false});
    if (!performance) {
      return res.status(404).end('Performance not found');
    }

    const performanceDate = await PerformanceDate.findById(dateId);
    performanceDate.deleted = true;
    performanceDate.save();

    res.redirect(`/performance/${id}`);
  }
  catch (error) {
    console.error(error.message);
    res.status(500).end('Something went wrong');
  }
});

// Delete Performance (GET)
router.get('/:id/delete', requireAuth, async(req,res) =>{
  var user = req.user
  try {
    const {id} = req.params;
    const performance = await Performance.findOne({_id: id});
    if (!performance) {
      return res.status(404).end('Performance not found');
    }
    performance.deleted = true;
    await performance.save();
    res.redirect('/performance');
  }
  catch (error) {
    console.error(error.message);
    res.status(500).end('Something went wrong');
  }
}); 

//*GET* Update Form
router.get('/:id/update', requireAuth, async(req, res) => {
  var user = req.user
  try {
    const {id} = req.params;
    const performance = await Performance.findOne({_id: id, deleted: false}).lean();
    if (!performance) {
      return res.status(404).end('Performance not found');
    }
    const artists = await Artists.find().lean();
    res.render('performance/update', { performance, artists, user });
  }
  catch (error) {
    console.error(error.message);
    res.status(500).end('Something went wrong');
  }
});

//UPDATE the performance
router.post('/:id/update', requireAuth, async (req,res) =>{
  var user = req.user
  try {
    const {id} = req.params;
    const data = _.pick(req.body, ['name', 'notes', 'artists']);
    
    const performance = await Performance.findOne({_id: id, deleted: false});
    if (!performance) {
      return res.status(404).end('Performance not found');
    }
    
    Object.assign(performance, data);
    await performance.save();

    res.redirect(`/performance/${performance._id}`);
  }
  catch (error) {
    console.error(error.message);
    res.status(500).end('Something went wrong');
  }
});

module.exports = router;