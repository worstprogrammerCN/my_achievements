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
  var promiseArray = [];
  try{
    if (user.identity == 'assistant') // 把助教插入到webClass的助教列表里
      promiseArray.push(
        webClassCollection.updateOne(
          {'grade' : user.webClass.grade,
          'number' : user.webClass.number
        }, {$push : {assistantList : user.id}})
      );
    
    promiseArray.push( // 向user集合添加user
      encrypt.encryptPassword(user.password).then((hashedPassword) => {
        user.password = hashedPassword;
        return userCollection.insertOne(user);
      })
    )
    Promise.all(promiseArray)
    .then((r) => {
      debug(r);
      res.end(JSON.stringify({ok : true}));
    }).catch((error) => {
      console.log(error);
      debug(error);
      res.end(JSON.stringify({ok : false}));
    })
  }catch(error){
    console.log(error);
  }
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
      let addStudentToGroupPromise = webGroupCollection.updateOne({ // 向webClass的members添加student的id
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
});

router.post('/distributeReview', function(req, res, next){
  try{

  let distributeSetting = JSON.parse(req.body.distributeSetting);
  debug(distributeSetting)
  let getWebGroups = webGroupCollection.find({
    'webClass.grade' : distributeSetting.webClass.grade,
    'webClass.number' : distributeSetting.webClass.number
  }).toArray();
  debug(distributeSetting.webClass.grade,distributeSetting.webClass.number)
  let getAssistants = webClassCollection.findOne({
    'grade' : distributeSetting.webClass.grade,
    'number' : distributeSetting.webClass.number 
  }).then((webClass) => {
    return webClass.assistantList;
  });
  Promise.all([getWebGroups, getAssistants]).then(([webGroups, assistants]) => {
    
    let shiftTimes = Math.floor(Math.random() * (webGroups.length - 1)) + 1; // 第i个组评论第i + shiftTimes个组
    let promises = [];
    for(let i = 0; i < webGroups.length; i++){ // assign for students
      let reviewerMembers = webGroups[i].members;
      let reviewedMembers = webGroups[(i + shiftTimes) % webGroups.length].members;
      debug(reviewerMembers);
      debug(reviewedMembers);
      for(let j = 0; j < reviewerMembers.length; j++){
        for(let k = 0; k < reviewedMembers.length; k++){
          let reviewerId = reviewerMembers[j];
          let revieweeId = reviewedMembers[k];
          debug('reviewer', reviewerId);
          debug('reviewee', revieweeId);
          let updateReviewer = missionCollection.update({
            'recipient' : reviewerId,
            'homeworkName' : distributeSetting.homeworkName
          }, {$set : {
            'recipient' : reviewerId,
            'homeworkName' : distributeSetting.homeworkName
          }, $push : {
            revieweeList : revieweeId
          }}, {upsert : true, w : 1});
          let updateReviewee = missionCollection.update({
            'recipient' : revieweeId,
            'homeworkName' : distributeSetting.homeworkName
          }, {$set : {
            'recipient' : revieweeId,
            'homeworkName' : distributeSetting.homeworkName
          }, $push : {
            reviewerList : reviewerId
          }}, {upsert : true, w : 1});
          promises.push(updateReviewer);
          promises.push(updateReviewee);
        }
      }
    }
    // ------------------------
    // assign for assistants
    debug(webGroups, assistants);
    // webGroups.sort(() => {return 0.5 - Math.random()}); // 打乱各组顺序
    debug(assistants);
    let reviewCount = parseInt(webGroups.length / assistants.length); // 每个TA至少评论的组数
    let leftCount = webGroups.length % assistants.length // 剩下的要一个个分配给TA评论的组数
    for(let i = 0; i < assistants.length; i++){
      let assistantId = assistants[i];
      for(let j = 0; j < reviewCount; j++){
        debug(i * reviewCount + j);
        let webGroupMembers = webGroups[i * reviewCount + j].members;
        for(k = 0; k < webGroupMembers.length; k++){
          let revieweeId = webGroupMembers[k];
          let assignForAssistant = missionCollection.updateOne({
            'recipient' : assistantId,
            'homeworkName' : distributeSetting.homeworkName
          }, {$set : {
            'recipient' : assistantId,
            'homeworkName' : distributeSetting.homeworkName
          }, $push : {
            'revieweeList' : revieweeId
          }}, {upsert : true, w : 1})
          promises.push(assignForAssistant);
        }
      }
    }
    let startIndexInLeftGroups = reviewCount * assistants.length;
    for(let i = leftCount; i > 0; i--){
      let webGroupMembers = webGroups[webGroups.length - leftCount].members;
      let assistantId = assistants[i];
      for(let j = 0; j < webGroupMembers.length; j++){
        let revieweeId = webGroupMembers[j];
        let assignForAssistant = missionCollection.updateOne({
          'recipient' : assistantId,
          'homeworkName' : distributeSetting.homeworkName
        }, {$set : {
          'recipient' : assistantId,
          'homeworkName' : distributeSetting.homeworkName
        }, $push : {
          'revieweeList' : revieweeId
        }}, {upsert : true, w : 1})
        promises.push(assignForAssistant);
      }
    }

    return promises;
  }).then(() => {
    res.end(JSON.stringify({ok : true}));
  }).catch((error) => {
    console.log(error);
    res.end(JSON.stringify({ok : false}));
  })
  }
  catch(error){
    console.log(error);
    res.end(JSON.stringify({ok : false}));
  }
})

function initialize(db){
  userCollection = db.collection('user');
  webClassCollection = db.collection('webClass');
  webGroupCollection = db.collection('webGroup');
  missionCollection = db.collection('mission');
}

module.exports = {
  router : router,
  initialize : initialize
}