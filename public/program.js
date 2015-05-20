function float2int(value) {
  return value | 0;
}

function RaspPi() {
  this.socket = io();
  
  this.key = {};
  
  this.toggledLaser = false;
  
  this.toggledLight = false;
  
  //Motor definition
  this.CH0 = function CH0(value) {app.socket.emit('CH0pwus', value);};
  this.CH1 = function CH1(value) {app.socket.emit('CH1pwus', value);};
  this.CH2 = function CH2(value) {app.socket.emit('CH2pwus', value);};
  this.CH3 = function CH3(value) {app.socket.emit('CH3pwus', value);};
  this.CH4 = function CH4(value) {app.socket.emit('CH4pwus', value);};
  this.CH5 = function CH5(value) {app.socket.emit('CH5pwus', value);};
  this.CH6 = function CH6(value) {app.socket.emit('CH6pwus', value);};
  this.CH7 = function CH7(value) {app.socket.emit('CH7pwus', value);};
  this.CH8 = function CH8(value) {app.socket.emit('CH8pwus', value);};
  this.CH9 = function CH9(value) {app.socket.emit('CH9pwus', value);};
  this.CH10 = function CH10(value) {app.socket.emit('CH10pwus', value);};
  this.CH11 = function CH11(value) {app.socket.emit('CH11pwus', value);};
	this.CH12 = function CH12(value) {app.socket.emit('CH12pwus', value);};
	this.CH13 = function CH13(value) {app.socket.emit('CH13pwus', value);};
  this.CH14 = function CH14(value) {app.socket.emit('CH14pwus', value);};
  this.CH15 = function CH15(value) {app.socket.emit('CH15pwus', value);}; 
  
  // Helpful Shortcuts
  this.Lasers = function(value) {app.CH4(value);};
  
  this.Lights = function(value) {app.CH5(value);};
  
  //Throttle Power
  this.throttlePower = 5;
  
  //ESC calibration data
  this.escHigh = 2000;
  this.escMiddle = 1500;
  this.escLow = 1000;
  
  //Deadzone
  this.controllerDeadzone = .2;
}

RaspPi.prototype.getHigh = function() {
  return float2int(this.escMiddle + (this.escHigh - this.escMiddle) / 5 * this.throttlePower);
};

RaspPi.prototype.getLow = function() {
  return float2int(this.escMiddle - (this.escMiddle - this.escLow) / 5 * this.throttlePower);
};

RaspPi.prototype.calcController = function(value) {
  if(Math.abs(value) < this.controllerDeadzone)
  {
    return float2int(this.escMiddle);
  }
  return float2int(this.escMiddle + (this.escHigh - this.escMiddle) / 5 * this.throttlePower * value)
}

RaspPi.prototype.setChannel= function(Channel, value, controller) {
  if(controller == undefined)
  {
    Channel(value);
    this.key[Channel.name] = true;
  } else if(controller == 0)
  {
    this.key[Channel.name]= false;
    Channel(value);
  }else if(!this.key[Channel.name])
  {
    Channel(value);
  }
}



RaspPi.prototype.setLaser = function(value, controller) {
  this.setChannel(this.Lasers, value, controller);
}

RaspPi.prototype.toggleLaser = function() {  
  if(this.toggledLaser)
  {
    this.setLaser(app.getHigh());
    this.toggledLaser = false;
  } else
  {
    this.setLaser(app.getLow());
    this.toggledLaser = true;
  }
}



RaspPi.prototype.setLight = function(value, controller) {
  this.setChannel(this.Lights, value, controller);
}

RaspPi.prototype.toggleLight = function() {  
  if(this.toggledLight)
  {
    this.setLight(app.getHigh());
    this.toggledLight = false;
  } else
  {
    this.setLight(app.getLow());
    this.toggledLight = true;
  }
}

var app = new RaspPi();

$("#throttle").html(app.throttlePower);

Mousetrap.bind('1', function() { app.throttlePower = 1; $("#throttle").html(app.throttlePower); });
Mousetrap.bind('2', function() { app.throttlePower = 2; $("#throttle").html(app.throttlePower); });
Mousetrap.bind('3', function() { app.throttlePower = 3; $("#throttle").html(app.throttlePower); });
Mousetrap.bind('4', function() { app.throttlePower = 4; $("#throttle").html(app.throttlePower); });
Mousetrap.bind('5', function() { app.throttlePower = 5; $("#throttle").html(app.throttlePower); });

Mousetrap.bind('w', function() { app.setChannel(app.CH0, app.getHigh()); });
Mousetrap.bind('s', function() { app.setChannel(app.CH0, app.getLow()); });
Mousetrap.bind('w', function() { app.setChannel(app.CH0, app.escMiddle, 0); }, 'keyup');
Mousetrap.bind('s', function() { app.setChannel(app.CH0, app.escMiddle, 0); }, 'keyup');



Mousetrap.bind('q', function() { app.setChannel(app.CH1, app.getHigh()); });
Mousetrap.bind('a', function() { app.setChannel(app.CH1, app.getLow()); });
Mousetrap.bind('q', function() { app.setChannel(app.CH1, app.escMiddle, 0); }, 'keyup');
Mousetrap.bind('a', function() { app.setChannel(app.CH1, app.escMiddle, 0); }, 'keyup');



