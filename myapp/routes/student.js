var express = require('express');
var router = express.Router();
var debug = require('debug')('student');
var Student = require('../userDefinition/student.js');


function initializeDatabase(db){
    Student.initializeDatabase(db);
}
router.use(function(req, res, next){
  req.student = new Student(req.user);
  next();
})

router.get('/index', function(req, res, next){
  
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

router.post('/homework/:homeworkName/reviewee', function(req, res, next){

})

router.post('/homework/:homeworkName/reviewer', function(req, res, next){

})

router.post('/homework/:homeworkName/detail', function(req, res, next){

})
module.exports = {
  router : router,
  initializeDatabase : initializeDatabase
};
