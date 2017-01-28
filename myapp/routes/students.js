var express = require('express');
var router = express.Router();
var debug = require('debug')('student');
var Student = require('../userDefinition/students.js');


function initializeDatabase(db){
    Student.initializeDatabase(db);
}

router.get('/profile', function(req, res, next){
  var student = new Student(req.user);
  var user = Student.getUserWithoutPassword(req.user);
  student.getGroupmates().then((groupMates) => {
    res.render('studentProfile', {user : user, groupMates : groupMates});
  }).catch((err) => {
    console.log(err);
  })
});


module.exports = {
  router : router,
  initializeDatabase : initializeDatabase
};
