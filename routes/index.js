var express = require('express');
var router = express.Router();
var username; 
/* GET home page. */
router.get('/', function(req, res, next) {
  try{
    username = req.user.username
  }catch(exception){
    username = ""
  }
  res.render('index', { title: 'Woodstock Online', username });
});

module.exports = router;
