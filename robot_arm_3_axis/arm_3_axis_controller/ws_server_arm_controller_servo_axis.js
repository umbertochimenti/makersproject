var WebSocketServer = require('websocket').server;
var http = require('http');
var server = http.createServer(function(request, response) { });

server.listen(4500, function() { 
	console.log('[INFO] server ws listen on 4500!');
});

wsServer = new WebSocketServer({
    httpServer: server
});


const {Board, Servo} = require("johnny-five");
const board = new Board();
var servoLeftRight, servoUpDown, servoOpenClose;
var servoLeftRightValue = 120;
var servoUpDownValue = 120;
var servoOpenCloseValue = 100;


board.on("ready", () => {
	servoLeftRight = new Servo(10);
	servoUpDown = new Servo(11);
	servoOpenClose = new Servo(12);

	servoLeftRight.to(servoLeftRightValue);
	servoUpDown.to(servoUpDownValue);
	servoOpenClose.to(servoOpenCloseValue);

});

wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
			
			var clientMsg = message.utf8Data;
			console.log('[INFO] client msg: ' + clientMsg);

			if (clientMsg == "arm|left#") {
				console.log('[INFO] arm left!');
				servoLeftRight.step(-10);
			} else if (clientMsg == "arm|right#") {
				console.log('[INFO] arm right!');
				servoLeftRight.step(10);
			} else if (clientMsg == "arm|up#") {
				console.log('[INFO] arm up!');
				servoUpDown.step(10);
			} else if (clientMsg == "arm|down#") {
				console.log('[INFO] arm down!');
				servoUpDown.step(-10);
			} else if (clientMsg == "arm|stop#") {
				console.log('[INFO] arm stop!');
			} else if (clientMsg == "arm|open#") {
				console.log('[INFO] arm open!');
				servoOpenClose.step(10);
			} else if (clientMsg == "arm|close#") {
				console.log('[INFO] arm go close!');
				servoOpenClose.step(-10);
			}
        }
	});
	
    connection.on('close', function(connection) {
		console.log('[INFO] client close!');
	});
});
