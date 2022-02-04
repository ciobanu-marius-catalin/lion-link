var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var path = require("path");
var port = 9001;

app.use('/assets', express.static(path.join(__dirname, 'dist/assets')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/manifest.json', function (req, res) {
  res.sendFile(path.join(__dirname + '/manifest.json'));
});

app.get('/OneSignalSDKWorker.js', function (req, res) {
  res.sendFile(path.join(__dirname + '/OneSignalSDKWorker.js'));
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});
app.listen(port);

console.log('Express started on port ' + port);
