var express = require('express');
var cors = require('cors');
var app = express();
var ip = require('ip');
var os = require('os');

app.use(cors());
app.use(express.static('/home/pi/SHS-ROV/public'));

var server = require('http').createServer();
var io = require('socket.io')(server);


// Switched to RTIMULib
//var mpu9150 = require('mpu9150');

// Removed depth
//var MS5803 = require('ms5803_rpi');

// Instantiate and initialize. 
//var mpu = new mpu9150();
//mpu.initialize();

//var sensor = new MS5803({address: 0x76, device: '/dev/i2c-1'});

//var temp;
//var mbar;

var imudata = {
  time: 0,
  roll: 0,
  pitch: 0,
  yaw: 0,
  status: 0
};

var rovdata = {
	heading: 0,
	pitch: 0,
	roll: 0,
	mbar: 0,
	temp: 0
};

//MPU9150
var PORT = 32000;
var HOST = '127.0.0.1';
var dgram = require('dgram');
var imuserver = dgram.createSocket('udp4');

imuserver.on('listening', function () {
    var address = imuserver.address();
//    console.log('Listening for IMU data on: ' + address.address + ":" + address.port);
});

imuserver.on('message', function (message, remote) {
    imustring = message.toString().split(' ');

    for(var i=0; i<imustring.length;i++) imustring[i] = +imustring[i];

    imudata.time   = imustring[0];
    imudata.pitch  = +imustring[1].toFixed(2);
    imudata.roll   = +imustring[2].toFixed(2);
    imudata.yaw    = +imustring[3].toFixed(2);
    if (new Date().getTime() - imudata.time < 15) {
       imudata.status = 'OK';
    } else {
       imudata.status = 'NOK';
    }
    if (imudata.roll < 0) {
            rovdata.roll = Math.floor((imudata.roll + 360)*100)/100;
    } else {
            rovdata.roll =  Math.floor((imudata.roll)*100)/100;
    }
    if (imudata.pitch < 0) {
        rovdata.pitch = Math.floor((imudata.pitch + 360)*100)/100;
    } else {
        rovdata.pitch = Math.floor((imudata.pitch)*100)/100;
    }
    if (imudata.yaw < 0) {
        rovdata.heading = imudata.yaw + 360;
    } else {
        rovdata.heading = imudata.yaw;
    }
    rovdata.status = imudata.status;

    //console.log(imudata);
});

imuserver.bind(PORT, HOST);

var makePwm = require("adafruit-pca9685" );
var pwm = makePwm({"address": 0x40, "device": '/dev/i2c-1', "freq": 50, "debug": false});

/**
updateDepth = function() {
  sensor.read(function (err, data) {
    rovdata.temp = data.temperature;
    rovdata.mbar = data.pressure;
  });
  setTimeout(updateDepth, 25);
};

updateDepth();
**/

app.set('view engine', 'ejs');

app.get('/help', function(req, res) {
  res.send('/compass - gets compass information<br>/depth - gets depth information');
});

app.get('/compass', function(req, res) {
  res.send('' + rovdata.heading + ',' + rovdata.pitch + ',' + rovdata.roll);
});

/**
app.get('/depth', function(req, res) {
  res.send(''+ rovdata.temp + ',' + rovdata.mbar + '');
});
**/

//app.get('/', function(req, res) {
//    res.render('pages/index');
//});

/*
var servo = function(channel, pulse) {
  pwm.setPulse(channel, pulse);
};

io.on('connection', function(socket){
  console.log('connected');
  
  socket.on('CH1pwus', function(value) {
    servo(1, value);
  });
  
  socket.on('CH2pwus', function(value) {
    servo(2, value);
  });
  
  socket.on('CH3pwus', function(value) {
    servo(3, value);
  });
  
  socket.on('CH4pwus', function(value) {
    servo(4, value);
  });
  
});*/

server.listen(8035, function() {
  var host = server.address().address;
  var port = server.address().port;
  
  console.log('App listening at http://%s:%s', host, port);
});

