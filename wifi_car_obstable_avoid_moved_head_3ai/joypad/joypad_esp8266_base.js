var autoModalityTimer = 0;

$(document).ready(function () {
	manualModalityButtons();
});

function removeButtons() {
	$("#car_robot_ctrl").removeLayer("upButton");
	$("#car_robot_ctrl").removeLayer("downButton");
	$("#car_robot_ctrl").removeLayer("leftButton");
	$("#car_robot_ctrl").removeLayer("rightButton");
	$("#car_robot_ctrl").removeLayer("autoModalityButton");
	$("#car_robot_ctrl").removeLayer("manualModalityButton");
	$("#car_robot_ctrl").removeLayer("speedU");
	$("#car_robot_ctrl").removeLayer("speedD");
}

function manualModalityButtons() {
	addButton("#car_robot_ctrl", "upButton", 300, 150, 80, "blue", "goOn", "stop", "stop");
	addButton("#car_robot_ctrl", "downButton", 300, 350, 80, "blue", "goDown", "stop", "stop");
	addButton("#car_robot_ctrl", "leftButton", 150, 250, 80, "green", "goLeft", "stop", "stop");
	addButton("#car_robot_ctrl", "rightButton", 450, 250, 80, "green", "goRight", "stop", "stop");
	addButton("#car_robot_ctrl", "speedU", 660, 200, 40, "black", "speedU", "stop", "stop");
	addButton("#car_robot_ctrl", "speedD", 700, 300, 40, "black", "speedD", "stop", "stop");
	addButton("#car_robot_ctrl", "autoModalityButton", 600, 100, 50, "purple", "autoModality", "functionNull", "functionNull");
	addButton("#car_robot_ctrl", "manualModalityButton", 720, 100, 50, "gray", "functionNull", "functionNull", "functionNull");
}

function autoModalityButtons() {
	addButton("#car_robot_ctrl", "upButton", 300, 150, 80, "gray", "functionNull", "functionNull", "functionNull");
	addButton("#car_robot_ctrl", "downButton", 300, 350, 80, "gray", "functionNull", "functionNull", "functionNull");
	addButton("#car_robot_ctrl", "leftButton", 150, 250, 80, "gray", "functionNull", "functionNull", "functionNull");
	addButton("#car_robot_ctrl", "rightButton", 450, 250, 80, "gray", "functionNull", "functionNull", "functionNull");
	addButton("#car_robot_ctrl", "speedU", 660, 200, 40, "black", "speedU", "stop", "stop");
	addButton("#car_robot_ctrl", "speedD", 700, 300, 40, "black", "speedD", "stop", "stop");
	addButton("#car_robot_ctrl", "autoModalityButton", 600, 100, 50, "gray", "autoModality", "functionNull", "functionNull");
	addButton("#car_robot_ctrl", "manualModalityButton", 720, 100, 50, "green", "manualModality", "functionNull", "functionNull");
}

function addButton(canvasName, buttonName, x, y, size, color, function_mouse_down, function_mouse_up, function_mouse_out) {
	$(canvasName).drawArc({
		draggable: false,
		name: buttonName,
		layer: true,
		fillStyle: color,
		bringToFront: false,
		x: x,
		y: y,
		radius: size,
		mousedown: function () {
			eval(function_mouse_down)();
		},
		mouseup: function () {
			eval(function_mouse_up)();
		},
		mouseout: function () {
			eval(function_mouse_out)();
		}
	});
}

function start_new_client(command) {

	var ws_client = new WebSocket("ws://192.168.43.73:8000");

	ws_client.onopen = function () {
		append(command);
		ws_client.send(command);
	}

	ws_client.onmessage = function (event) {
		append(event.data);
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

function speedU() {
	var command = "command|speedU#"
	start_new_client(command);
}

function speedD() {
	var command = "command|speedD#"
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

function autoModality() {
	removeButtons();
	autoModalityButtons();

	var command = "command|auto#";
	autoModalityTimer = setInterval(function () {
		start_new_client(command);
	}, 900);
}

function manualModality() {
	removeButtons();
	manualModalityButtons();

	clearTimeout(autoModalityTimer);
	var command = "command|manual#";
	start_new_client(command);
}

function functionNull() {
	append("[INFO] pressed");
}

function append(text) {
	$("#eventi_websocket").append("<li>" + text + "</li>");
}