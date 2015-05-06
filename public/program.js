function float2int(value) {
  return value | 0;
}

function RaspPi() {
  //Motor definition
  this.CH1 = function() {};
  this.CH2 = function() {};
  this.CH3 = function() {};
  this.CH4 = function() {};
  
  //Throttle Power
  this.throttlePower = 5;
  
  //ESC calibration data
  this.escHigh = 2000;
  this.escMiddle = 1500;
  this.escLow = 1000;
  
  //Deadzone
  this.controllerDeadzone = .2;
  
  this.socket = io();
  
  this.CH1.prototype.pulsewidth_us(value) = function() {
    socket.emit('CH1pwus', value);
  };
  
  this.CH2.prototype.pulsewidth_us(value) = function() {
    socket.emit('CH2pwus', value);
  };
  
  this.CH3.prototype.pulsewidth_us(value) = function() {
    socket.emit('CH3pwus', value);
  };
  
  this.CH4.prototype.pulsewidth_us(value) = function() {
    socket.emit('CH4pwus', value);
  };
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

RaspPi.prototype.setCH4 = function(value, controller) {
  $("#mot1").html(value);
  if(controller == undefined)
  {
    this.CH4.pulsewidth_us(value);
    this.keyCH4 = true;
    return;
  } else if(controller == 0)
  {
    this.keyCH4 = false;
    this.CH4.pulsewidth_us(value);
  }else if(!this.keyCH4)
  {
    this.CH4.pulsewidth_us(value);
  }
}


RaspPi.prototype.setCH1 = function(value, controller) {
  $("#mot2").html(value);
  if(controller == undefined)
  {
    this.CH1.pulsewidth_us(value);
    this.keyCH1 = true;
    return;
  } else if(controller == 0)
  {
    this.keyCH1 = false;
    this.CH1.pulsewidth_us(value);
  }else if(!this.keyCH1)
  {
    this.CH1.pulsewidth_us(value);
  }
}


RaspPi.prototype.setCH3 = function(value, controller) {
  $("#mot3").html(value);
  if(controller == undefined)
  {
    this.CH3.pulsewidth_us(value);
    this.keyCH3 = true;
    return;
  } else if(controller == 0)
  {
    this.keyCH3 = false;
    this.CH3.pulsewidth_us(value);
  }else if(!this.keyCH3)
  {
    this.CH3.pulsewidth_us(value);
  }
}


RaspPi.prototype.setCH2 = function(value, controller) {
  $("#mot4").html(value);
  if(controller == undefined)
  {
    this.CH2.pulsewidth_us(value);
    this.keyCH2 = true;
    return;
  } else if(controller == 0)
  {
    this.keyCH2 = false;
    this.CH2.pulsewidth_us(value);
  }else if(!this.keyCH2)
  {
    this.CH2.pulsewidth_us(value);
  }
}





var app = new RaspPi();

$("#throttle").html(app.throttlePower);

Mousetrap.bind('1', function() { app.throttlePower = 1; $("#throttle").html(app.throttlePower); });
Mousetrap.bind('2', function() { app.throttlePower = 2; $("#throttle").html(app.throttlePower); });
Mousetrap.bind('3', function() { app.throttlePower = 3; $("#throttle").html(app.throttlePower); });
Mousetrap.bind('4', function() { app.throttlePower = 4; $("#throttle").html(app.throttlePower); });
Mousetrap.bind('5', function() { app.throttlePower = 5; $("#throttle").html(app.throttlePower); });

Mousetrap.bind('w', function() { app.setCH4(app.getHigh()); });
Mousetrap.bind('s', function() { app.setCH4(app.getLow()); });
Mousetrap.bind('w', function() { app.setCH4(app.escMiddle, 0); }, 'keyup');
Mousetrap.bind('s', function() { app.setCH4(app.escMiddle, 0); }, 'keyup');



Mousetrap.bind('q', function() { app.setCH2(app.getHigh()); });
Mousetrap.bind('a', function() { app.setCH2(app.getLow()); });
Mousetrap.bind('q', function() { app.setCH2(app.escMiddle, 0); }, 'keyup');
Mousetrap.bind('a', function() { app.setCH2(app.escMiddle, 0); }, 'keyup');



Mousetrap.bind('e', function() { app.setCH3(app.getHigh()); });
Mousetrap.bind('d', function() { app.setCH3(app.getLow()); });
Mousetrap.bind('e', function() { app.setCH3(app.escMiddle, 0); }, 'keyup');
Mousetrap.bind('d', function() { app.setCH3(app.escMiddle, 0); }, 'keyup');



Mousetrap.bind('r', function() { app.setCH1(app.getHigh()); });
Mousetrap.bind('f', function() { app.setCH1(app.getLow()); });
Mousetrap.bind('r', function() { app.setCH1(app.escMiddle, 0); }, 'keyup');
Mousetrap.bind('f', function() { app.setCH1(app.escMiddle, 0); }, 'keyup');


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
  
  app.setCH4(app.calcController(controller.axes[0]), true);
  app.setCH1(app.calcController(controller.axes[1]), true);
  app.setCH2(app.calcController(controller.axes[2]), true);
  app.setCH3(app.calcController(controller.axes[3]), true);
  
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