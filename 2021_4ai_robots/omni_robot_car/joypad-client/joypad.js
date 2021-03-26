var ws_client;
var robot_dir = [false,false,false,false]; //front, back, right, left
var joypad_size = [0, 0, 0]; //x, y, radius

$(document).ready(function() {
	addJoypad();
	addButtons();
	add_web_sockets();
});

function resizeCanvas() {
	var ctx = document.getElementById("joypad");
	ctx.width  = window.innerWidth;
	ctx.height = window.innerHeight;
	if(window.innerWidth <= window.innerHeight) {
		joypad_size[0] = window.innerWidth/2+10;
		joypad_size[1] = window.innerWidth/2+10;
		joypad_size[2] = window.innerWidth/2-20;
	} else {
		joypad_size[0] = window.innerHeight/2+10;
		joypad_size[1] = window.innerHeight/2+10;
		joypad_size[2] = window.innerHeight/2-20;
	}
}

function add_web_sockets() {
	ws_client = new WebSocket( "ws://192.168.137.117:9000");
	ws_client.onmessage = function(event) {
		append("messaggio: " + event.data);
	}
	ws_client.onopen = function() {
		append("connessione effettuata"); 
		ws_client.send("ok, jon!");	
	}
	ws_client.onclose = function() {
		append("connessione chiusa");
	}
	ws_client.onerror = function() {
		append("errore nella connessione");
	}
}

function addJoypad() {
	resizeCanvas();
	drawJoyBack();
	drawJoyFore();
}

function drawJoyBack() {
	$("#joypad").drawArc({
		draggable: true,
		name: 'background',
		fillStyle: 'rgb(100,100,255)', 
		bringToFront: false,
		x: joypad_size[0],
		y: joypad_size[1],
		radius: joypad_size[2],
		
		drag: function(layer) {
			layer.x = joypad_size[0];
			layer.y = joypad_size[1];
		}
	});
}

function returnToHome (layerName) {
	$("#joypad").animateLayer(layerName, {
		x: joypad_size[0],
		y: joypad_size[1],
		radius: joypad_size[2]/4,
	}, 10, function(layer) { // Callback function
		$(this).animateLayer(layer, {
			x: joypad_size[0],
			y: joypad_size[1],
			opacity: 1
		}, 'slow', 'ease-in-out');
	});
}

function angle(cx, cy, ex, ey) {
	var dy = ey - cy;
	var dx = ex - cx;
	var theta = Math.atan2(dy, dx);
	return theta;
}

function drawJoyFore() {
	$("#joypad").addLayer({
		type: 'arc',
		fillStyle: 'rgb(200,100,255)', 
		fromCenter: true, draggable: true,
		name: 'foreground',
		x: joypad_size[0],
		y: joypad_size[1],
		radius: joypad_size[2]/4,
		drag: function(layer) {
			var x1 = layer.x;
			var y1 = layer.y;
			var x0 = joypad_size[0];
			var y0 = joypad_size[1];
			var r = joypad_size[2]-joypad_size[2]/4;
			//calcolo della distanza tra il centro di sfondo e il centro del cerchietto centrale
			var value_to_check = Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0));
			//calcolo dell'angolo tra il centro del cerchio di sfondo e il centro del cerchietto centrale
			var a = angle(x0, y0, x1, y1);
			var a_angle = a * 180 / Math.PI;

			if (value_to_check > r-(r/3)) {
				if (a_angle >= -45 && a_angle < 45 && robot_dir[2] === false)
					right();
				else if (a_angle >= -135 && a_angle < -45 && robot_dir[0] === false)
					front();
				else if ((a_angle <= -135 && a_angle >= -180) || (a_angle >= 135 && a_angle <= 180) && robot_dir[3] === false)
					left();
				else if (a_angle >= 45 && a_angle < 135 && robot_dir[1] == false)
					back();
			} else if (robot_dir.includes(true)) {
				stop();
			}

			if (value_to_check > r) {
				//calcolo del centro del cerchietto centrale (x,y) a partire dall'angolo 	
				layer.x = x0 + r * Math.cos(a);
				layer.y = y0 + r * Math.sin(a);
			}
		},

		dragstop: function(layer) {
			console.log("return home: " + layer.name);
			returnToHome(layer.name);
			stop();
		},

		dragcancel: function(layer) {
			console.log("return home");
			returnToHome(layer.name);
			stop();
		},
	}).drawLayers();
}

