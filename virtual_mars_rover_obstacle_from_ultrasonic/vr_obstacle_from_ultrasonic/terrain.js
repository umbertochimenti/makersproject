import * as THREE from './three.module.js';
import { FirstPersonControls } from './RobotFirstPersonControls.js';
import { ImprovedNoise } from './ImprovedNoise.js';
let container;
let camera, controls, scene, renderer;
let mesh, texture;
const worldWidth = 256, worldDepth = 256;
const clock = new THREE.Clock();

var left_distance = 2000.0;
var right_distance = 2000.0;
var up_distance = 3000.0;
var test_distance = false;
var left_obstacle;
var right_obstacle;
var up_obstacle;
var ws_client_local_com = null;

init();
animate();

function init() {
    container = document.getElementById( 'container' );
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth/window.innerHeight, 1, 10000 );
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xefd1b5 );
    //scene.fog = new THREE.FogExp2( 0xefd1b5, 0.0025 );
    const data = generateHeight( worldWidth, worldDepth );
    camera.position.set( 100, 800, - 800 );
    camera.lookAt( - 100, 810, - 800 );
    const geometry = new THREE.PlaneGeometry(80000, 80000, worldWidth - 1, worldDepth - 1 );
    geometry.rotateX( - Math.PI / 2 );
    const vertices = geometry.attributes.position.array;
    for ( let i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
        vertices[ j + 1 ] = data[ i ] * 5;
    }
    texture = new THREE.CanvasTexture( generateTexture( data, worldWidth, worldDepth ) );
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture } ) );
    scene.add( mesh );
    add_obstacle("left");
    add_obstacle("right");
    add_obstacle("up");
    //add_obstacle();
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    controls = new FirstPersonControls( camera, renderer.domElement );
    controls.movementSpeed = 500;
    controls.lookSpeed = 0.1;
    window.addEventListener( 'resize', onWindowResize );
    //ultrasonic_obstacle_position_test();
    ws_client_to_local_server();
    scan_start();
}

function ultrasonic_obstacle_position_test() {
    setInterval(() => {
        if (up_distance > 7000)
            test_distance = true;
        else if (up_distance < 4000)
            test_distance = false;
        
        if(!test_distance) {
            left_distance += 300;
            right_distance += 250;
            up_distance += 500;
        } else {
            left_distance -= 300;
            right_distance -= 250;
            up_distance -= 500;
        }
    }, 1000);
}

function ws_client_to_local_server() {
	
	ws_client_local_com = new WebSocket( "ws://192.168.43.19:9000");
	
	ws_client_local_com.onopen = function(event) {
		console.log("[INFO] Connected to server!");
	}

	ws_client_local_com.onmessage = function (event) {
		console.log("[INFO] Receive msg from server: " + event.data);
		var msg = event.data;
		var index_left_distance = msg.indexOf("(");
		var index_up_distance = msg.indexOf("|");
		var index_right_distance = msg.lastIndexOf("|");
		left_distance = parseFloat(msg.substring(index_left_distance+1, index_up_distance))*100;
		up_distance = parseFloat(msg.substring(index_up_distance+1, index_right_distance))*100;
		right_distance = parseFloat(msg.substring(index_right_distance+1, msg.length-1))*100;    
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
	var scan_timer = setInterval(function() {
		ws_client_local_com.send("command|obstacle_update#");
	}, 400);
}



function add_obstacle(dir) {
    const obstacle_width=500;
    const obstacle_depth=500;
    const data = generateHeight(obstacle_width, obstacle_depth);
    
    const geometry = new THREE.PlaneGeometry(2000, 500, obstacle_width, obstacle_depth);
    const geometry_up = new THREE.PlaneGeometry(500, 4000, obstacle_width, obstacle_depth);
    geometry.rotateX(-Math.PI/2);
    geometry_up.rotateX(-Math.PI/2);

    const vertices = geometry.attributes.position.array;
    const vertices_up = geometry_up.attributes.position.array;
    for ( let i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
        vertices[ j + 1 ] = data[ i ] * 6;
        vertices_up[ j + 1 ] = data[ i ] * 6;
    }
    texture = new THREE.CanvasTexture( generateTexture( data, obstacle_width, obstacle_depth ) );
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    if(dir == "right") {
        right_obstacle = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture } ) );
        right_obstacle.position.x = -2500;
        right_obstacle.position.z = -right_distance;
        scene.add(right_obstacle);
    } else if(dir == "left") {
        left_obstacle = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture } ) );
        left_obstacle.position.x = -2500;
        left_obstacle.position.z = left_distance;
        scene.add(left_obstacle);
    } else if(dir == "up") {
        up_obstacle = new THREE.Mesh( geometry_up, new THREE.MeshBasicMaterial( { map: texture } ) );
        up_obstacle.position.x = -up_distance;
        up_obstacle.position.z = 0;
        scene.add(up_obstacle);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    controls.handleResize();
}

function generateHeight( width, height ) {
    let seed = Math.PI / 4;
    window.Math.random = function () {
        const x = Math.sin( seed ++ ) * 10000;
        return x - Math.floor( x );
    };

    const size = width * height;
    const data = new Uint8Array( size );
    const perlin = new ImprovedNoise(), z = Math.random() * 100;
    let quality = 1;
    for ( let j = 0; j < 4; j ++ ) {
        for ( let i = 0; i < size; i ++ ) {
            const x = i % width, y = ~ ~ ( i / width );
            data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );
        }
        quality *= 5;
    }
    return data;
}

function generateTexture( data, width, height ) {
    let context, image, imageData, shade;
    const vector3 = new THREE.Vector3( 0, 0, 0 );
    const sun = new THREE.Vector3( 1, 1, 1 );
    sun.normalize();
    const canvas = document.createElement( 'canvas' );
    canvas.width = width;
    canvas.height = height;
    context = canvas.getContext( '2d' );
    context.fillStyle = '#000';
    context.fillRect( 0, 0, width, height );
    image = context.getImageData( 0, 0, canvas.width, canvas.height );
    imageData = image.data;
    for ( let i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {
        vector3.x = data[ j - 2 ] - data[ j + 2 ];
        vector3.y = 2;
        vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
        vector3.normalize();
        shade = vector3.dot( sun );
        imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
        imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
        imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
    }

    context.putImageData( image, 0, 0 );
    // Scaled 4x
    const canvasScaled = document.createElement( 'canvas' );
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;
    context = canvasScaled.getContext( '2d' );
    context.scale( 4, 4 );
    context.drawImage( canvas, 0, 0 );
    image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
    imageData = image.data;
    for ( let i = 0, l = imageData.length; i < l; i += 4 ) {
        const v = ~ ~ ( Math.random() * 5 );
        imageData[ i ] += v;
        imageData[ i + 1 ] += v;
        imageData[ i + 2 ] += v;
    }

    context.putImageData( image, 0, 0 );
    return canvasScaled;
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function obstacle_set_position(){
    
    right_obstacle.position.x = -2500;
    right_obstacle.position.z = -right_distance;
    left_obstacle.position.x = -2500;
    left_obstacle.position.z = left_distance;
    up_obstacle.position.x = -up_distance;
    up_obstacle.position.z = 0;
}

function render() {
    controls.update(clock.getDelta());
    renderer.render(scene, camera);
    obstacle_set_position();
}
