var express = require('express');
var router = express.Router();
var debug = require('debug')('teacher');
var Teacher = require('../userDefinition/teacher.js');


function initializeDatabase(db){
    Teacher.initializeDatabase(db);
}
router.use(function(req, res, next){
  req.teacher = new Teacher(req.user);
  next();
})

router.get('/index', function(req, res, next){
  var homeworksPromise = req.teacher.getHomeworks();
  var webClassesPromise = req.teacher.getWebClasses();
  Promise.all([homeworksPromise, webClassesPromise])
  .then(([homeworks, webClasses]) => {
      console.log(homeworks);
      console.log(webClasses);
    res.render('teacherIndex', {homeworks : homeworks,
                               webClasses : webClasses})
  }).catch((err) => {
    console.log(err);
  })
});

router.post('/addHomework', function(req, res, next){
    var homework = req.body;
    req.teacher.addHomework(homework).then((result) => {
        var insertSuccess = result.insertedCount > 0;
        var result = {
            insertSuccess : insertSuccess
        }
        var resultStr = JSON.stringify(result);
        res.end(resultStr);
    }).catch((err) => {
        console.log(err);
    })

})

router.post('/publishHomework', function(req, res, next){
    var publishSetting = JSON.parse(req.body.publishSettingStr);
    var mission = publishSetting.mission;
    var webClasses = publishSetting.webClasses;
    debug(publishSetting);
    debug(mission, webClasses);
    req.teacher.addMissions(mission, webClasses).then((result) => {
        debug('result');
        result = JSON.stringify(result);
        res.end(result);
    }).catch((err) => {
        debug('error');
        // var errorStr = JSON.stringify({
        //     message : err,
        //     publishSuccess : false
        // })
        // res.end(errorStr);
    })
    // res.end('{"insertSuccess" : false}');
    // return;
})


router.get('/profile', function(req, res, next){
  
});


module.exports = {
  router : router,
  initializeDatabase : initializeDatabase
};
