var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient
var localStrategy = require('passport-local').Strategy

//session and passpost
var session = require('express-session')
var flash = require('express-flash');
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);

var index = require('./routes/index');
var users = require('./routes/users');

//connect to mongodb
var dbUrl = 'mongodb://localhost:27017/ma';
var dbInstance;
var Users;
MongoClient.connect(dbUrl).then((db) => {
  dbInstance = db;
  console.log(dbInstance);
  Users = db.collection('users');
})

//serialize and deserialize
passport.serializeUser(function(user, done) {
  console.log('serializing');
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser');
  Users.findOne({id : id}, function(err, user){
    console.log('find the user again');
    console.log(user);
    done(err, user);
  });
});

//-------------------------------------------
//prepare passport strategy
passport.use(new localStrategy({
    usernameField: 'name',
    passwordField: 'password'
  },
  function(name, password, done) {
    console.log('start identifying');
    Users.findOne({ name: name }, function(err, user) {
      if (user)
        console.log(user);
      else
        console.log('no user');
      if (err) { 
        console.log(err);
        return done(err); }
      if (!user) {
        console.log('无此用户');
        return done(null, false, { message: '用户名不存在.' });
      }
      if (user.password != password) {
        console.log('密码不匹配');
        return done(null, false, { message: '密码不匹配.' });
      }
      return done(null, user);
    });
  }
));


//-------------------------------------------
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//session and passpost
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
  store: new MongoStore({ url: dbUrl })
}))
app.use(passport.initialize());
app.use(passport.session());

//-----------------------------------------------------
//get and post
app.get('/login', function(req, res, next){
  res.render('login');
});


app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { 
      console.log('login fail');
      return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/logout');
    });
  })(req, res, next);
});

app.get('/logout', function(req, res){
  console.log('in logout');
  console.log(req.user);
  res.render('logout', {user : req.user});
})

app.post('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});


//-------------------------------------
//use router
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
