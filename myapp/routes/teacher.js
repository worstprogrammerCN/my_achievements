const express = require('express');
const router = express.Router();
const debug = require('debug')('teacher');
const path = require('path');
const Teacher = require('../userDefinition/teacher.js');
const Homework = require('../userDefinition/homework.js');

const teacherRouterUrl = '/teacher';

function initializeDatabase(db){
    Teacher.initializeDatabase(db);
}
router.use(function(req, res, next){
  req.teacher = new Teacher(req.user);
  next();
});

router.get('/index', function(req, res, next){
  var homeworksPromise = req.teacher.getHomeworks();
  var webClassesPromise = req.teacher.getWebClasses();
  Promise.all([homeworksPromise, webClassesPromise])
  .then(([homeworks, webClasses]) => {
      homeworks = homeworks.map((homework) => new Homework(homework));
      debug(homeworks);
    res.render('teacherIndex', {homeworks : homeworks,
                               webClasses : webClasses})
  }).catch((err) => {
    console.log(err);
  })
});

router.post('/makeHomework', function(req, res, next){
    debug(req.body);
    var homework = JSON.parse(req.body.homework);
    req.teacher.makeHomework(homework).then((result) => {
        var result = {
            ok : result.insertedCount > 0
        }
        var resultStr = JSON.stringify(result);
        res.end(resultStr);
    }).catch((err) => {
        console.log(err);
        res.end(JSON.stringify({ok : false}));
    });
});


router.post('/addWebClass', function(req, res, next){
  let webClass = JSON.parse(req.body.webClass);
  webClass.assistantList = [];
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
    try{
  let addWebGroup = (grade, number, index) => {
      return Teacher.webGroupCollection.updateOne({ // 向webClass的members添加student的id
          'webClass.grade' : grade,
          'webClass.number' : number,
          'number' : index
      }, {$set : {
        'webClass' : {
            'grade' : grade,
            'number' : number
        },
        'number' : index
      }}, {upsert : true, w : 1});
  };

  let addStudentToGroup = (student, group) => {
      return Teacher.webGroupCollection.updateOne({
                'webClass.grade' : student.webClass.grade,
                'webClass.number' : student.webClass.number,
                'number' : group
            }, {$addToSet : {'members' : student.id}});
  };

  let updateStudentGroupProperty = (student, group) => {
    return Teacher.userCollection
            .updateOne({id : student.id},
                    {$set : {group : group}});
  }

  let divideSetting = JSON.parse(req.body.divideSetting);
  var _groupCount;
  var _students;
  Teacher.webGroupCollection
    .deleteMany({'webClass.grade' : divideSetting.webClass.grade,
                 'webClass.number' : divideSetting.webClass.number})
  .then(() => {
    return Teacher.userCollection.find({
        'webClass.grade' : divideSetting.webClass.grade,
        'webClass.number' : divideSetting.webClass.number
    }).toArray()
  })
  .then((students) => {
    _students = students;
    _groupCount = groupCount = Math.ceil(students.length / divideSetting.maxNumber);
    students.sort(() => {return 0.5 - Math.random()});
    let addWebGroups = [];
    for(let index = 0; index < groupCount; index++)
        addWebGroups.push(addWebGroup(divideSetting.webClass.grade, divideSetting.webClass.number, index + 1));
    return Promise.all(addWebGroups);
  }).then((results) => {
    let students = _students;
    let groupCount = _groupCount;
    let promises = [];
    students.forEach((student, index) => {
        let groupNumber = parseInt(index / groupCount) + 1;
        promises.push(addStudentToGroup(student, groupNumber),
                    updateStudentGroupProperty(student, groupNumber));
    });
    return Promise.all(promises);
  }).then((r) => {
    res.end(JSON.stringify({ok : true}));
  }).catch((error) => {
    console.log(error);
    res.end(JSON.stringify({ok : false}));
  })
    }
    catch(err) {
        console.log(err);
    }
});

