var bcrypt = require('bcryptjs');
var MongoClient = require('mongodb').MongoClient
const saltRounds = 10;
var dbUrl = 'mongodb://localhost:27017/ma';
// MongoClient.connect(dbUrl).then((db) => {
  
// })
var user = {
  webclass : {
    number : 1
  },
  id : 'aa'
}
console.log(JSON.parse(JSON.stringify(user)))

// var express = require('express')
// var multer  = require('multer')

// var app = express()

// app.get('/', function(req, res){
//   res.send('hello world');
// });

// app.post('/',[ multer({ dest: './uploads/'}), function(req, res){
//     console.log(req.body) // form fields
//     console.log(req.files) // form files
//     res.status(204).end()
// }]);

// app.listen(3000);


function encryptPassword(plainPassword){ // return a promise with hashed password
  return bcrypt.hash(plainPassword, saltRounds);
}

function comparePassword(plainPassword, hashedPassword){ // return a promise with compared result(true or false)
  return bcrypt.compare(plainPassword, hashedPassword);
}