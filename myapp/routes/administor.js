const express = require('express');
const router = express.Router();
const userRouterUrl = '/user';
const userValidator = require('../public/javascripts/userValidator.js');
const encrypt = require('../public/javascripts/encrypt.js')
const debug = require('debug')('administor')
let userCollection;

router.all('*', function(req, res, next){
  if (!req.user)
    res.redirect(userRouterUrl + '/login');
  next();
})

router.get('/index', function(req, res, next){
  res.render('administorIndex', {user : req.user});
})

router.post('/addUser', function(req, res, next){
  var user = JSON.parse(req.body.user);
  var userValid = userValidator.userValid(user)
  if (!userValid)
    res.end('invalid user');
  // 若webClass存在且id不重复才可
  encrypt.encryptPassword(user.password).then((hashedPassword) => {
    user.password = hashedPassword;
    return userCollection.insertOne(user);
  }).then((r) => {
    res.end(JSON.stringify({ok : r.result.ok}));
  }).catch((error) => {
    debug(error);
  })
})

router.post('/addWebClass', function(req, res, next){
  let webClass = JSON.parse(req.body.webClass);
  webClassCollection.insertOne(webClass)
  .then((r) => {
    res.end(JSON.stringify({ok : r.result.ok}));
  }).catch((error) => {
    debug(error);
  })
  // 若无重复webClass才可
});

router.post('/divideGroup', function(req, res, next){
  let groupSetting = JSON.parse(req.body.groupSetting);
  console.log(groupSetting);
  userCollection.find({
    'webClass.grade' : groupSetting.webClass.grade,
    'webClass.number' : groupSetting.webClass.number,
    'group' : null
  }).toArray()
  .then((studentsWithoutGroup) => {
    console.log(studentsWithoutGroup);
    res.end(JSON.stringify({ok : true}));
  })
})

function initialize(db){
  userCollection = db.collection('user');
  webClassCollection = db.collection('webClass');
}

module.exports = {
  router : router,
  initialize : initialize
}