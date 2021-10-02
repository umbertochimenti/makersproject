var canvas = null;
var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = null;
var createScene = null;
var camera = null;
var stones = [];
var scene_dimension = [1500, 1500];
var polygon;
var largeGroundMat;
var change_view = false;

window.onload = function(e) {
    canvas = document.getElementById("renderCanvas");
    createDefaultEngine = function() { 
        return new BABYLON.Engine(canvas, true, { 
            preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); 
        };
    
    createScene =  () => {
        const scene = new BABYLON.Scene(engine);
        //Create large ground for valley environment
        largeGroundMat = new BABYLON.StandardMaterial("largeGroundMat");
        largeGroundMat.diffuseTexture = new BABYLON.Texture("./textures/mars_surf.png");
        const largeGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap("largeGround", 
            "https://assets.babylonjs.com/environments/villageheightmap.png", {
                width: scene_dimension[0], height: scene_dimension[1], subdivisions: 20, minHeight:-0.1, maxHeight: 0.2});
        largeGround.material = largeGroundMat;

        camera = new BABYLON.ArcRotateCamera("camera", -Math.PI/2, Math.PI/2.3, 10, new BABYLON.Vector3(0, 0, 0));
        camera.attachControl(canvas, true);
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(2, 1, 0));

        const places = []; //each entry is an array [rotation, x, z]
        for (var i = 0; i < 30; i++) {
            var plusOrMinus1 = Math.random() < 0.5 ? -1 : 1;
            var plusOrMinus2 = Math.random() < 0.5 ? -1 : 1;
            places.push([Math.random(), ((plusOrMinus1)*Math.random()*scene_dimension[0]/2), (plusOrMinus2)*Math.random()*scene_dimension[1]/2]);
        }

        for (var j = 0; j < places.length; j++) {
            var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {
                segments: 20,
                diameterX: 2,
                diameterY: 2,
                diameterZ: 2,
                updatable:true 
            }, scene);

            sphere.forceSharedVertices();

            var positions = sphere.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            
            var numberOfVertices = positions.length/3;
            for(var i = 0; i<numberOfVertices; i++) {
                positions[i*3] += Math.random() * 0.01;
                positions[i*3] += Math.random() * 0.01;
                positions[i*3] += Math.random() * 0.01;
            }
            
            sphere.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
            console.log(Math.floor(Math.random()*7)+1);
            const displacementmapURL = "textures/stone"+(Math.floor(Math.random()*7)+1).toString()+".jpg";
            sphere.applyDisplacementMap(displacementmapURL, .1, 1.1);

            const roofMat = new BABYLON.StandardMaterial("roofMat");
            roofMat.diffuseTexture = new BABYLON.Texture("textures/stone"+(Math.floor(Math.random()*7)+1).toString()+".jpg");
            sphere.material = roofMat;
            stones.push(sphere);
        }

        var count = 0;
        stones.forEach(function (stone) {
            //stone.rotation.y = places[count][0];
            stone.position.x = places[count][1];
            stone.position.z = places[count][2];
            count++;
        });

        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

        BABYLON.SceneLoader.ImportMesh("", "rover_model/", "rover.glb", scene, function (newMeshes, particleSystems, skeletons) {
            
        });

        scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    if(kbInfo.event.key == "q") {
                        if(change_view) {
                            console.log("view 1!");
                            change_view = false;
                            scene.activeCamera.position = new BABYLON.Vector3(-Math.PI/2, Math.PI/2.3, 10);
                            scene.activeCamera.alpha += Math.PI;
                        } else {
                            console.log("view 2!");
                            change_view = true;
                            scene.activeCamera.position = new BABYLON.Vector3(-Math.PI/2, Math.PI/2.8, 90);
                            scene.activeCamera.alpha = -Math.PI/2;
                            scene.activeCamera.beta = Math.PI/4;
                        }
                    }
                break;
            }
        });
        return scene;
    }
    
    window.initFunction = async function() {               
        
        var asyncEngineCreation = async function() {
            try {
                return createDefaultEngine();
            } catch(e) {
                console.log("the available createEngine function failed. Creating the default engine instead");
                return createDefaultEngine();
            }
        }

        window.engine = await asyncEngineCreation();
        if (!engine) 
            throw 'engine should not be null.';
        window.scene = createScene();
    };

    initFunction().then(() => {
        sceneToRender = scene;        
        engine.runRenderLoop(function () {
            if (sceneToRender && sceneToRender.activeCamera) {
                sceneToRender.render();
            }
        });
    });

    window.addEventListener("resize", function () {
        engine.resize();
    });
}

function ws_client_to_local_server() {
	
    ws_client_local_com = new WebSocket( "ws://localhost:9000");

    ws_client_local_com.onopen = function() {
        console.log("[INFO] Connected to server!");
    }

    ws_client_local_com.onmessage = function (event) {
        //console.log("[INFO] Receive msg from server: " + event.data);
        var json_radar_values = JSON.parse(event.data);
        var distances_value_from_radar = [];
        for (var key in json_radar_values) {
            if (json_radar_values.hasOwnProperty(key)) {
                distances_value_from_radar.push(json_radar_values[key]);
            }
        }

        var angle = 0;
        var s2 = [];
        for (var w = 0; w < distances_value_from_radar.length; w++) {
            var x = distances_value_from_radar[w]*sinDegrees(angle);
            var z = distances_value_from_radar[w]*cosDegrees(angle);
            angle +=15;
            s2.push(new BABYLON.Vector3(-x, 0, z));
        }

        s2.push(new BABYLON.Vector3(0, 0, -500));
        s2.push(new BABYLON.Vector3(-500, 0, -500));
        s2.push(new BABYLON.Vector3(-500, 0, 500));
        s2.push(new BABYLON.Vector3(0, 0, 500));

        if(polygon)
            polygon.dispose();
        
        polygon = BABYLON.MeshBuilder.ExtrudePolygon("polygon", {
            shape: s2, 
            // holes: holes_full, 
            depth: 5, 
            sideOrientation: BABYLON.Mesh.DOUBLESIDE 
        }, scene);
        polygon.position.y = 5;
        polygon.position.z = -1;
        polygon.rotation.y = Math.PI/2;
        polygon.material = largeGroundMat;
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
	}, 2000);
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


function sinDegrees(angleDegrees) {
    return Math.sin(angleDegrees*Math.PI/180);
};

function cosDegrees(angleDegrees) {
    return Math.cos(angleDegrees*Math.PI/180);
};

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi/180);
}
