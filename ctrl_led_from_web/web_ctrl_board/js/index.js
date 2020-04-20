$(document).ready(function() {
	$("#led_on").click(function() {
		press_button(1);
	});

	$("#led_off").click(function() {
		press_button(0);
	});

	update_board_status();
});

function update_board_status(){
	setInterval(() => {

		var data = "";
		$.ajax
		({
			type: "POST",
			url: "../php/read_board.php",
			data: data,
			success: function(board) {
				var board_led = board.substring(board.indexOf(":")+3,board.indexOf("'}"));
				if(parseInt(board_led) == 1) {
					//alert(board_led);
					$("#led_state").css("background-color", "green");
				} else {
					$("#led_state").css("background-color", "red");
				}
			},
			error: function () {
				alert("[ERROR] Not read board file!");
			}
		});
	}, 2000);
}


function press_button(button_switch) {
	var req = { button1: button_switch, button2: -1 };
	var req_json = JSON.stringify(req);
	var data = {};
	data.json_req = req_json;
	$.ajax
	({
		type: "POST",
		url: "../php/save_request.php",		
		data: data,
		success: function() {

		},
		error: function () {
			alert("[ERROR] Not saved file!");
		}
	});
}