var up = false;
var down = false;
var left = false;
var right = false;
var xMax = -1;
var yMax = -1;

$(document).ready(function() {
	//ws_check();
	drawJoyBack();
	drawJoyFore();
});

function ws_check(){
	if (!window.WebSocket && window.MozWebSocket) {
		window.WebSocket = window.MozWebSocket;
		alert('MozWebSocket');
	}
	else if (!window.WebSocket) {
		alert("WebSocket not supported by this browser");
	}
	else{
		alert('wtf!? '+window.WebSocket);
	}
}

function start_new_client(command) {

	var ws_client = new WebSocket( "ws://192.168.43.63:8000");
	
	ws_client.onopen = function(){
		append(command); 
		ws_client.send(command);	
	}
}

function goOn() {
	var command = "command|on#";
	start_new_client(command);	
}

function goDown() {
	var command = "command|back#";
	start_new_client(command);	
}

function goLeft() {
	var command = "command|left#";
	start_new_client(command);	
}

function goRight() {
	var command = "command|right#";
	start_new_client(command);	
}

function kick() {
	var command = "command|kick#";
	start_new_client(command);	
}

function stop() {
	var command = "command|stop#";
	start_new_client(command);	
}


function updateRangeInput(elem) {
	var speed = $(elem).val();
	var changeSpeedCommand = "command|s:" + speed + "#";
	ws_client.send(changeSpeedCommand);
	append(changeSpeedCommand);
}

function drawJoyBack() {
	$("#joypadBackground").drawArc({
		draggable: true,
		name: 'background',
		fillStyle: 'rgb(100,100,255)', bringToFront: false,
		x: 120, y: 120, radius: 120,

		dragstart: function(layer) {
			layer.x = 120;
			layer.y = 120;
		},
		drag: function(layer) {
			layer.x = 120;
			layer.y = 120;
		}, 
		dragstop: function(layer) {
			layer.x = 120;
			layer.y = 120;
		}, 
		dragcancel: function(layer) {
			layer.x = 120;
			layer.y = 120;
		}
	});

$("#joypadBackground").drawArc({
		draggable: true,
		name: 'kick',
		fillStyle: 'rgb(100,200,150)', bringToFront: false,
		x: 350, y: 80, radius: 35,
		dragstart: function(layer) {
			layer.x = 350;
			layer.y = 80;
		},
		drag: function(layer) {
			layer.x = 350;
			layer.y = 80;
		}, 
		dragstop: function(layer) {
			layer.x = 350;
			layer.y = 80;
		}, 
		dragcancel: function(layer) {
			layer.x = 350;
			layer.y = 80;
		},

	click: function(layer) {
    	kick();
  	},

	touchstart: function(layer) {
		kick();
	}

	});

$("#joypadBackground").drawText({
  fillStyle: '#9cf', draggable: true,
  strokeStyle: '#25a',
  strokeWidth: 2,
  x: 350, y: 80,
  fontSize: 20,
  fontFamily: 'sans-serif',
  text: 'K',
	dragstart: function(layer) {
			layer.x = 350;
			layer.y = 80;
		},
		drag: function(layer) {
			layer.x = 350;
			layer.y = 80;
		}, 
		dragstop: function(layer) {
			layer.x = 350;
			layer.y = 80;
		}, 
		dragcancel: function(layer) {
			layer.x = 350;
			layer.y = 80;
		},
	click: function(layer) {
		kick();
	  },

	touchstart: function(layer) {
		kick();
	}
	});
}

function returnToHome (layerName) {

	$("#joypadBackground").animateLayer(layerName, {
		x: 120, y: 120,
		radius: 30,
	}, 10, function(layer) { // Callback function
	$(this).animateLayer(layer, {
		x: 120, y: 120,
		opacity: 1
		}, 'slow', 'ease-in-out');
	});
}

function drawJoyFore() {
	$("#joypadBackground").addLayer({
	  type: 'arc',
	  fillStyle: 'rgb(200,100,255)', 
	  fromCenter: true, draggable: true,
	  name: 'foreground',
	  x: 120, y: 120, radius: 30,

	  drag: function(layer) {
		var layerName = layer.name;
		var x = layer.x;
		var y = layer.y;
		

		var moveX = Math.abs(120-x);
 		var moveY = Math.abs(120-y);
		var move = Math.abs(Math.sqrt((moveX*moveX)+(moveY*moveY)));
		
		
		if (move < 91) {
			layer.x = x;
			layer.y = y;
			xMax = x;
			yMax = y;
		} else if (move >= 91) {
			layer.x = xMax;
			layer.y = yMax;
		}


		if (y <= 50 && up === false) {
			goOn();
			setMoveVariables (true, false, false, false);
		} else if (y > 50 && y < 190 && x > 190 && right === false) {
			goRight();
			setMoveVariables (false, false, false, true);
	 	} else if (y > 50 && y < 190 && x < 50 && left === false) {
			goLeft();
			setMoveVariables (false, false, true, false);
		} else if (y >= 190 && down == false) {
			goDown();
			setMoveVariables (false, true, false, false);
		} else if (y >= 100 && y <= 140 && x <= 150 && x >= 90 && (up === true || down === true || left === true || right === true)) {
			stop();
			setMoveVariables (false, false, false, false);
		}
	  },

	dragstop: function(layer) {
		returnToHome(layer.name);
		setMoveVariables (false, false, false, false);
		stop();
	}

	}).drawLayers();
}

function setMoveVariables (u, d, l, r) {
	up = u;
	down = d;
	left = l;
	right = r;
}

function append(text) {
	$("#eventi_websocket").append("<li>" + text + "</li>");
}
