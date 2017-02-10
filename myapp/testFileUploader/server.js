
var http = require('http'),
    inspect = require('util').inspect;
var path = require('path'),
    os = require('os'),
    fs = require('fs');
 
var Busboy = require('busboy');
var express = require('express');

app = express();

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'jade');



app.post('*', function(req, res, next){
    var busboy = new Busboy({ headers: req.headers });
    let postValue = {};
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      let saveDir = path.join(__dirname, 'uploads', '15331132');
      if (!fs.existsSync(saveDir))
        fs.mkdirSync(saveDir);
      var saveTo = path.join(saveDir, postValue.qqfilename);
      console.log(saveTo);
      file.pipe(fs.createWriteStream(saveTo, {flags : 'w+'}));
      file.on('data', function(data) {
        console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
      });
      file.on('end', function() {
        console.log('File [' + fieldname + '] Finished');
      });
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      console.log(val);
      console.log('Field [' + fieldname + ']: value: ' + inspect(val));
      postValue[fieldname] = val;
    });
    busboy.on('finish', function() {
      console.log('Done parsing form!');
      res.end(JSON.stringify({success : true}));
    });
    req.pipe(busboy);
});

app.get('*', function(req, res, next){
    var aPath = path.join(__dirname, 'views', 'test.html');
    res.render('test');
});

console.log(__dirname);



var server = http.createServer(app);
server.listen('8000');
 
 
// Example output, using http://nodejs.org/images/ryan-speaker.jpg as the file: 
// 
// Listening for requests 
// File [filefield]: filename: ryan-speaker.jpg, encoding: binary 
// File [filefield] got 11971 bytes 
// Field [textfield]: value: 'testing! :-)' 
// File [filefield] Finished 
// Done parsing form! 