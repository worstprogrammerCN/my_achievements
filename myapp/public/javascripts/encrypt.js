const bcrypt = require('bcryptjs');
const saltRounds = 10;

function comparePassword(plainPassword, hashedPassword){ // return a promise with compared result(true or false)
  return bcrypt.compare(plainPassword, hashedPassword);
}

function encryptPassword(plainPassword){ // return a promise with hashed password
  return bcrypt.hash(plainPassword, saltRounds);
}

if (typeof module == 'object')
  module.exports = {
    comparePassword : comparePassword,
    encryptPassword : encryptPassword
  }