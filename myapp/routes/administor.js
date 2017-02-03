const express = require('express');
const router = express.Router();

router.get('/index', function(req, res, next){
  res.render('administorIndex', {user : req.user});
})

router.post('/addUser', function(req, res, next){

})

router.post('/addWebClass', function(req, res, next){
  
})

function initialize(db){

}

module.exports = {
  router : router,
  initialize : initialize
}