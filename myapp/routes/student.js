const express = require('express');
const router = express.Router();
const debug = require('debug')('student');
const Student = require('../userDefinition/student.js');
const Homework = require('../userDefinition/homework.js');
const path = require('path');
const fs = require('fs');
const Busboy = require('busboy');

function initializeDatabase(db){
    Student.initializeDatabase(db);
}
router.use(function(req, res, next){
  req.student = new Student(req.user);
  next();
});

router.all('/homework', function(req, res, next){
  debug('in router.all(/homework)');
  next();
})

router.get('/index', function(req, res, next){
  req.student.getHomeworks().then((_homeworks) => {
    let homeworks = _homeworks.map((homework) => {  // 会附加作业的状态
      return new Homework(homework);
    });
    debug(homeworks);
    res.render('studentIndex', {homeworks : homeworks});

  });
});


router.get('/profile', function(req, res, next){
  var studentWithoutPassword = Student.getUserWithoutPassword(req.student);
  req.student.getGroupmates().then((groupMates) => {
    res.render('studentProfile', {user : studentWithoutPassword
                          , groupMates : groupMates});
  }).catch((err) => {
    console.log(err);
  })
});

router.use('/homework/:homeworkName', function(req, res, next){
  let ifMissionExist = req.student.getMission(req.params.homeworkName);
  ifMissionExist.then((mission) => {
    if (!mission){
      return res.redirect('/student/index');
    }
    req.mission = mission;
    debug("mission is ", req.mission);
    next();
  })
})

router.get('/homework/:homeworkName', function(req, res, next){
  debug('in router :homeworkName');
  let homeworkName = req.params.homeworkName;
  let userId = req.user.id;
  debug(homeworkName);
  let getReviewerReview = function (reviewerIds){
    let reviews = reviewerIds.map((reviewerId) => {
      return Student.reviewCollection.findOne({reviewerId : reviewerId});
    });
    return Promise.all(reviews); 
  }
  let getRevieweeReviewAndDownload = function (revieweeIds){
    let getRevieweeMissions = [];
    for(let i = 0; i < revieweeIds.length; i++){
      let revieweeId = revieweeIds[i];
      let getRevieweeMission = Student.missionCollection.findOne({
        homeworkName : homeworkName,
        recipient : revieweeId,
      });
      getRevieweeMissions.push(getRevieweeMission);
    }
    let getReviewees = Promise.all(getRevieweeMissions).then((missions) => {
      missions = missions.filter((mission) => {
        return mission.code && mission.image;
      });
      debug(missions);
      let getReviews = [];
      for(let j = 0; j < missions.length; j++){
        let revieweeId = missions[j].recipient
        let getRevieweeReview = Student.reviewCollection.findOne({
          revieweeId : revieweeId,
          reviewerId : userId
        });
        getReviews.push(getRevieweeReview);
      }
      RevieweesToReturn = Promise.all(getReviews).then((reviews) => {
        let reviewees = reviews.map((review, index) => {
          reviewee = {
            code : missions[index].code,
            image : missions[index].image,
            review : review
          };
          return reviewee;
        });
        return reviewees;
      })
      return RevieweesToReturn;
    })
    return getReviewees;
  };
  let reviewerList = req.mission.reviewerList;
  let revieweeList = req.mission.revieweeList;
  return Promise.all([getReviewerReview(reviewerList)
                    , getRevieweeReviewAndDownload(revieweeList)])
                  .then(([reviewers, reviewees]) => {
                    debug(reviewers);
                    debug(reviewees);
                    reviewers = reviewers.map((reviewer) => {
                      return {review : reviewer};
                    })
                    res.render('studentHomework'
                        , {homeworkName : homeworkName
                        , reviewees : reviewees
                        , reviewers : reviewers});
                  });
  
});

