var bcrypt = require('bcryptjs');
var MongoClient = require('mongodb').MongoClient
const saltRounds = 10;
var dbUrl = 'mongodb://localhost:27017/ma';
MongoClient.connect(dbUrl).then((db) => {
  console.log('connect to database done');
  var plainPassword = 'jinqu31';
  var adm = {
      id : '0',
      name : 'administor',
      password : plainPassword,
      email : '657278923@qq.com',
      identity : 'administor'
  }
  db.collection('user')
  .findOne({id : '0'})
  .then((user) => {
    return comparePassword(plainPassword, user.password);
  })
  .then((result) => {
      console.log(result);
      db.close();
  })
})


function encryptPassword(plainPassword){ // return a promise with hashed password
  return bcrypt.hash(plainPassword, saltRounds);
}

function comparePassword(plainPassword, hashedPassword){ // return a promise with compared result(true or false)
  return bcrypt.compare(plainPassword, hashedPassword);
}