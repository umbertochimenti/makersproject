var webSocket;
var led_state = false;

$(document).ready(function() {
	start_websockets_client();
	check_web_request();
});

function start_websockets_client() {

	webSocket = new WebSocket('ws://localhost:4500');
	webSocket.onerror = function(event) {

	};

	webSocket.onopen = function(event) {
		check_web_request();
	};

	webSocket.onmessage = function(event) {
		var url = "http://iotcanudogalileigioia.altervista.org/php/update_board_value.php?callback=?"
		//var url = "../../web_ctrl_board/php/update_board_value.php?callback=?"
		$.getJSON(url, event.data, function(res) {
			append("led: " + res.led);
		});
	};
}

function check_web_request() {
	setInterval(() => {
		var url = "http://iotcanudogalileigioia.altervista.org/php/web_request.php?callback=?"
		//var url = "../../web_ctrl_board/php/web_request.php?callback=?"		
		$.getJSON(url, 'web=req', function(res) {
			append("button1: " + res.button1);
			//append("button2: " + res.button2);
			if (res.button1 == 1) {
				led_on();
			} else if (res.button1 == 0) {
				led_off();
			}
		});
	}, 2000);
}

function led_on() {
	led_state = true;
	webSocket.send("led|on#");
}

function led_off() {
	led_state = false;
	webSocket.send("led|off#");
}


function change_led_state() {
	if(!led_state) {
		led_state = true;
		webSocket.send("led|on#");
	} else {
		led_state = false;
		webSocket.send("led|off#");
	}
}


function append(text) {
	$("#ws_events").append("<li>" + text + "</li>");
}