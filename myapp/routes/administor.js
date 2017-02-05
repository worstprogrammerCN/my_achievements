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
    res.end(JSON.stringify({ok : false}));
  // 若webClass存在且id不重复才可
  encrypt.encryptPassword(user.password).then((hashedPassword) => {
    user.password = hashedPassword;
    return userCollection.insertOne(user);
  }).then((r) => {
    res.end(JSON.stringify({ok : r.result.ok}));
  }).catch((error) => {
    debug(error);
    res.end(JSON.stringify({ok : false}));
  })
})

router.post('/addWebClass', function(req, res, next){
  let webClass = JSON.parse(req.body.webClass);
  debug(webClass);
  webClassCollection.insertOne(webClass)
  .then((r) => {
    res.end(JSON.stringify({ok : r.result.ok}));
  }).catch((error) => {
    console.log(error)
    res.end(JSON.stringify({ok : false}));
  })
  // 若无重复webClass才可
});

router.post('/divideGroup', function(req, res, next){
  let divideSetting = JSON.parse(req.body.divideSetting);
  userCollection.find({
    'webClass.grade' : divideSetting.webClass.grade,
    'webClass.number' : divideSetting.webClass.number
  }).toArray()
  .then((studentsWithoutGroup) => {
    let groupCount = Math.ceil(studentsWithoutGroup.length / divideSetting.maxNumber);
    studentsWithoutGroup.sort(() => {return 0.5 - Math.random()});
    let promises = [];
    for(var index = 0; index < studentsWithoutGroup.length; index++){
      let student = studentsWithoutGroup[index];
      let group = parseInt(index / groupCount) + 1;
      debug('index, groupCount, group:', index, groupCount, group); 
      let addStudentToGroupPromise = webGroupCollection.updateOne({
          'webClass.grade' : student.webClass.grade,
          'webClass.number' : student.webClass.number,
          'number' : group
      }, {$set : {
        'webClass' : {
          'grade' : student.webClass.grade,
          'number' : student.webClass.number
        },
        'number' : group
      }, $push : {'members' : student.id}}, {upsert : true, w : 1});
      // let addStudentToGroupPromise = webGroupCollection.findOne({ // find if exist
      //   'webClass.grade' : student.webClass.grade,
      //   'webClass.number' : student.webClass.number,
      //   'number' : group
      // }).then((webGroup) => { // create webGroup
      //   debug('webGroup', webGroup);
      //   if (!webGroup)
      //     return webGroupCollection.insertOne({
      //       'webClass' : {
      //         'grade' : student.webClass.grade,
      //         'number' : student.webClass.number
      //       },
      //       'number' : group
      //     });
      // }).then(() => { // add student to webGroup
      //   debug('student.id', student.id);
      //   return webGroupCollection.updateOne({
      //     'webClass.grade' : student.webClass.grade,
      //     'webClass.number' : student.webClass.number,
      //     'number' : group
      //   }, {$push : {members : student.id}})
      // });
      let updateStudentGroupPromise = userCollection
                                     .updateOne({id : student.id}
                                              , {$set : {group : group}});
      debug(addStudentToGroupPromise,
      updateStudentGroupPromise);
      promises.push(addStudentToGroupPromise,
                    updateStudentGroupPromise);
    }
    return Promise.all(promises);
  }).then((r) => {
    res.end(JSON.stringify({ok : true}));
  }).catch((error) => {
    console.log(error);
    res.end(JSON.stringify({ok : false}));
  })
})

function initialize(db){
  userCollection = db.collection('user');
  webClassCollection = db.collection('webClass');
  webGroupCollection = db.collection('webGroup');
}

module.exports = {
  router : router,
  initialize : initialize
}