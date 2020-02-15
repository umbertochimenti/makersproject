var up = false;
var down = false;
var left = false;
var right = false;
var xMax = -1;
var yMax = -1;

$(document).ready(function() {
	addButton("#car_robot_ctrl","upButton", 500, 150, 100, "blue", "goOn", "stop");
	addButton("#car_robot_ctrl","downButton", 500, 450, 100, "blue", "goDown", "stop");
	addButton("#car_robot_ctrl","leftButton", 300, 300, 100, "green", "goLeft", "stop");
	addButton("#car_robot_ctrl","rightButton", 700, 300, 100, "green", "goRight", "stop");
});

function addButton(canvasName, buttonName, x, y, size, color, function_mouse_down, function_mouse_up) {
	$(canvasName).drawArc({
		draggable: false,
		name: buttonName,
		layer: true,
		fillStyle: color,
		bringToFront: false,
		x: x, y: y, radius: size,
		mousedown: function() {
			eval(function_mouse_down)();
		},
		mouseup: function() {
			eval(function_mouse_up)();
		},
		mouseout: function() {
			eval(function_mouse_up)();
		}
	});
}

function start_new_client(command) {

	var ws_client = new WebSocket( "ws://192.168.43.231:8000");
	
	ws_client.onopen = function(){
		//append(command); 
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

function stop() {
	var command = "command|stop#";
	start_new_client(command);	
}

function append(text) {
	$("#eventi_websocket").append("<li>" + text + "</li>");
}
