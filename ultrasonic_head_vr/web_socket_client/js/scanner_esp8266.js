var scan_timer = null;
var up_distance_zero = 270;
var up_distance = 0;
var left_distance_zero = 250;
var left_distance = 0;
var right_distance_zero = 310;
var right_distance = 0;
var ws_client_local_com = null;

$(document).ready(function() {
	addText("#userCommand","Scan On", 100, 20, "blue", 24);
	addButton("scanStart", 100, 100, 60, "blue", "scan_start");
	addText("#userCommand", "Scan Off", 300, 20, "red", 24);
	addButton("scanStop", 300, 100, 60, "red", "scan_stop");
	drawCar();
	drawDistanceSpacer();
	ws_client_to_local_server();
});

function drawCar() {
	$("#surface").drawRect({
		fillStyle: "green",
		x: 280, y: 300,
		width: 50,
		height: 50
	  });
}

function drawDistanceSpacer() {
	$("#surface").clearCanvas();
	drawCar();
	var up = (up_distance_zero-up_distance*6);
	addLine("upLine","red",130,up,450,up);
	addText("#surface","distance: " + up_distance + " cm", 100, 80, "red", 24);
	var left = (left_distance_zero-left_distance*6);
	addLine("leftLine","blue",left,20,left,350);
	addText("#surface","distance: " + left_distance + " cm", 100, 380, "blue", 24);
	var right = (right_distance_zero+right_distance*6);
	addLine("leftLine","magenta",right,20,right,350);
	addText("#surface","distance: " + right_distance + " cm", 450, 380, "magenta", 24);
}

function reset_log () {
	$("#scannerValue").empty();
}

function ws_client_to_local_server() {
	
	ws_client_local_com = new WebSocket( "ws://localhost:9000");
	
	ws_client_local_com.onopen = function(event) {
		append("[INFO] Connected to server!");
	}

	ws_client_local_com.onmessage = function (event) {
		append("[INFO] Receive msg from server: " + event.data);
		var msg = event.data;
		var index_left_distance = msg.indexOf("(");
		var index_up_distance = msg.indexOf("|");
		var index_right_distance = msg.lastIndexOf("|");
		left_distance = msg.substring(index_left_distance+1, index_up_distance);
		up_distance = msg.substring(index_up_distance+1, index_right_distance);
		right_distance = msg.substring(index_right_distance+1, msg.length-1);
		append("left: " + left_distance + " up: " + up_distance + " right: " + right_distance);
		drawDistanceSpacer();
	}

	ws_client_local_com.onclose = function(event) {
		append("[WARNING] Close connection!");
	}
	ws_client_local_com.onerror = function(event) {
		append("[ERROR] Connection Error!");
	}
}

function scan_start() {
	append("[INFO] Scan start ...");
	scan_timer = setInterval(function() {
		scanning();
	}, 400);
}

function scanning() {
	ws_client_local_com.send("ID_JS");
}

function scan_stop() {
	append("[INFO] Scan stop!");
	window.clearTimeout(scan_timer);
}

function addText(canvasElement, text, x, y, color, size) {
	$(canvasElement).drawText({
		draggable: true,
		fillStyle: color, 
		strokeStyle: color,
		strokeWidth: 2,
		x: x,
		y: y,
		fontSize: size,
		fontFamily: 'sans-serif',
		text: text
	});
}

function addButton(name, x, y, size, color, function_name) {
	$("#userCommand").drawArc({
		draggable: true,
		name: name,
		layer: true,
		fillStyle: color,
		bringToFront: false,
		x: x, y: y, radius: size,
		click: function() {
			eval(function_name)();
		}
	});
}

function addLine(name, color, x1, y1, x2, y2) {

	$("#surface").drawLine({
		name: name,
		strokeStyle: color,
		strokeWidth: 10,
  		x1: x1, y1: y1,
  		x2: x2, y2: y2
	});
}

function onEffect(name, color) {

	$("#userCommand").animateLayer(name, {
	}, 1000, function(layer) {
	  $(this).animateLayer(layer, {
		fillStyle: color
	  }, 'swing');
	});
}

function append(text) {
	$("#scannerValue").append("<li>" + text + "</li>");
}
