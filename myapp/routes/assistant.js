const express = require('express');
const router = express.Router();
const debug = require('debug')('Assistant');
const path = require('path');
const Assistant = require('../userDefinition/assistant.js');
const Homework = require('../userDefinition/homework.js');

const assistantRouterUrl = '/assistant';


function initializeDatabase(db){
    Assistant.initializeDatabase(db);
}
router.use(function(req, res, next){
  req.assistant = new Assistant(req.user);
  next();
})

router.get('/index', function(req, res, next){
  Assistant.homeworkCollection.find()
  .toArray()
  .then((_homeworks) => {
    let homeworks = _homeworks.map((homework) => new Homework(homework));
    res.render('assistantIndex', {homeworks : homeworks});
  })
});


router.get('/profile', function(req, res, next){
  let getGroupMates = (webClass) => {
    return Assistant.webClassCollection
      .findOne({'grade' : webClass.grade,
                'number' : webClass.number})
      .then((webClass) => {
        let getProfiles = webClass.assistantList.map((assistantId) => {
          return Assistant.userCollection.findOne({id : assistantId});
        });
        return Promise.all(getProfiles);
      })
  };
  getGroupMates(req.assistant.webClass).then((groupMates) => {
    debug(req.assistant, groupMates);
    res.render('assistantProfile', 
              {user : req.assistant,
              groupMates : groupMates});
  })
});

router.use('/homework/:homeworkName', function(req, res, next){
  let ifMissionExist = (homeworkName) => {
    return Assistant.missionCollection
            .findOne({recipient : req.assistant.id,
                      homeworkName : homeworkName});
  };
  ifMissionExist(req.params.homeworkName).then((mission) => {
    if (!mission){
      return res.redirect(`${assistantRouterUrl}/index`);
    }
    req.mission = mission;
    debug("mission is ", req.mission);
    next();
  })
});

router.get('/homework/:homeworkName', function(req, res, next){
  debug("in homework");
  try{debug('in router :homeworkName');
  let homeworkName = req.params.homeworkName;
  let assistantId = req.assistant.id;
  debug(homeworkName);
  let getReview = (revieweeId, assistantId) => { // 得到reviewee的评论
    return Assistant.reviewCollection.findOne({
      revieweeId : revieweeId,
      reviewerId : assistantId
    });
  };
  let getMission = (homeworkName, revieweeId) => {
    return Assistant.missionCollection.findOne({
             homeworkName : homeworkName,
             recipient : revieweeId
           });
  }
  let getRevieweeReviewAndDownload = function (revieweeIds){
    let getRevieweeMissions = [];
    revieweeIds.forEach((revieweeId, index) => {
      getRevieweeMissions.push(getMission(homeworkName, revieweeId));
    });
    let reviewees = [];
    let getReviewees = Promise.all(getRevieweeMissions).then((missions) => { // 过滤出有提交代码和图片的同学
      uploadedMissions = missions.filter((mission) => { 
        return mission.code && mission.image;
      });
      return uploadedMissions; 
    }).then((missions) => { // 得到他们的评论
      let getReviews = [];
      missions.forEach((mission, index) => {
        let revieweeId = mission.recipient;
        getReviews.push(getReview(revieweeId, assistantId));
        reviewees[index] = {};
        reviewees[index].code = mission.code;
        reviewees[index].image = mission.image;
      });
      return Promise.all(getReviews);
    }).then((reviews) => { // 加工结果
        reviews.forEach((review, index) => {
          reviewees[index].review = review;
        });
        return reviewees;
    });
    return getReviewees;
  };
  let revieweeList = req.mission.revieweeList;
  return getRevieweeReviewAndDownload(revieweeList)
                  .then((reviewees) => {
                    res.render('assistantHomework',
                      {
                        homeworkName : homeworkName,
                        reviewees : reviewees
                      }
                    );
                  });
  }catch(err){
    console.log(err);
  }
});


router.post('/homework/:homeworkName/review/revise', function(req, res, next){
  debug(req.params);
  debug(req.body);
  let review = JSON.parse(req.body.review);
  let homeworkName = req.params.homeworkName;
  let reviewerId = req.assistant.id;
  let revieweeId = review.revieweeId;
  let comment = review.comment;
  Assistant.reviewCollection
  .updateOne(
    {
      homeworkName : homeworkName,
      reviewerId : req.assistant.id,
      revieweeId : revieweeId
    },
    {$set : {
    comment : comment
    }
  })
  .then((r) => {
    let success = r.result.n > 0;
    return res.end(JSON.stringify({success : success}));
  });
                  
});

router.use('/homework/:homeworkName/download/', function(req, res, next){
  if (!req.query.revieweeId)
    return res.end(JSON.stringify({success : false}));
  let revieweeId = JSON.parse(req.query.revieweeId);
  Assistant.missionCollection
  .findOne({
    homeworkName : req.mission.homeworkName,
    recipient : req.query.revieweeId
  }).then((mission) => {
    debug(mission);
    if (!mission)
      return falseResponse(res);
    req.revieweeMission = mission;
    next();
  })
});


router.get('/homework/:homeworkName/download/image', function(req, res, next){
  var dir = homeworkDir(req.params.homeworkName, req.revieweeMission, "image");
  res.download(dir);
})

router.get('/homework/:homeworkName/download/code', function(req, res, next){
  var dir = homeworkDir(req.params.homeworkName, req.revieweeMission, "code");
  res.download(dir);
})

function homeworkDir(homeworkName, mission, property){
  return path.join(__dirname, '../uploads', homeworkName, mission.recipient, mission[property]);
}

function falseResponse(res){
  return res.end(JSON.stringify({success : false}));
}

function successResponse(res){
  return res.end(JSON.stringify({success : true}));
}

module.exports = {
  router : router,
  initializeDatabase : initializeDatabase
};
