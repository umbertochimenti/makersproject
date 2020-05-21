$(document).ready(function() {

	drawSoccerTable();
	//drawSoccerGoal();
	//draw_text("GOAL!", 300, 200);
	draw_goal_door(0, 100, 0, 300);
	draw_goal_door(640, 100, 640, 300);
	draw_circle("team1", "yellow", 50, 50, 30);
	draw_circle("team2", "red", 150, 150, 30);
	draw_circle("ball", "blue", 100, 100, 20);

	setInterval(function() {
	
		var ws_client = new WebSocket( "ws://127.0.0.1:8900", "example-protocol" );

		ws_client.onmessage = function(event) {
			msg = event.data;
			append(msg);
			x = msg.substring(msg.indexOf("(")+1, msg.indexOf(","));
			y = msg.substring(msg.indexOf(",")+1, msg.indexOf(")"));

			if(msg.indexOf("t1(")>-1) {
				move_object("team1", parseInt(x), parseInt(y));
			} else if(msg.indexOf("t2(")>-1) {
				move_object("team2", parseInt(x), parseInt(y));
			} else if(msg.indexOf("ball(")>-1) {
				move_object("ball", parseInt(x), parseInt(y));
				if(parseInt(x) < 70 || parseInt(x) > 570)
					draw_text("GOAL!", 300, 200);
			}
		}

		ws_client.onopen = function(){
			append("connessione effettuata"); 
			ws_client.send("request(table)");
		}

		ws_client.onclose = function(){
			append("connessione chiusa");
		}

		ws_client.onerror = function(){
			append("errore nella connessione");
		}	
	}, 300);
});

function move_object(object, x_pos,y_pos) {
	
	$("#soccertable").animateLayer(object, {
			}, 200, function(layer) {
				$(this).animateLayer(layer, {
				x: x_pos, y: y_pos
			}, 'slow', 'swing');
	});
}

function append(text) {
	$("#eventi_websocket").append("<li>" + text + ";</li>");
}

function simulateChangePosition() {

}

function drawSoccerTable() {
	$("#soccertable").drawRect({
		fillStyle: 'green',
		strokeStyle: 'blue',
		strokeWidth: 4,
		x: 0, y: 0,
		fromCenter: false,
		width: 640,	height: 480,
		layer: true
	});
}

function draw_goal_door(x1, y1, x2, y2) {

	$("#soccertable").drawLine({
	  strokeStyle: 'rgb(200, 200, 200)',
	  strokeWidth: 10,
	  rounded: true,
	  closed: true,
	  x1: x1, y1: y1,
	  x2: x2, y2: y2,
	  layer: true,
	});
}

function draw_text(text, x, y) {
	$("#soccertable").drawText({
		name: 'goalText',
		fillStyle: '#9cf',
		strokeStyle: '#25a',
		strokeWidth: 2,
		x: x, y: y,
		fontSize: 100,
		text: text,
		layer: true,
		visible: true,
		rotate: 30
	  });
}

function draw_circle(name, color, x, y, r) {

	$("#soccertable").drawArc({
		name: name,
  		fillStyle: color,
  		x: x, y: y,
  		radius: r,
		layer: true
	});
}
