var express = require('express');
var router = express.Router();
var username; 
/* GET home page. */
router.get('/', function(req, res, next) {
  try{
    user = req.user
  }catch(exception){
    user = null
  }
  res.render('index', { title: 'Woodstock Online', user });
});

module.exports = router;
