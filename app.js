var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
//import mongoose
var mongoose = require('mongoose')

//Import auth packages
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GithubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const VKontakteStrategy = require('passport-vkontakte').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('./models/newUser');

 
//connect mongoose
mongoose.connect(`mongodb+srv://adminguy:NLYzNnEkhcZmhxaK@musicfestapi-nrzaw.mongodb.net/test?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true  //avoid deprec. warning
});

//mongoose variables
var db = mongoose.connection;
db.on('error', err => console.error(err));
db.once('open', () => console.log('Mongo Connection Successful!'));


// Routes variables
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var artistRouter = require('./routes/artists');
var stageRouter = require('./routes/stages');
var performanceRouter = require('./routes/performances')
var authRouter = require('./routes/newAuth')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//initialize and use sessions
//session management
app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

app.use('/', authRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/artist', artistRouter);
app.use('/stage', stageRouter);
app.use('/performance', performanceRouter);





//GITHUB AUTHENTICATION

passport.use(
  new GithubStrategy(
    {
      //clientID: process.env.GITHUB_CLIENT_ID,
      clientID: `da22e3122be35fb158f8`,
      //clientSecret: process.env.GITHUB_CLIENT_SECRET,
      clientSecret: `3f5afed4d5ec5e258d708c2d07822af1101fc8da`,
      //callbackURL: process.env.GITHUB_CALLBACK_URL
      callbackURL: `http://localhost:3000/auth/github/callback`
    },
    function(accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ githubId: profile.id }, function(err, user) {
        return cb(err, user);
      });
    }
  )
);



/*
//Google Authentication

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, cb) {
      console.log(profile);
      User.findOne({ googleId: profile.id }, function(err, user) {
        if (!err && !user) {
          const newgoogle = new User({ ...profile, googleId: profile.id });
          newgoogle.save();
          return cb(null, newgoogle);
        } else {
          return cb(err, user);
        }
      });
    }
  )
);


//Twitter Authentication
passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.TWITTER_CALLBACK_URL
},
function(token, tokenSecret, profile, cb) {
  User.findOrCreate({ twitterId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));


//VKontakte Authentication
passport.use(new VKontakteStrategy({
  clientID:     process.env.VKONTAKTE_APP_ID, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
  clientSecret: process.env.VKONTAKTE_APP_SECRET,
  callbackURL:  process.env.VKONTAKTE_CALLBACK_URL
},
function(accessToken, refreshToken, params, profile, done) {
  // console.log(params.email); // getting the email
  User.findOrCreate({ vkontakteId: profile.id }, function (err, user) {
    return done(err, user);
  });
}
));


//Facebook Authentication
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));
*/





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
