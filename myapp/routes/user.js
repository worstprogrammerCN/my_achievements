const express = require('express');
const encrypt = require('../public/javascripts/encrypt.js');
const debug = require('debug')('user.js')
const router = express.Router();
var userRouterUrl = '/user';

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next){
  res.render('login');
})

router.post('/login', function(req, res, next){
  _passport.authenticate('local', function(err, user, info) {
    var result = {
        loginSuccess : true,
        identity : null
    }
    if (err) { return next(err); }
    if (!user) { 
      result.loginSuccess = false;
      return res.end(JSON.stringify(result));
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      result.identity = user.identity;
      return res.end(JSON.stringify(result));
    });
  })(req, res, next);
})

router.post('/logout', function(req, res){
  req.logout();
  res.redirect(userRouterUrl + '/login');
})

function loginStrategy(id, password, done){
  let _user = undefined;
  userCollection.findOne({id :  id}).then((user) => {
    if (!user)
      return done(null, false, { message: '用户名不存在.' }); // user not found
    _user = user;
    return encrypt.comparePassword(password, user.password);
  }).then((passwordIsCorrect) => {
    if (!passwordIsCorrect)
      return done(null, false, { message: '密码不匹配.' }); // password incorrect
    else
      return done(null, _user); // password correct
  }).catch((error) => {
    debug(error);
    return done(error);
  });
}

function initialize(passport, localStrategy, db){
  userCollection = db.collection('user');
  _passport = passport;

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    userCollection.findOne({id : id}, function(err, user){
      done(err, user);
    });
  });
  
  passport.use(new localStrategy({
    usernameField: 'id',
    passwordField: 'password'
  }, loginStrategy));
  
}



module.exports = {
  router : router,
  initialize : initialize
}


  
