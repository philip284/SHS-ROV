var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors());

var mpu9150 = require('mpu9150');
var MS5803 = require('ms5803_rpi');

// Instantiate and initialize. 
var mpu = new mpu9150();
mpu.initialize();

var sensor = new MS5803({address: 0x76, device: '/dev/i2c-1'});

var temp;
var mbar;

updateDepth = function() {
  sensor.read(function (err, data) {
    temp = data.temperature;
    mbar = data.pressure;
    //console.log(temp);
    //console.log(mbar);
  });
  setTimeout(updateDepth, 25);
};

updateDepth();

app.get('/', function(req, res) {
  res.send('/compass - gets compass information<br>/depth - gets depth information');
});

app.get('/compass', function(req, res) {
  if (mpu.testConnection()) {
    res.send(mpu.getMotion9() + '');
  } else
  {
    res.send('Compass Not On');
  }
});

app.get('/depth', function(req, res) {
  res.send(''+ temp + ',' + mbar + '');
});

var server = app.listen(5678, function() {
  var host = server.address().address;
  var port = server.address().port;
  
  console.log('App listening at http://%s:%s', host, port);
});


