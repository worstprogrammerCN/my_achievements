var bcrypt = require('bcryptjs');
var MongoClient = require('mongodb').MongoClient
const saltRounds = 10;
var dbUrl = 'mongodb://localhost:27017/ma';
var debug = require('debug')('test');
var moment = require('moment');
MongoClient.connect(dbUrl).then((db) => {
  
})









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


function foo1(){
  function foo2(){
    console.log('a');
  }
}

console.log(foo2);

function encryptPassword(plainPassword){ // return a promise with hashed password
  return bcrypt.hash(plainPassword, saltRounds);
}

function comparePassword(plainPassword, hashedPassword){ // return a promise with compared result(true or false)
  return bcrypt.compare(plainPassword, hashedPassword);
}


// router.post('/distributeReview', function(req, res, next){
//   try{
//   let insertReview = (reviewerId, revieweeId) => {
//     let homeworkName = distributeSetting.homeworkName;
//     let getReviewer = userCollection.findOne({id : reviewerId});
//     let getReviewee = userCollection.findOne({id : revieweeId});
//     let insertReview = 
//       Promise.all([getReviewer, getReviewee])
//               .then(([reviewer, reviewee]) =>{
//                 return reviewCollection.updateOne({
//                   homeworkName : homeworkName,
//                   reviewerId : reviewerId,
//                   revieweeId : revieweeId
//                 },{$set : {
//                   homeworkName : homeworkName,
//                   reviewerId : reviewer.id,
//                   reviewerName : reviewer.name,
//                   reviewerIdentity : reviewer.identity,
//                   revieweeId : reviewee.id,
//                   revieweeName : reviewee.name
//                 }}, {upsert : true, w : 1});
//               });
//   }
//   let updateReviewer = (reviewerId, revieweeId) => {
//     return missionCollection.updateOne({
//       'recipient' : reviewerId,
//       'homeworkName' : distributeSetting.homeworkName
//     }, {$set : {
//       'recipient' : reviewerId,
//       'homeworkName' : distributeSetting.homeworkName
//     }, $addToSet : {
//       revieweeList : revieweeId
//     }}, {upsert : true, w : 1});
//   }

//   let updateReviewee = (reviewerId, revieweeId) => {
//     return missionCollection.updateOne({
//       'recipient' : revieweeId,
//       'homeworkName' : distributeSetting.homeworkName
//     }, {$set : {
//       'recipient' : revieweeId,
//       'homeworkName' : distributeSetting.homeworkName
//     }, $addToSet : {
//       reviewerList : reviewerId
//     }}, {upsert : true, w : 1});
//   };

//   let insertMissionsAndReviews = (reviewerMembers, revieweeMembers) => {
//     for(let j = 0; j < reviewerMembers.length; j++){
//         for(let k = 0; k < reviewedMembers.length; k++){
//           var reviewerId = reviewerMembers[j];
//           var revieweeId = reviewedMembers[k];
//           debug('reviewer', reviewerId);
//           debug('reviewee', revieweeId);
//           promises.push(updateReviewer(reviewerId, revieweeId));
//           promises.push(updateReviewee(reviewerId, revieweeId));
//           promises.push(insertReview(reviewerId, revieweeId));
//         }
//     }
//   }

//   let reviewerReviewGroup = (reviewerId, webGroupMembers) => {
//     for(k = 0; k < webGroupMembers.length; k++){
//       var revieweeId = webGroupMembers[k];
//       debug(reviewerId, revieweeId);
//       promises.push(updateReviewer(reviewerId, revieweeId));
//       promises.push(updateReviewee(reviewerId, revieweeId));
//       promises.push(insertReview(reviewerId, revieweeId));
//     }
//   }

//   let distributeSetting = JSON.parse(req.body.distributeSetting);
//   debug(distributeSetting)
//   let getWebGroups = webGroupCollection.find({
//     'webClass.grade' : distributeSetting.webClass.grade,
//     'webClass.number' : distributeSetting.webClass.number
//   }).toArray();
//   debug(distributeSetting.webClass.grade,distributeSetting.webClass.number)
//   let getAssistants = webClassCollection.findOne({
//     'grade' : distributeSetting.webClass.grade,
//     'number' : distributeSetting.webClass.number 
//   }).then((webClass) => {
//     return webClass.assistantList;
//   });
//   Promise.all([getWebGroups, getAssistants]).then(([webGroups, assistants]) => {
//     // assign for groups
//     let shiftTimes = Math.floor(Math.random() * (webGroups.length - 1)) + 1; // 第i个组评论第i + shiftTimes个组
//     let promises = [];
//     for(let i = 0; i < webGroups.length; i++){ // assign for students
//       let reviewerMembers = webGroups[i].members;
//       let reviewedMembers = webGroups[(i + shiftTimes) % webGroups.length].members;
//       debug(reviewerMembers);
//       debug(reviewedMembers);
//       for(let j = 0; j < reviewerMembers.length; j++){
//           var reviewer = reviewerMembers[j];
//           reviewerReviewGroup(reviewer, reviewedMembers);
//       }
//     }
//     // ------------------------
//     // assign for assistants
//     debug(webGroups, assistants);
//     webGroups.sort(() => {return 0.5 - Math.random()}); // 打乱各组顺序
//     debug(assistants);
//     let reviewCount = parseInt(webGroups.length / assistants.length); // 每个TA至少评论的组数
//     let leftCount = webGroups.length % assistants.length // 剩下的要一个个分配给TA评论的组数
//     for(let i = 0; i < assistants.length; i++){
//       var assistantId = assistants[i];
//       for(let j = 0; j < reviewCount; j++){
//         debug(i * reviewCount + j);
//         let webGroupMembers = webGroups[i * reviewCount + j].members;
//         reviewerReviewGroup(assistantId, webGroupMembers);
//       }
//     }
//     let startIndexInLeftGroups = reviewCount * assistants.length;
//     for(let i = leftCount; i > 0; i--){
//       let webGroupMembers = webGroups[webGroups.length - leftCount].members;
//       var assistantId = assistants[i];
//       reviewerReviewGroup(assistantId, webGroupMembers)
//     }

//     return promises;
//   }).then(() => {
//     res.end(JSON.stringify({ok : true}));
//   }).catch((error) => {
//     console.log(error);
//     res.end(JSON.stringify({ok : false}));
//   })
//   }
//   catch(error){
//     console.log(error);
//     res.end(JSON.stringify({ok : false}));
//   }
// })