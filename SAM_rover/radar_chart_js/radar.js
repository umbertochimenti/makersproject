let scan_timer;
let ws_client_local_com;
var distances_value_from_radar = [];

const labels = [
    '0',
    '15',
    '30',
    '45',
    '60',
    '75',
    '90',
    '105',
    '120',
    '135',
    '150',
    '165',
    '180',
    '195',
    '210',
    '225',
    '240',
    '255',
    '270',
    '285',
    '300',
    '315',
    '330',
    '345',
    '360'
  ];

function create_chart() {

  const data = {
    labels: labels,
    datasets: [{
      label: 'SAM Ultrasonic Mobile Radar',
      backgroundColor: [
        'rgb(255, 0, 0)',
        'rgb(0, 255, 0)',
        'rgb(0, 0, 255)'
      ],
      borderColor: 'rgb(70, 140, 100)',
      data: distances_value_from_radar,
      fill:true,
    }]
  };

  var div_graph = document.getElementById("graph_div");
  div_graph.innerHTML = "<canvas id=\"my_chart\" height=\"500\"></canvas>";
  
  const config = {
    type: 'radar',
    data,
    options: {
        maintainAspectRatio: false,
        circumference: Math.PI,
        scale: {
          min: 0,
          max: 100,
      },
    }
  };

  const canv = document.getElementById("my_chart");
  const context = canv.getContext('2d');
  new Chart(context, config);
}

function ws_client_to_local_server() {
	
	ws_client_local_com = new WebSocket( "ws://localhost:9000");
	
	ws_client_local_com.onopen = function() {
		console.log("[INFO] Connected to server!");
	}

	ws_client_local_com.onmessage = function (event) {
    //console.log("[INFO] Receive msg from server: " + event.data);
    var json_radar_values = JSON.parse(event.data);
    distances_value_from_radar = [];
    for (var key in json_radar_values) {
      if (json_radar_values.hasOwnProperty(key)) {
          //console.log(key + " -> " + json_radar_values[key]);
          distances_value_from_radar.push(json_radar_values[key]);
      }
  }

  console.log(distances_value_from_radar);
  if(distances_value_from_radar)
    create_chart();
	}

	ws_client_local_com.onclose = function() {
		console.log("[WARNING] Close connection!");
	}
	ws_client_local_com.onerror = function() {
		console.log("[ERROR] Connection Error!");
	}
}

function scan_start() {
	console.log("[INFO] Scan start ...");
	scan_timer = setInterval(function() {
    scanning();
	}, 5000);
}

function scanning() {
	ws_client_local_com.send("JS_RADAR");
}

function scan_stop() {
	append("[INFO] Scan stop!");
	window.clearTimeout(scan_timer);
}

$(document).ready(function() {
  distances_value_from_radar = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  ws_client_to_local_server();
  scan_start();
});
