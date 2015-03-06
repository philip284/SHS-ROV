var mpu9150 = require('./../index.js');

var imu = new mpu9150();
imu.initialize();

if( imu.testConnection() ) {
	console.log(imu.getMotion9());
}

imu.setSleepEnabled(1);