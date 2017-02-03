var bcrypt = require('bcryptjs');
var MongoClient = require('mongodb').MongoClient
const saltRounds = 10;
var dbUrl = 'mongodb://localhost:27017/ma';
// MongoClient.connect(dbUrl).then((db) => {
  
// })

let o = Object.assign({
  webClass : {
    grade : '',
    number : ''
    }
  }, {
    webClass : {
      grade : '17'
    }
  }
)
console.log(o)


function encryptPassword(plainPassword){ // return a promise with hashed password
  return bcrypt.hash(plainPassword, saltRounds);
}

function comparePassword(plainPassword, hashedPassword){ // return a promise with compared result(true or false)
  return bcrypt.compare(plainPassword, hashedPassword);
}