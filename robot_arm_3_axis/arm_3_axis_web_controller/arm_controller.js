var ws_client;

$(document).ready(function() {
	addButton("#controller","upButton", 300, 150, 80, "blue", "goOn", "stop", "stop");
	addButton("#controller","downButton", 300, 350, 80, "blue", "goDown", "stop", "stop");
	addButton("#controller","leftButton", 150, 250, 80, "green", "goLeft", "stop", "stop");
	addButton("#controller","rightButton", 450, 250, 80, "green", "goRight", "stop", "stop");
	addButton("#controller","openPlier", 650, 100, 50, "purple", "armOpen", "stop", "stop");
	addButton("#controller","closePlier", 800, 100, 50, "red", "armClose", "stop", "stop");
	start_new_client("[INFO] Hello from arm controller!");
});

function start_new_client(command) {

	ws_client = new WebSocket( "ws://127.0.0.1:4500");
	
	ws_client.onopen = function() {
		append(command);
		ws_client.send(command);	
	}

	ws_client.onmessage = function(event) {
		append(event.data);
	}
}

function goOn() {
	var command = "arm|up#";
	ws_client.send(command);
}

function goDown() {
	var command = "arm|down#";
	ws_client.send(command);
}

function goLeft() {
	var command = "arm|left#";
	ws_client.send(command);
}

function goRight() {
	var command = "arm|right#";
	ws_client.send(command);
}

function stop() {
	var command = "arm|stop#";
	ws_client.send(command);
}

function armOpen() {
	var command = "arm|open#";
	ws_client.send(command);
}

function armClose() {
	var command = "arm|close#";
	ws_client.send(command);
}

function functionNull() {
	append("[INFO] null");
}

function append(text) {
	$("#events").append("<li>" + text + "</li>");
}

function addButton(canvasName, buttonName, x, y, size, color, function_mouse_down, function_mouse_up, function_mouse_out) {
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
			eval(function_mouse_out)();
		}
	});
}
