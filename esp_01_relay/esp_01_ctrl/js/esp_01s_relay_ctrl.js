var ws_client = null;
var string_connection = "ws://192.168.43.90:8000";

$(document).ready(function() {
	addButton("#surface", "led_on", 110, 150, 100, "green", "led_on");
	addButton("#surface", "led_off", 350, 150, 100, "red", "led_off");
});

function addButton(canvasElement, name, x, y, size, color, function_name) {
	$(canvasElement).drawArc({
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

function led_on() {
	startWsConn("command|led_on#");
}

function led_off() {
	startWsConn("command|led_off#");
}

function startWsConn(command) {

	ws_client = new WebSocket(string_connection);
	append("[INFO] Start ws-client");
	ws_client.onopen = function(event) {
		append("[INFO] Connected to server!");
		ws_client.send(command);
	}

	ws_client.onmessage = function (event) {
		var msg = event.data;
		append("[INFO] Msg from server!");
		if (msg=="led|on") {
			append("[INFO] led on!");
		} else if (msg=="led|off") {
			append("[INFO] led off!");
		}

		// var counter_start = msg.indexOf("(");
		// var counter_end = msg.lastIndexOf(")");
		// counter = msg.substring(counter_start+1, counter_end);
	}

	ws_client.onclose = function(event) {
		append("[WARNING] Close connection!");
	}

	ws_client.onerror = function(event) {
		append("[ERROR] Connection Error!");
	}
}

function reset_log () {
	$("#log_value").empty();
}

function addText(canvasElement, textName, text, x, y, color, size) {
	$(canvasElement).drawText({
		name: textName,
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

function append(text) {
	$("#log_value").append("<li>" + text + "</li>");
}
