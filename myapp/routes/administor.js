const express = require('express');
const router = express.Router();

router.get('/index', function(req, res, next){
  
  res.render('administorIndex', {user : req.user});
})

function initialize(db){

}

module.exports = {
  router : router,
  initialize : initialize
}