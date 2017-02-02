const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const saltRounds = 10;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next){
  res.render('login');
})

router.post('/login', function(req, res, next){
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { 
      return res.redirect('/login'); 
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      var indexUrl =  `/${user.identity}s/index`;
      return res.redirect(indexUrl);
    });
  })(req, res, next);
})

router.post('/logout', function(req, res){
  req.logout();
  res.redirect('/user/login');
})

function comparePassword(plainPassword, hashedPassword){ // return a promise with compared result(true or false)
  return bcrypt.compare(plaintextPassword, hashedPassword);
}

function encryptPassword(password){ // return a promise with hashed password
  return bcrypt.hash(myPlaintextPassword, saltRounds);
}

function loginStrategy(id, password, done){
  Users.findOne({id :  id}.then((user) => {
    if (!user)
      return done(null, false, { message: '用户名不存在.' }); // user not found
    return comparePassword(password, user.password);
  }).then((passwordIsCorrect) => {
    if (!passwordIsCorrect)
      return done(null, false, { message: '密码不匹配.' }); // password incorrect
    else
      return done(null, user); // password correct
  }).catch((error) => {
    console.log(error);
    return done(err);
  }));
}

function initialize(passport, localStrategy, db){
  userCollection = db.collection('users');

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


  
