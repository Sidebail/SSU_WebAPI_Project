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

/* GET artist page. */
router.get('/', async(req,res) => {
    //below this line will only execute when this is finished
    
    res.render('artist/index', {title: "kevin" });
});
module.exports = router;