router.post('/distributeReview', function(req, res, next){
  try{
  let getWebGroups = (webClass) => {
    return Teacher.webGroupCollection.find({
      'webClass.grade' : distributeSetting.webClass.grade,
      'webClass.number' : distributeSetting.webClass.number
    }).toArray();
  }
  let getAssistants = (webClass) => {
    return Teacher.webClassCollection.findOne({
      'grade' : distributeSetting.webClass.grade,
      'number' : distributeSetting.webClass.number 
    }).then((webClass) => {
      return webClass.assistantList;
    });
  }

  let insertReview = (reviewerId, revieweeId) => {
    let homeworkName = distributeSetting.homeworkName;
    let getReviewer = Teacher.userCollection.findOne({id : reviewerId});
    let getReviewee = Teacher.userCollection.findOne({id : revieweeId});
    let insertReview = 
      Promise.all([getReviewer, getReviewee])
              .then(([reviewer, reviewee]) =>{
                return Teacher.reviewCollection.updateOne({
                  homeworkName : homeworkName,
                  reviewerId : reviewerId,
                  revieweeId : revieweeId
                },{$set : {
                  homeworkName : homeworkName,
                  reviewerId : reviewer.id,
                  reviewerName : reviewer.name,
                  reviewerIdentity : reviewer.identity,
                  revieweeId : reviewee.id,
                  revieweeName : reviewee.name
                }}, {upsert : true, w : 1});
              });
  }
  let updateReviewer = (reviewerId, revieweeId) => {
    return Teacher.missionCollection.findOneAndUpdate({
      'recipient' : reviewerId,
      'homeworkName' : distributeSetting.homeworkName
    }, {$set : {
      'recipient' : reviewerId,
      'homeworkName' : distributeSetting.homeworkName
    }, $addToSet : {
      revieweeList : revieweeId
    }}, {upsert : true});
  }

  let updateReviewee = (reviewerId, revieweeId) => {
    return Teacher.missionCollection.findOneAndUpdate({
      'recipient' : revieweeId,
      'homeworkName' : distributeSetting.homeworkName
    }, {$set : {
      'recipient' : revieweeId,
      'homeworkName' : distributeSetting.homeworkName
    }, $addToSet : {
      reviewerList : reviewerId
    }}, {upsert : true});
  };

  let insertMissionsAndReviews = (reviewerMembers, revieweeMembers) => {
    for(let j = 0; j < reviewerMembers.length; j++){
        for(let k = 0; k < reviewedMembers.length; k++){
          var reviewerId = reviewerMembers[j];
          var revieweeId = reviewedMembers[k];
          debug('reviewer', reviewerId);
          debug('reviewee', revieweeId);
          promises.push(updateReviewer(reviewerId, revieweeId));
          promises.push(updateReviewee(reviewerId, revieweeId));
          promises.push(insertReview(reviewerId, revieweeId));
        }
    }
  }

  let reviewerReviewGroup = (promises, reviewerId, webGroupMembers) => {
    for(k = 0; k < webGroupMembers.length; k++){
      var revieweeId = webGroupMembers[k];
      debug(reviewerId, revieweeId);
      promises.push(updateReviewer(reviewerId, revieweeId));
      promises.push(updateReviewee(reviewerId, revieweeId));
      promises.push(insertReview(reviewerId, revieweeId));
    }
  }

  let distributeSetting = JSON.parse(req.body.distributeSetting);
  let webClass = distributeSetting.webClass;
  Promise.all([getWebGroups(webClass), getAssistants(webClass)]).then(([webGroups, assistants]) => {
    // assign for groups
    let shiftTimes = Math.floor(Math.random() * (webGroups.length - 1)) + 1; // 第i个组评论第i + shiftTimes个组
    let promises = [];
    for(let i = 0; i < webGroups.length; i++){ // assign for students
      let reviewerMembers = webGroups[i].members;
      let reviewedMembers = webGroups[(i + shiftTimes) % webGroups.length].members;
      debug(reviewerMembers);
      debug(reviewedMembers);
      for(let j = 0; j < reviewerMembers.length; j++){
          let reviewer = reviewerMembers[j];
          reviewerReviewGroup(promises, reviewer, reviewedMembers);
      }
    }
    // ------------------------
    // assign for assistants
    debug(webGroups, assistants);
    webGroups.sort(() => {return 0.5 - Math.random()}); // 打乱各组顺序
    debug(assistants);
    let reviewCount = parseInt(webGroups.length / assistants.length); // 每个TA至少评论的组数
    let leftCount = webGroups.length % assistants.length // 剩下的要一个个分配给TA评论的组数
    for(let i = 0; i < assistants.length; i++){
      let assistantId = assistants[i];
      for(let j = 0; j < reviewCount; j++){
        debug(i * reviewCount + j);
        let webGroupMembers = webGroups[i * reviewCount + j].members;
        reviewerReviewGroup(promises, assistantId, webGroupMembers);
      }
    }
    for(let i = leftCount; i > 0; i--){
      let webGroupMembers = webGroups[webGroups.length - leftCount].members;
      let assistantId = assistants[i];
      reviewerReviewGroup(promises, assistantId, webGroupMembers)
    }

    return promises;
  }).then(() => {
    res.end(JSON.stringify({ok : true}));
  }).catch((error) => {
    console.log(error);
    res.end(JSON.stringify({ok : false}));
  })
  }catch(error){
    console.log(error);
    res.end(JSON.stringify({ok : false}));
  }
})


