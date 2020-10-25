var ws_client = new WebSocket( "ws://192.168.43.55:9000");

var up = false;
var down = false;
var left = false;
var right = false;
var xMax = -1;
var yMax = -1;
var robot_speed = 100;

$(document).ready(function() {

	drawJoyBack();
	drawJoyFore();
	setInputSpeedCtrl();
	setInitialSpeed();

	ws_client.onmessage = function(event){
		append("messaggio: " + event.data);
	}

	ws_client.onopen = function(){
		append("connessione effettuata"); 
		ws_client.send("goooo");		
	}

	ws_client.onclose = function(){
		append("connessione chiusa");
	}

	ws_client.onerror = function(){
		append("errore nella connessione");
	}
});

function setInputSpeedCtrl() {
	const slideValue = document.querySelector("span");
      const inputSlider = document.querySelector("input");
      inputSlider.oninput = (()=>{
		let value = inputSlider.value;
        slideValue.textContent = value;
        slideValue.style.left = (value/2.55) + "%";
		slideValue.classList.add("show");
		var changeSpeedCommand = "";
		if (value >= robot_speed)
			changeSpeedCommand = "command|speed_up#";
		else
			changeSpeedCommand = "command|speed_down#";
		ws_client.send(changeSpeedCommand);
		append(changeSpeedCommand);
		robot_speed = value;
      });
      inputSlider.onblur = (()=>{
        slideValue.classList.remove("show");
      });
}

function setInitialSpeed() {
	const inputSlider = document.querySelector("input");
	robot_speed = inputSlider.value;
	append(robot_speed);
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

	addButton("follow", 330, 80, 45, follow_line_mode);
	addButton("obstacle", 440, 80, 45, obstable_avoid_mode);
	addButton("wifi", 550, 80, 45, wifi_ctrl_mode);
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

function addButton(button_name, b_x, b_y, r, function_name) {

	$("#joypadBackground").drawArc({
		draggable: true,
		name: button_name,
		fillStyle: 'rgb(100,200,150)', bringToFront: false,
		x: b_x, y: b_y, radius: r,
		dragstart: function(layer) {
			layer.x = b_x;
			layer.y = b_y;
		},
		drag: function(layer) {
			layer.x = b_x;
			layer.y = b_y;
		}, 
		dragstop: function(layer) {
			layer.x = b_x;
			layer.y = b_y;
		}, 
		dragcancel: function(layer) {
			layer.x = b_x;
			layer.y = b_y;
		},

		click: function(layer) {
			eval(function_name());
		},

		touchstart: function(layer) {
			eval(function_name());
		}

	});

	$("#joypadBackground").drawText({
		fillStyle: '#9cf', draggable: true,
		strokeStyle: '#25a',
		strokeWidth: 2,
		x: b_x, y: b_y,
		fontSize: 20,
		fontFamily: 'sans-serif',
		text: button_name,
		dragstart: function(layer) {
				layer.x = b_x;
				layer.y = b_y;
			},
			drag: function(layer) {
				layer.x = b_x;
				layer.y = b_y;
			}, 
			dragstop: function(layer) {
				layer.x = b_x;
				layer.y = b_y;
			}, 
			dragcancel: function(layer) {
				layer.x = b_x;
				layer.y = b_y;
			},
		click: function(layer) {
			eval(function_name());
		},

		touchstart: function(layer) {
			eval(function_name());
		}
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

function goOn() {
	ws_client.send("command|car_on#");
	append("command|on#");
}

function goDown() {
	ws_client.send("command|car_back#");
	append("command|back#");
}

function goLeft() {
	ws_client.send("command|car_left#");
	append("command|left#");
}

function goRight() {
	ws_client.send("command|car_right#");
	append("command|right#");
}

function stop() {
	ws_client.send("command|car_stop#");
	append("command|stop#");
}

function follow_line_mode() {
	ws_client.send("command|follow_active#");
	append("command|follow_active#");
}

function obstable_avoid_mode() {
	ws_client.send("command|obstacle_active#");
	append("command|obstacle_active#");
}

function wifi_ctrl_mode() {
	ws_client.send("command|wifi_active#");
	append("command|wifi_active#");
}
