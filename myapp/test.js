var bcrypt = require('bcryptjs');
var MongoClient = require('mongodb').MongoClient
const saltRounds = 10;
var dbUrl = 'mongodb://localhost:27017/ma';
var debug = require('debug')('test');
var moment = require('moment');
// MongoClient.connect(dbUrl).then((db) => {
  
// });

console.log(Math.ceil(2/1));

// var http = require('http'),
//     inspect = require('util').inspect;
// var path = require('path'),
//     os = require('os'),
//     fs = require('fs');
 
// var Busboy = require('busboy');
 
// http.createServer(function(req, res) {
//   if (req.method === 'POST') {
//     var busboy = new Busboy({ headers: req.headers });
//     let postValue;
//     busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
//       console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
//       // if (!fs.existsSync(path))
//       let saveDir = path.join(__dirname, 'uploads', postValue);
//       if (!fs.existsSync(saveDir))
//         fs.mkdirSync(saveDir);
//       var saveTo = path.join(saveDir, filename);
//       file.pipe(fs.createWriteStream(saveTo, {flags : 'w+'}));
//       file.on('data', function(data) {
//         debug('data recieved', data);
//         console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
//       });
//       file.on('end', function() {
//         debug(fieldname);
//         debug(saveTo);
//         console.log('File [' + fieldname + '] Finished');
//       });
//     });
//     busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
//       console.log(val);
//       console.log('Field [' + fieldname + ']: value: ' + inspect(val));
//       postValue = val;
//     });
//     busboy.on('finish', function() {
//       console.log('Done parsing form!');
//       res.writeHead(303, { Connection: 'close', Location: '/' });
//       res.end();
//     });
//     req.pipe(busboy);
//   } else if (req.method === 'GET') {
//     res.writeHead(200, { Connection: 'close' });
//     res.end('<html><head></head><body>\
//                <form method="POST" enctype="multipart/form-data">\
//                 <input type="text" name="textfield"><br />\
//                 <input type="file" name="filefield" multiple><br />\
//                 <input type="submit">\
//               </form>\
//             </body></html>');
//   }
// }).listen(8000, function() {
//   console.log('Listening for requests');
// });
 
// // Example output, using http://nodejs.org/images/ryan-speaker.jpg as the file: 
// // 
// // Listening for requests 
// // File [filefield]: filename: ryan-speaker.jpg, encoding: binary 
// // File [filefield] got 11971 bytes 
// // Field [textfield]: value: 'testing! :-)' 
// // File [filefield] Finished 
// // Done parsing form! 


function encryptPassword(plainPassword){ // return a promise with hashed password
  return bcrypt.hash(plainPassword, saltRounds);
}

function comparePassword(plainPassword, hashedPassword){ // return a promise with compared result(true or false)
  return bcrypt.compare(plainPassword, hashedPassword);
}


