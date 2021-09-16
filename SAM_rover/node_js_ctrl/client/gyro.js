var webSocket;
var plane_angle = {};

window.addEventListener('load', function () {
    ws_manage();
    ws_update_cycle_request();
});

function ws_manage() {
    webSocket = new WebSocket('ws://192.168.43.114:4500');
   webSocket.onopen = function(event) {
   console.log("[INFO] Connected to server!");
   };
   webSocket.onerror = function(event) {
   console.log("[ERROR] Not Connected to server!");
   };
   webSocket.onclose = function(event) {
   console.log("[INFO] Closed from server!");
   };
   webSocket.onmessage = function(event) {
   var msg = event.data;
    plane_angle = JSON.parse(msg);
    console.log("[INFO] msg: " + msg);
   };
   }

   function ws_update_cycle_request() {
    setInterval(function(){
    webSocket.send("command|mpu6050_data#");
    }, 200);
   }
