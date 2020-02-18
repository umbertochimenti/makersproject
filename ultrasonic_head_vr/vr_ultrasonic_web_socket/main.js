var camera, scene, renderer;
var geometry, material;
var left, right, up, car;
var left_max = 1.5;
var left_zero = 0.15;
var right_max = -1.5;
var right_zero = -0.15;
var up_max = 0.8;
var up_zero = -0.2;
var car_initial = -0.4;
var up_distance = 0.00;
var left_distance = 0.00;
var right_distance = 0.00;


var ws_client_local_com = null;

window.onload = function() {
    init();
	animate();
	ws_client_to_local_server();
	scan_start();
};

function ws_client_to_local_server() {
	
	ws_client_local_com = new WebSocket( "ws://localhost:9000");
	
	ws_client_local_com.onopen = function(event) {
		console.log("[INFO] Connected to server!");
	}

	ws_client_local_com.onmessage = function (event) {
		//console.log("[INFO] Receive msg from server: " + event.data);
		var msg = event.data;
		var index_left_distance = msg.indexOf("(");
		var index_up_distance = msg.indexOf("|");
		var index_right_distance = msg.lastIndexOf("|");
		left_distance = parseFloat(msg.substring(index_left_distance+1, index_up_distance))/100;
		up_distance = parseFloat(msg.substring(index_up_distance+1, index_right_distance))/100;
		right_distance = -(parseFloat(msg.substring(index_right_distance+1, msg.length-1))/100);
		console.log("left: " + left_distance + " up: " + up_distance + " right: " + right_distance);
	}

	ws_client_local_com.onclose = function(event) {
		console.log("[WARNING] Close connection!");
	}
	ws_client_local_com.onerror = function(event) {
		console.log("[ERROR] Connection Error!");
	}
}

function scan_start() {
	scan_timer = setInterval(function() {
		console.log("ok, jon");
		ws_client_local_com.send("ID_JS");
	}, 400);
}

function init() {

	camera = new THREE.PerspectiveCamera( 70, (window.innerWidth/ window.innerHeight), 0.1, 2);
	camera.position.z = 1;

	scene = new THREE.Scene();
	material = new THREE.MeshNormalMaterial();

	left = new THREE.BoxGeometry(0.1, 0.8, 0.2);
	right = new THREE.BoxGeometry(0.1, 0.8, 0.2);
	up = new THREE.BoxGeometry(0.8, 0.1, 0.4);
	car = new THREE.BoxGeometry(0.2, 0.2, 0.1);

	//positioning
	left.translate(left_zero, -0.3, 0);
	right.translate(right_zero, -0.3, 0);
	up.translate(0, up_zero, 0);
	car.translate(0, car_initial, 0);

	
	leftBlock = new THREE.Mesh(left, material);
	rightBlock = new THREE.Mesh(right, material);
	upBlock = new THREE.Mesh(up, material);
	carBlock = new THREE.Mesh(car, material);
	scene.add(leftBlock);
	scene.add(rightBlock);
	scene.add(upBlock);
	scene.add(carBlock);

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

}

function animate() {
	requestAnimationFrame( animate );
	leftBlock.position.set(left_distance, 0, 0);
	rightBlock.position.set(right_distance, 0, 0);
	upBlock.position.set(0, up_distance, 0);
	renderer.render( scene, camera );
}