function addButtons() {
	addButton_omni("#joypad", "R_UP", "blue", "coral", joypad_size[0]*2.2, joypad_size[0]/3.5, joypad_size[0]/6, trasl_right_up, stop);
	addButton_omni("#joypad", "L_UP", "blue", "coral", joypad_size[0]*2.2, joypad_size[0]/1.55, joypad_size[0]/6, trasl_left_up, stop);
	addButton_omni("#joypad", "L_down", "blue", "coral", joypad_size[0]*2.2, joypad_size[0]*1.35, joypad_size[0]/6, trasl_left_down, stop);
	addButton("#joypad", "arm_off", "red", "coral", joypad_size[0]*2.2, joypad_size[0], joypad_size[0]/6, arm_off);
	addButton_omni("#joypad", "R_down", "blue", "coral", joypad_size[0]*2.2, joypad_size[0]*1.7, joypad_size[0]/6, trasl_right_down, stop);
	addButton_omni("#joypad", "tr_R", "blue", "coral", joypad_size[0]*2.7, joypad_size[0]/3.5, joypad_size[0]/6, trasl_right, stop);
	addButton_omni("#joypad", "tr_L", "blue", "coral", joypad_size[0]*3.3, joypad_size[0]/3.5, joypad_size[0]/6, trasl_left, stop);
	
	addButton("#joypad", "1 -", "red", "green", joypad_size[0]*2.7, joypad_size[0]/1.40, joypad_size[0]/8, arm_axis1_sx);
	addButton("#joypad", "1 +", "red", "green", joypad_size[0]*3.0, joypad_size[0]/1.40, joypad_size[0]/8, arm_axis1_dx);
	addButton("#joypad", "2 -", "red", "yellow", joypad_size[0]*2.7, joypad_size[0], joypad_size[0]/8, arm_axis2_down);
	addButton("#joypad", "2 +", "red", "yellow", joypad_size[0]*3.0, joypad_size[0], joypad_size[0]/8, arm_axis2_up);
	addButton("#joypad", "3 -", "red", "blue", joypad_size[0]*2.7, joypad_size[0] + joypad_size[0]/3.5, joypad_size[0]/8, arm_axis3_down);
	addButton("#joypad", "3 +", "red", "blue", joypad_size[0]*3.0, joypad_size[0] + joypad_size[0]/3.5, joypad_size[0]/8, arm_axis3_up);

	addButton("#joypad", "4 -", "Chartreuse", "red", joypad_size[0]*3.3, joypad_size[0]/1.40, joypad_size[0]/8, arm_axis4_down);
	addButton("#joypad", "4 +", "Chartreuse", "red", joypad_size[0]*3.6, joypad_size[0]/1.40, joypad_size[0]/8, arm_axis4_up);
	addButton("#joypad", "5 -", "Chartreuse", "DarkOrange", joypad_size[0]*3.3, joypad_size[0], joypad_size[0]/8, arm_axis5_down);
	addButton("#joypad", "5 +", "Chartreuse", "DarkOrange", joypad_size[0]*3.6, joypad_size[0], joypad_size[0]/8, arm_axis5_up);
	addButton("#joypad", "6 -", "Chartreuse", "blue", joypad_size[0]*3.3, joypad_size[0] + joypad_size[0]/3.5, joypad_size[0]/8, arm_axis6_down);
	addButton("#joypad", "6 +", "Chartreuse", "blue", joypad_size[0]*3.6, joypad_size[0] + joypad_size[0]/3.5, joypad_size[0]/8, arm_axis6_up);

	addButton("#joypad", "C_up", "yellow", "green", joypad_size[0]*2.7, joypad_size[0] + joypad_size[0]/1.5, joypad_size[0]/6, servo_cam_up);
	addButton("#joypad", "OpenCV", "lime", "coral", joypad_size[0]*3.15, joypad_size[0] + joypad_size[0]/1.5, joypad_size[0]/6, link_opencv);
	addButton("#joypad", "C_down", "yellow", "green", joypad_size[0]*3.6, joypad_size[0] + joypad_size[0]/1.5, joypad_size[0]/6, servo_cam_down);

}

function addButton_omni(canvas_name, button_name, color, color_click, b_x, b_y, r, function_name, function_name_2) {

	$(canvas_name).drawArc({
		draggable: true,
		name: button_name,
		fillStyle: color,
		bringToFront: false,
		x: b_x,
		y: b_y,
		radius: r,
		
		drag: function(layer) {
			layer.x = b_x;
			layer.y = b_y;
		}, 
		dragcancel: function(layer) {
			layer.x = b_x;
			layer.y = b_y;
		},
		mousedown: function(layer) {
			click_effect(button_name, color, color_click);
			eval(function_name());
		},
		mouseup: function(layer) {
			click_effect(button_name, color, color_click);
			eval(function_name_2());
		},
		touchstart: function(layer) {
			click_effect(button_name, color, color_click);
			eval(function_name());
		}
	});

	$(canvas_name).drawText({
		draggable: true,
		fillStyle: "black",
		x: b_x,
		y: b_y,
		fontSize: 30,
		text: button_name,
		drag: function(layer) {
			layer.x = b_x;
			layer.y = b_y;
		}, 
		dragcancel: function(layer) {
			layer.x = b_x;
			layer.y = b_y;
		},
		mousedown: function(layer) {
			click_effect(button_name, color, color_click);
			eval(function_name());
		},
		mouseup: function(layer) {
			click_effect(button_name, color, color_click);
			eval(function_name_2());
		},
		touchstart: function(layer) {
			click_effect(button_name, color, color_click);
			eval(function_name());
		}
	});
}

