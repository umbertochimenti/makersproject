var WebSocketServer = require('websocket').server;
var http = require('http');
var server = http.createServer(function(request, response) { });

server.listen(4500, function() { 
	console.log('[INFO] server ws listen on 4500!');
});

wsServer = new WebSocketServer({
    httpServer: server
});


var five = require("johnny-five"), board = new five.Board();
board.on("ready", function() {

	var led = new five.Led(13);
	
	wsServer.on('request', function(request) {
		
		var connection = request.accept(null, request.origin);
		
		connection.on('message', function(message) {
			if (message.type === 'utf8') {
				var clientMsg = message.utf8Data;
				console.log('[INFO] client msg: ' + clientMsg);
				if (clientMsg == "led|on#") {
					led.on();
					connection.send("led=1");
				} else if (clientMsg == "led|off#") {
					led.off();
					connection.send("led=0");
				}
			}
		});
		
		connection.on('close', function(connection) {
			console.log('[INFO] client close!');
		});
	});
});
