/*
artists.js
CRUD + Routes for Artists
*/

//import express + create router for Artist
var express = require('express');
var router = express.Router();
var Artist = require('../models/artist');

/*require authentication for certain routes
const requireAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    
    return res.redirect('/login');
  };
*/



//*GET* artist creation form
router.get('/create', (req, res) => res.render('artist/create'));

//*POST* create artist after form completion
router.post('/create', async(req, res) => {
  const body = req.body;
  //create new artist 
  console.log("create artist");
  const newArtist = new Artist(body);
  const artist = await newArtist.save();
  res.redirect(`/artist/${artist._id}`);
});

/* GET artist page. */
router.get('/', async(req,res) => {
    const artists = await Artist.find();

    res.render('artist/index', {artists});
});

//*GET* Detailed View of 1 Artist
router.get('/:id', async (req,res) =>{
  const id = req.params.id;

  //find selected id from url
  const artist = await Artist.findById(id);


  res.render('artist/details', {artist});
});

module.exports = router;