/*
artists.js
CRUD + Routes for Artists
*/

//import express + create router for Artist
const _ = require('lodash');
var express = require('express');
var router = express.Router();
var Artist = require('../models/Artist');

/*require authentication for certain routes
const requireAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    
    return res.redirect('/login');
  };
*/



//*GET* artist creation form
router.get('/create', (req, res) => res.render('artist/create'));

//*POST* create artist after form completion
router.post('/create', async (req, res) => {
  try {
    const data = _.pick(req.body, ['name', 'notes', 'image']);
    const artist = await Artist.create(data);
    res.redirect(`/artist/${artist._id}`);
  }
  catch (error) {
    console.error(error.message);
    res.status(500).end('Something went wrong');
  }
});

/* GET artist page. */
router.get('/', async(req,res) => {
    const artists = await Artist.find({deleted: false}).lean();
    res.render('artist/index', {artists});
});

//*GET* Detailed View of single Artist
router.get('/:id', async (req,res) =>{
  try {
    const {id} = req.params;
    const artist = await Artist.findOne({_id: id, deleted: false}).lean();
    if (!artist) {
      return res.status(404).end('Artist not found');
    }
    res.render('artist/details', {artist});
  }
  catch (error) {
    console.error(error.message);
    res.status(500).end('Something went wrong');
  }
});

// Delete Artist (GET)
router.get('/:id/delete',async(req,res) =>{
  try {
    const {id} = req.params;
    const artist = await Artist.findOne({_id: id});
    if (!artist) {
      return res.status(404).end('Artist not found');
    }
    artist.deleted = true;
    await artist.save();
    res.redirect('/artist');
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
    const artist = await Artist.findOne({_id: id, deleted: false}).lean();
    if (!artist) {
      return res.status(404).end('Artist not found');
    }
    res.render('artist/update', { artist });
  }
  catch (error) {
    console.error(error.message);
    res.status(500).end('Something went wrong');
  }
});

//UPDATE the artist
router.post('/:id/update', async (req,res) =>{
  try {
    const {id} = req.params;
    const data = _.pick(req.body, ['name', 'notes', 'artists']);
    
    const artist = await Artist.findOne({_id: id, deleted: false});
    if (!artist) {
      return res.status(404).end('Artist not found');
    }
    
    Object.assign(artist, data);
    await artist.save();

    res.redirect(`/artist/${artist._id}`);
  }
  catch (error) {
    console.error(error.message);
    res.status(500).end('Something went wrong');
  }
});

module.exports = router;