var express = require('express');
var router = express.Router();
var debug = require('debug')('teacher');
var Teacher = require('../userDefinition/assistant.js');


function initializeDatabase(db){
    Teacher.initializeDatabase(db);
}
router.use(function(req, res, next){
  req.teacher = new Teacher(req.user);
  next();
})

router.get('/index', function(req, res, next){

});


router.get('/profile', function(req, res, next){
  
});


module.exports = {
  router : router,
  initializeDatabase : initializeDatabase
};
