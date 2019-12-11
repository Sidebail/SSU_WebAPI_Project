const passport = require('passport');
const express = require('express');
const router = express.Router();
const User = require('../models/newUser');

router.get('/login', (req, res) => res.render('login', {buttonText: 'Login'}));

router.post('/login', passport.authenticate('local',{
    failureRedirect: '/login',
    successRedirect: '/'
}));

router.get('/register', (req,res) => res.render('login', { buttonText: 'Register'}));

router.post('/register', (req, res) => {
    User.register(
        new User({ username: req.body.username, role: "common" }),
        req.body.password,
        function(err, account) {
            if(err) {
                console.log(err);
                return res.render('register', { account: account });
            }

            passport.authenticate('local')(req, res, function(){
                res.redirect('/');
            });
        }
    );
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/login');
    });
});

module.exports = router;