router.use('/homework/:homeworkName', function(req, res, next){
  let ifHomeworkExist = (homeworkName) => {
    return Teacher.homeworkCollection
            .findOne({name : homeworkName});
  };
  ifHomeworkExist(req.params.homeworkName).then((homework) => {
    if (!homework){
      return res.redirect(`${teacherRouterUrl}/index`);
    }
    req.homework = homework;
    next();
  })
});


router.get('/homework/:homeworkName', function(req, res, next){
  debug("in homework");
  try{
    debug('in router :homeworkName');
    let homeworkName = req.params.homeworkName;
    let teacherId = req.teacher.id;
    var _webClasses;

    let getWebClasses = () => {
      return Teacher.webClassCollection.find().toArray();
    }
    let getStudents = (webClass) => {
      return Teacher.webGroupCollection
              .find({'webClass.grade' : webClass.grade,
                     'webClass.number' : webClass.number})
              .toArray()
              .then((webGroups) => {
                let students = [];
                webGroups.forEach((webGroup) => {
                  webGroup.members.forEach((student) => {
                    students.push(student);
                  });
                });
                return students;
              })
    };
    let getMission = (studentId) => {
      return Teacher.missionCollection
              .findOne({homeworkName : req.params.homeworkName,
                        recipient : studentId});
    }
    getWebClasses().then((webClasses) => { // 找到每个班的学生
      let getStudentsPromise = webClasses.map((webClass) => {
        return getStudents(webClass);
      });
      _webClasses = webClasses.map((webClass) => {
        return {
          grade : webClass.grade,
          number : webClass.number,
          reviewees : []
        };
      });
      return Promise.all(getStudentsPromise);
    }).then((webClasses) => {
      let promise = webClasses.map((studentIds) => {
        let getMissions = studentIds.map((studentId) => {
          return getMission(studentId);
        });
        return Promise.all(getMissions);
      });
      return Promise.all(promise);
    }).then((missions) => {
      missions.forEach((missionsOfWebClass, index) => {
        _webClasses[index].reviewees = missionsOfWebClass;
      });
      debug(_webClasses);
      res.render("teacherHomework", 
                {webClasses : _webClasses,
                 homeworkName : req.params.homeworkName});
    })
    // get webClasses
    // get webGroups
    // for every webGroups, get students in the webGroups
    // for every student, get their information and mission details

  

  }catch(err){
    console.log(err);
  }
});


router.use('/homework/:homeworkName/download/', function(req, res, next){
  debug('in /download');
  if (!req.query.revieweeId)
    return falseResponse(res);
  let revieweeId = JSON.parse(req.query.revieweeId);
  Teacher.missionCollection
  .findOne({
    homeworkName : req.homework.name,
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

router.get('/profile', function(req, res, next){
   res.render('teacherProfile', {user : req.teacher});
});

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


// for(var index = 0; index < studentsWithoutGroup.length; index++){
    //   let student = studentsWithoutGroup[index];
    //   let group = parseInt(index / groupCount) + 1;
    //   debug('index, groupCount, group:', index, groupCount, group); 
    //   let addStudentToGroupPromise = webGroupCollection.updateOne({ // 向webClass的members添加student的id
    //       'webClass.grade' : student.webClass.grade,
    //       'webClass.number' : student.webClass.number,
    //       'number' : group
    //   }, {$set : {
    //     'webClass' : {
    //         'grade' : student.webClass.grade,
    //         'number' : student.webClass.number
    //     },
    //     'number' : group
    //   }, $addToSet : {'members' : student.id}}, {upsert : true, w : 1});
    //   let updateStudentGroupPromise = userCollection
    //                                  .updateOne({id : student.id}
    //                                           , {$set : {group : group}});
    //   debug(addStudentToGroupPromise,
    //   updateStudentGroupPromise);
    //   promises.push(addStudentToGroupPromise,
    //                 updateStudentGroupPromise);
    // }
    // return Promise.all(promises);