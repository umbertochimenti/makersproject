var webSocket;
var led_state = false;

$(document).ready(function() {
	start_websockets_client();
	$("#ctrl_led").click(function() {
		change_led_state();
	});
});

function start_websockets_client() {
	webSocket = new WebSocket('ws://192.168.43.19:4500');
	webSocket.onerror = function(event) {
		//alert("[ERROR] Error!!!");
	};

	webSocket.onopen = function(event) {
		//alert("[INFO] Connected to server!");
	};

	webSocket.onmessage = function(event) {

		var data = {};
		data.msg = event.data;

		$.ajax
		({
			type: "POST",
			url: "http://localhost/ctrl_led_from_web/php/update_board_value.php",
			data: data,
			success: function(result) {
				alert("ok" + result);
			},
			error: function(req,state,err) {
				//alert(err);
				alert("err");
			 }
		});
	};
}

function change_led_state() {
	if(!led_state) {
		led_state = true;
		webSocket.send("led|on#");
		$("#ctrl_led").css("background-color","green");
		$("#ctrl_led").html("LED ON");
	} else {
		led_state = false;
		webSocket.send("led|off#");
		$("#ctrl_led").css("background-color","red");
		$("#ctrl_led").html("LED OFF");
	}
}