function addButton(canvas_name, button_name, color, color_click, b_x, b_y, r, function_name) {

	$(canvas_name).drawArc({
		draggable: true,
		name: button_name,
		fillStyle: color,
		bringToFront: false,
		x: b_x,
		y: b_y,
		radius: r,
		
		drag: function(layer) {
			layer.x = b_x;
			layer.y = b_y;
		}, 
		dragcancel: function(layer) {
			layer.x = b_x;
			layer.y = b_y;
		},
		click: function(layer) {
			click_effect(button_name, color, color_click);
			eval(function_name());
		},
		touchstart: function(layer) {
			click_effect(button_name, color, color_click);
			eval(function_name());
		}
	});

	$(canvas_name).drawText({
		draggable: true,
		fillStyle: "black",
		x: b_x,
		y: b_y,
		fontSize: 30,
		text: button_name,
		drag: function(layer) {
			layer.x = b_x;
			layer.y = b_y;
		}, 
		dragcancel: function(layer) {
			layer.x = b_x;
			layer.y = b_y;
		},
		click: function(layer) {
			click_effect(button_name, color, color_click);
			eval(function_name());
		},
		touchstart: function(layer) {
			click_effect(button_name, color, color_click);
			eval(function_name());
		}
	});
}

function click_effect (button, color0, color1) {
	$("#joypad").animateLayer(button, {
		fillStyle: color1,
	}, 10, function(layer) { // Callback function
		$(this).animateLayer(layer, {
			fillStyle: color0,
		}, 'fast', 'ease-in-out');
	});
}

function  test_function() {
	console.log("ok, jon!");
}

function append(text) {
	$("#eventi_websocket").append("<li>" + text + "</li>");
}

function trasl_right_up() {
	append("command|right_up#");
	ws_client.send("command|car_right_up#");
}

function trasl_right_down() {
	append("command|right_down#");
	ws_client.send("command|car_right_down#");
}

function trasl_left_up() {
	append("command|left_up#");
	ws_client.send("command|car_left_up#");
}

function trasl_left_down() {
	append("command|left_down#");
	ws_client.send("command|car_left_down#");
}

function trasl_right() {
	append("command|trasl_right#");
	ws_client.send("command|car_trasl_right#");
}

function trasl_left() {
	append("command|trasl_left#");
	ws_client.send("command|car_trasl_left#");
}

/*function arm_on() {
	append("arm_on")
	ws_client.send("command|arm_on#");
}*/

function arm_off() {
	append("arm_off")
	ws_client.send("command|arm_off#");
}

function arm_axis1_sx() {
	append("arm1_sx")
	ws_client.send("command|arm1_sx#");
}

function arm_axis1_dx() {
	append("arm1_dx")
	ws_client.send("command|arm1_dx#");
}

function arm_axis2_up() {
	append("arm2_up")
	ws_client.send("command|arm2_up#");
}

function arm_axis2_down() {
	append("arm2_down")
	ws_client.send("command|arm2_down#");
}

function arm_axis3_up() {
	append("arm3_up")
	ws_client.send("command|arm3_up#");
}
function arm_axis3_down() {
	append("arm3_down")
	ws_client.send("command|arm3_down#");
}

function arm_axis4_down() {
	append("arm4_down")
	ws_client.send("command|arm4_down#");
}

function arm_axis4_up() {
	append("arm4_up")
	ws_client.send("command|arm4_up#");
}

function arm_axis5_up() {
	append("arm5_up")
	ws_client.send("command|arm5_up#");
}

function arm_axis5_down() {
	append("arm5_down")
	ws_client.send("command|arm5_down#");
}

function arm_axis6_down() {
	append("arm6_down")
	ws_client.send("command|arm6_down#");
}

function arm_axis6_up() {
	append("arm6_up")
	ws_client.send("command|arm6_up#");
}


function front() {
	robot_dir[0] = true;
	append("command|on#");
	ws_client.send("command|car_on#");
}

function back() {
	robot_dir[1] = true;
	append("command|back#");
	ws_client.send("command|car_down#");
}

function left() {
	robot_dir[3] = true;
	append("command|left#");
	ws_client.send("command|car_left#");
}

function right() {
	robot_dir[2] = true;
	append("command|right#");
	ws_client.send("command|car_right#");
}

function stop() {
	for (var i = 0; i < robot_dir.length; i++)
		robot_dir[i] = false;
	append("command|stop#");
	ws_client.send("command|car_stop#");
}


function servo_cam_up() {
	append("cam_up")
	ws_client.send("command|cam_up#");
}

function servo_cam_down() {
	append("cam_down")
	ws_client.send("command|cam_down#");
}

function link_opencv() {
	window.open(
		'http://192.168.137.117:9001/',
		'_blank' // <- This is what makes it open in a new window.
	  );
	//location.href = "http://192.168.137.140:9001/"; //This is what makes it open in the same window.
}