Mousetrap.bind('e', function() { app.setChannel(app.CH2, app.getHigh()); });
Mousetrap.bind('d', function() { app.setChannel(app.CH2, app.getLow()); });
Mousetrap.bind('e', function() { app.setChannel(app.CH2, app.escMiddle, 0); }, 'keyup');
Mousetrap.bind('d', function() { app.setChannel(app.CH2, app.escMiddle, 0); }, 'keyup');



Mousetrap.bind('r', function() { app.setChannel(app.CH3, app.getHigh()); });
Mousetrap.bind('f', function() { app.setChannel(app.CH3, app.getLow()); });
Mousetrap.bind('r', function() { app.setChannel(app.CH3, app.escMiddle, 0); }, 'keyup');
Mousetrap.bind('f', function() { app.setChannel(app.CH3, app.escMiddle, 0); }, 'keyup');


Mousetrap.bind('l', function() { app.toggleLaser(); });

Mousetrap.bind('k', function() { app.toggleLight(); });

//check for events
var haveEvents = 'GamepadEvent' in window;

//store controllers
var controllers = {};

//rAF
var rAF = window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame;

//connect handler
function connecthandler(e) {
  addgamepad(e.gamepad);
}

// adds gamepad
function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad;
  document.getElementById("start").style.display = "none";
  
  var o = document.createElement("option");
  o.setAttribute("id", "controllerOption" + gamepad.index);
  o.setAttribute("value", gamepad.index);
  o.innerHTML = gamepad.id;
  $("#controllers").append(o);
}

$("#useController").click(function(){
  $("#controllers").addClass("hidden");
  $("#useController").addClass("hidden");
  makeDefault(controllers[$("#controllers").val()]);
});

var gamepadIndex;

//Makes the gamepad the one to check
function makeDefault(gamepad) {
  gamepadIndex = gamepad.index;
  var d = document.createElement("div");
  d.setAttribute("id", "controller" + gamepad.index);
  var t = document.createElement("h1");
  t.appendChild(document.createTextNode("gamepad: " + gamepad.id));
  d.appendChild(t);
  var b = document.createElement("div");
  b.className = "buttons";
  for (var i=0; i<gamepad.buttons.length; i++) {
    var e = document.createElement("span");
    e.className = "button";
    //e.id = "b" + i;
    e.innerHTML = i;
    b.appendChild(e);
  }
  d.appendChild(b);
  var a = document.createElement("div");
  a.className = "axes";
  for (i=0; i<gamepad.axes.length; i++) {
    e = document.createElement("progress");
    e.className = "axis";
    //e.id = "a" + i;
    e.setAttribute("max", "2");
    e.setAttribute("value", "1");
    e.innerHTML = i;
    a.appendChild(e);
  }
  d.appendChild(a);
  document.body.appendChild(d);
  rAF(updateStatus);
}

//Handler for disconnect
function disconnecthandler(e) {
  removegamepad(e.gamepad);
}

//Remove gamepad
function removegamepad(gamepad) {
  var d = document.getElementById("controller" + gamepad.index);
  document.body.removeChild(d);
  delete controllers[gamepad.index];
}

//Update gamepad
function updateStatus() {
  scangamepads();
  
  j = gamepadIndex;
  
  var controller = controllers[j];
  var d = document.getElementById("controller" + j);
  var buttons = d.getElementsByClassName("button");
  for (var i=0; i<controller.buttons.length; i++) {
    var b = buttons[i];
    var val = controller.buttons[i];
    var pressed = val == 1.0;
    if (typeof(val) == "object") {
      pressed = val.pressed;
      val = val.value;
    }
    var pct = Math.round(val * 100) + "%";
    b.style.backgroundSize = pct + " " + pct;
    if (pressed) {
      b.className = "button pressed";
    } else {
      b.className = "button";
    }
  }

  var axes = d.getElementsByClassName("axis");
  for (var i=0; i<controller.axes.length; i++) {
    var a = axes[i];
    a.innerHTML = i + ": " + controller.axes[i].toFixed(4);
    a.setAttribute("value", controller.axes[i] + 1);
  }
  
  app.setChannel(app.CH0, app.calcController(controller.axes[0]), true);
  app.setChannel(app.CH2, app.calcController(controller.axes[1]), true);
  app.setChannel(app.CH3, app.calcController(controller.axes[2]), true);
  app.setChannel(app.CH4, app.calcController(controller.axes[3]), true);
  
  setTimeout(function(){rAF(updateStatus);},50);
}

//if no events
function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (!(gamepads[i].index in controllers)) {
        addgamepad(gamepads[i]);
      } else {
        controllers[gamepads[i].index] = gamepads[i];
      }
    }
  }
}

//set events
if (haveEvents) {
  window.addEventListener("gamepadconnected", connecthandler);
  window.addEventListener("gamepaddisconnected", disconnecthandler);
} else {
  setInterval(scangamepads, 500);
}