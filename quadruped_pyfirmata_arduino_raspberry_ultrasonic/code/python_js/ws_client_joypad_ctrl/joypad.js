var ws_client;
var robot_dir = [false,false,false,false]; //front, back, right, left
var joypad_size = [0, 0, 0]; //x, y, radius

$(document).ready(function() {
	addJoypad();
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
	ws_client = new WebSocket( "ws://192.168.43.115:9000");
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

function append(text) {
	$("#eventi_websocket").append("<li>" + text + "</li>");
}

function front() {
	robot_dir[0] = true;
	append("command|on#");
	ws_client.send("command|quadruped_on#");
}

function back() {
	robot_dir[1] = true;
	append("command|back#");
	ws_client.send("command|quadruped_back#");
}

function left() {
	robot_dir[3] = true;
	append("command|left#");
	ws_client.send("command|quadruped_left#");
}

function right() {
	robot_dir[2] = true;
	append("command|right#");
	ws_client.send("command|quadruped_right#");
}

function stop() {
	for (var i = 0; i < robot_dir.length; i++)
		robot_dir[i] = false;
	append("command|stop#");
	ws_client.send("command|quadruped_stop#");
}