router.post('/homework/:homeworkName/upload', function(req, res, next){
  var homeworkName = req.params.homeworkName;
  var studentId = req.student.id;
  var busboy = new Busboy({ headers: req.headers });
    let postValue;
    busboy.on('file', function(fieldname, file, uploadFileName, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + uploadFileName + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      let studentDir = path.join(__dirname, '../uploads', homeworkName);
      let homeworkDir = path.join(studentDir, studentId);
      let [ , uploadFileType] = uploadFileName.split('.')
      let savedFileName = `${req.user.id}_${req.user.name}_${req.user.group}.${uploadFileType}`;
      let saveTo = path.join(homeworkDir, savedFileName);
      if (!fs.existsSync(studentDir))
        fs.mkdirSync(studentDir);
      if (!fs.existsSync(homeworkDir))
        fs.mkdirSync(homeworkDir);
      debug(uploadFileType);
      if (!isPicture(uploadFileType) && !isZip(uploadFileType))
        return res.end(JSON.stringify({ok : false, error : 'wrong type'}));
      file.pipe(fs.createWriteStream(saveTo, {flags : 'w+'}));
      file.on('data', function(data) {
        debug('data recieved', data);
        console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
      });
      file.on('end', function() {
        debug(saveTo);
        console.log('File [' + fieldname + '] Finished');
        let updatePromise = Promise.resolve();
        if (isPicture(uploadFileType))
          updatePromise = req.student.updateImg(homeworkName, savedFileName);
        else if (isZip(uploadFileType))
          updatePromise = req.student.updateCode(homeworkName, savedFileName);
        updatePromise.then(() => {
          res.end(JSON.stringify({success : true}));
        }).catch((error) => {
          console.log(error);
          res.end(JSON.stringify({success : false}));
        })
      });
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      console.log('Field [' + fieldname + ']: value: ' + val);
      postValue = val;
    });
    busboy.on('finish', function() {
      console.log('Done parsing form!');
      res.end(JSON.stringify({success : true}));
    });
    req.pipe(busboy);
});

router.post('/homework/:homeworkName/review/revise', function(req, res, next){
  debug(req.params);
  debug(req.body);
  let review = JSON.parse(req.body.review);
  let homeworkName = req.params.homeworkName;
  let reviewerId = req.student.id;
  let revieweeId = review.revieweeId;
  let comment = review.comment;
  reviewCollection.updateOne({homeworkName : homeworkName
                          , reviewerId : req.student.id
                          , revieweeId : revieweeId}
                          , {$set : {
                            comment : comment
                          }})
                  .then((r) => {
                    let success = r.result.n > 0;
                    return res.end(JSON.stringify({success : success}));
                  });
                  
})

router.use('/homework/:homeworkName/download/', function(req, res, next){
  if (!req.query.revieweeId)
    return res.end(JSON.stringify({success : false}));
  let revieweeId = JSON.parse(req.query.revieweeId);
  Student.missionCollection.findOne({homeworkName : req.mission.homeworkName
                                   , recipient : req.query.revieweeId})
                            .then((mission) => {
                              debug(mission);
                              if (!mission)
                                return falseResponse(res);
                              req.revieweeMission = mission;
                              next();
                            })
})

router.get('/homework/:homeworkName/download/image', function(req, res, next){
  let studentDir = path.join(__dirname, '../uploads', req.params.homeworkName);
  let homeworkDir = path.join(studentDir, req.revieweeMission.recipient);
  let image = req.revieweeMission.image;
  let saveDir = path.join(homeworkDir, image);
  debug(saveDir);
  res.download(saveDir);
})

router.get('/homework/:homeworkName/download/code', function(req, res, next){
  debug('in code');
  try{let studentDir = path.join(__dirname, '../uploads', req.params.homeworkName);
  let homeworkDir = path.join(studentDir, req.revieweeMission.recipient);
  let code = req.revieweeMission.code;
  let saveDir = path.join(homeworkDir, code);
  debug(saveDir);
  res.download(saveDir);}
  catch(e){
    debug(e);
  }
})

router.post('/homework/:homeworkName/review/:revieweeId/revise', function(req, res, next){
  student.getRevieweesReview(req.params.homeworkName).then((reviews) => {
    res.end(JSON.stringify(reviews));
  }).catch((error) => {
    console.log(error);
    res.end(JSON.stringify({ok : false}));
  });
})

function isPicture(type){
  return type == 'jpg' || type == 'jpeg' || type == 'img' || type == 'png';
}

function isZip(type){
  return type == 'zip' || type == 'rar';
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
