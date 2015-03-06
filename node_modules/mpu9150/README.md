# mpu9150

A node.js library for communicating with the MPU-9150 9 Degrees of Freedom board.

Based initially on the mpu6050 library (https://github.com/jstapels/mpu6050) by Jason Stapels 

## Install

```
npm install mpu9150
```

## How to use it

```javascript
var mpu9150 = require('mpu9150');

// Instantiate and initialize.
var mpu = new mpu9150();
mpu.initialize();

// Test the connection before using.
if (mpu.testConnection()) {
  console.log(mpu.getMotion9());
}

// Put the MPU9150 back to sleep.
mpu.setSleepEnabled(1);
```