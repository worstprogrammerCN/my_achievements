var express = require('express');
var router = express.Router();
var debug = require('debug')('student');
var Student = require('../userDefinition/students.js');


function initializeDatabase(db){
    Student.initializeDatabase(db);
}
router.use(function(req, res, next){
  req.student = new Student(req.user);
  next();
})

router.get('/index', function(req, res, next){
  var missionsPromise = req.student.getMissions();
  var homeworksPromise = req.student.getHomeworks();
  Promise.all([missionsPromise, homeworksPromise])
  .then(([missions, homeworks]) => {
    res.render('studentIndex', {missions : missions,
                              homeworks : homeworks})
  }).catch((err) => {
    console.log(err);
  })
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


module.exports = {
  router : router,
  initializeDatabase : initializeDatabase
};
