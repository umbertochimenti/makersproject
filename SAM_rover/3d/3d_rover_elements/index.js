var canvas = null;
var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = null;
var createScene = null;
var camera = null;
var scene_dimension = [2000, 2000];
var polygon;
var largeGroundMat;
var change_view = false;
var elements_mesh = [];
var name_mesh = [];
var buttons_shift = 0;
var pressed = false;
var released = false;
var activateBtn;
var guiContainer;
var leftBtn;
var rightBtn;

BABYLON.ArcRotateCamera.prototype.spinTo = function (whichprop, targetval, speed) {
    var ease = new BABYLON.CubicEase();
    ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
	BABYLON.Animation.CreateAndStartAnimation('at4', this, whichprop, speed, 120, this[whichprop], targetval, 0, ease);
}

window.onload = function(e) {
    canvas = document.getElementById("renderCanvas");
    createDefaultEngine = function() { 
        return new BABYLON.Engine(canvas, true, { 
            preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); 
        };
    
    createScene =  () => {
        const scene = new BABYLON.Scene(engine);
        largeGroundMat = new BABYLON.StandardMaterial("largeGroundMat");
        largeGroundMat.diffuseTexture = new BABYLON.Texture("./textures/mars_surf.png");
        const largeGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap("largeGround", 
            "https://assets.babylonjs.com/environments/villageheightmap.png", {
                width: scene_dimension[0], height: scene_dimension[1], subdivisions: 20, minHeight:-0.1, maxHeight: 0.2});
        largeGround.material = largeGroundMat;

        camera = new BABYLON.ArcRotateCamera("camera", Math.PI/2, Math.PI/2.6, 200, new BABYLON.Vector3(0, 0, 0));
        camera.attachControl(canvas, true);
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(2, 1, 0));

        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

        // Buttons
        activateBtn = BABYLON.GUI.Button.CreateSimpleButton("but1", "?");
        activateBtn.width = "150px";
        activateBtn.height = "50px";
        activateBtn.depth="1150px";
        activateBtn.color = "white";
        activateBtn.cornerRadius = 20;
        activateBtn.background = "gray";
        activateBtn.onPointerClickObservable.add(() => {
            $("#element_desc").show();
            setTimeout(function(){ 
                $("#element_desc").hide();
            }, 4000);
        });

        leftBtn = BABYLON.GUI.Button.CreateImageOnlyButton("left", "https://models.babylonjs.com/Demos/weaponsDemo/textures/leftButton.png");
        leftBtn.width = "55px";
        leftBtn.height = "55px";
        leftBtn.thickness = 0;
        leftBtn.setVisible = false;
        leftBtn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        leftBtn.onPointerClickObservable.add(() => { 
            updatePosition("left");
        });
        
        rightBtn = BABYLON.GUI.Button.CreateImageOnlyButton("right", "https://models.babylonjs.com/Demos/weaponsDemo/textures/rightButton.png");
        rightBtn.width = "55px";
        rightBtn.height = "55px";
        rightBtn.thickness = 0;
        rightBtn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        rightBtn.onPointerClickObservable.add(() => {
            updatePosition("right");
        });

        BABYLON.SceneLoader.ImportMesh("", "3d_model/", "hc_sr04.glb", scene, function (mesh) {
            mesh[0].position = new BABYLON.Vector3(-60, 0, -80);
            // mesh[0].scaling=new BABYLON.Vector3(1.2,1.2,1.2);
            // mesh[0].addRotation(Math.PI/6, 0, 0);
            elements_mesh.push(mesh[0]);
            mesh[0].setEnabled(false);
            name_mesh.push("ultra");
        });

        BABYLON.SceneLoader.ImportMesh("", "3d_model/", "ir_sensor.glb", scene, function (mesh) {
            mesh[0].position = new BABYLON.Vector3(0, 0, 0);
            mesh[0].scaling=new BABYLON.Vector3(1.6,1.6,1.6);
            mesh[0].addRotation(Math.PI/5, 0, 0);
            elements_mesh.push(mesh[0]);
            mesh[0].setEnabled(false);
            name_mesh.push("ir");
        });

        BABYLON.SceneLoader.ImportMesh("", "3d_model/", "arm.glb", scene, function (mesh) {
            mesh[0].position = new BABYLON.Vector3(0, 0, 0);
            mesh[0].scaling=new BABYLON.Vector3(0.37,0.37,0.37);
            elements_mesh.push(mesh[0]);
            mesh[0].setEnabled(false);
            name_mesh.push("arm");
        });

        BABYLON.SceneLoader.ImportMesh("", "3d_model/", "arduino.glb", scene, function (mesh) {
            mesh[0].position = new BABYLON.Vector3(0, 15, 0);
            mesh[0].addRotation(Math.PI/5, 0, 0);
            elements_mesh.push(mesh[0]);
            mesh[0].setEnabled(false);
            name_mesh.push("arduino");
        });

        BABYLON.SceneLoader.ImportMesh("", "3d_model/", "pi4.glb", scene, function (mesh) {
            mesh[0].position = new BABYLON.Vector3(0, 10, 0);
            mesh[0].scaling=new BABYLON.Vector3(0.9,0.9,0.9);
            mesh[0].addRotation(Math.PI/5, 0, 0);
            elements_mesh.push(mesh[0]);
            mesh[0].setEnabled(false);
            name_mesh.push("pi4");
        });

        BABYLON.SceneLoader.ImportMesh("", "3d_model/", "servo.glb", scene, function (mesh) {
            mesh[0].position = new BABYLON.Vector3(0, 0, 0);
            mesh[0].scaling=new BABYLON.Vector3(1,1,1);
            elements_mesh.push(mesh[0]);
            mesh[0].setEnabled(false);
            name_mesh.push("servo");
        });

        BABYLON.SceneLoader.ImportMesh("", "3d_model/", "pi_camera.glb", scene, function (mesh) {
            mesh[0].position = new BABYLON.Vector3(0, 5, 30);
            mesh[0].scaling=new BABYLON.Vector3(2.4,2.4,2.4);
            mesh[0].addRotation(-Math.PI/5, 0, 0);
            elements_mesh.push(mesh[0]);
            mesh[0].setEnabled(false);
            name_mesh.push("picamera");
        });

        BABYLON.SceneLoader.ImportMesh("", "3d_model/", "drone.glb", scene, function (mesh) {
            mesh[0].position = new BABYLON.Vector3(0, 0, 0);
            mesh[0].scaling=new BABYLON.Vector3(0.6,0.6,0.6);
            elements_mesh.push(mesh[0]);
            mesh[0].setEnabled(false);
            name_mesh.push("drone");
        });

        BABYLON.SceneLoader.ImportMesh("", "3d_model/", "dc_motor.glb", scene, function (mesh) {
            mesh[0].position = new BABYLON.Vector3(-90, -5, 70);
            mesh[0].scaling=new BABYLON.Vector3(2.5,2.5,2.5);
            mesh[0].addRotation(0, 0, Math.PI/5);
            elements_mesh.push(mesh[0]);
            mesh[0].setEnabled(false);
            name_mesh.push("motor");
        });

        BABYLON.SceneLoader.ImportMesh("", "3d_model/", "buzzer.glb", scene, function (mesh) {
            mesh[0].position = new BABYLON.Vector3(50, -10, 0);
            mesh[0].scaling=new BABYLON.Vector3(2.5,2.5,2.5);
            elements_mesh.push(mesh[0]);
            mesh[0].setEnabled(false);
            name_mesh.push("buzzer");
        });


        BABYLON.SceneLoader.ImportMesh("", "3d_model/", "wheel.glb", scene, function (mesh) {
            mesh[0].position = new BABYLON.Vector3(0, 0, 0);
            mesh[0].scaling=new BABYLON.Vector3(.5,.5,.5);
            elements_mesh.push(mesh[0]);
            mesh[0].setEnabled(false);
            name_mesh.push("wheel");
        });

        scene.registerBeforeRender(function () {
            scene.activeCamera.alpha += 0.005;
        });

        // Gui
        var guiLayer = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("guiLayer");
        guiContainer = new BABYLON.GUI.Grid();
        guiContainer.name = "uiGrid";
        guiContainer.addRowDefinition(1, false);
        guiContainer.addColumnDefinition(1/3, false);
        guiContainer.addColumnDefinition(1/3, false);
        guiContainer.addColumnDefinition(1/3, false);
        guiContainer.paddingTop = "450px";
        guiContainer.paddingLeft = "50px";
        guiContainer.paddingRight = "50px";
        guiContainer.paddingBottom = "50px";        
        guiLayer.addControl(guiContainer);
        
        // add button to Gui
        guiContainer.addControl(activateBtn, 0, 1);   
        guiContainer.addControl(rightBtn, 0, 2);
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

$(document).ready(function() {
    setTimeout(function() { 
        elements_mesh[0].setEnabled(true);
        set_elements_text(0);
    }, 500);
});

function updatePosition(button) {
    if (button == "left") {
        if (buttons_shift > 0) {
            elements_mesh[buttons_shift].setEnabled(false);
            elements_mesh[buttons_shift-1].setEnabled(true);
            buttons_shift--;
        }
    } else if (button == "right") {
        if (buttons_shift < elements_mesh.length-1) {
            elements_mesh[buttons_shift].setEnabled(false);
            elements_mesh[buttons_shift+1].setEnabled(true);
            buttons_shift++;
        }
    }

    set_elements_text(buttons_shift);
    
    if (buttons_shift == 0) {
        guiContainer.removeControl(leftBtn);   
    } else if (buttons_shift == 1) {
        guiContainer.addControl(leftBtn, 0, 0);   
    } else if (buttons_shift == elements_mesh.length-1) {
        guiContainer.removeControl(rightBtn);  
    } else if (buttons_shift == elements_mesh.length-2) {
        guiContainer.addControl(rightBtn, 0, 2);
    }

}

function set_elements_text (index) {
    if (name_mesh[index] == "ir") {
        activateBtn.textBlock.text = "IR SENSOR";
        $("#element_desc_title").html("IR Sensor");
        $("#element_desc_text").html("sensor that detects potholes so that the rover can avoid disastrous falls!");
    } else if (name_mesh[index] == "ultra") {
        activateBtn.textBlock.text = "HC-RS04";
        $("#element_desc_title").html("Ultrasonic Sensor");
        $("#element_desc_text").html("Used to detect the distances between the robot and the obstacles present on the planetary surface");    
    } else if (name_mesh[index] == "arm") {
        activateBtn.textBlock.text = "ARM";
        $("#element_desc_title").html("6-AXIS ARM");
        $("#element_desc_text").html("6-axis arm formed by servo motors that allows you to grab rocky elements present on the planetary surface");    
    } else if (name_mesh[index] == "pi4") {
        activateBtn.textBlock.text = "RASPBERRY PI";
        $("#element_desc_title").html("PI 4");
        $("#element_desc_text").html("The most famous mini computer in the world, used in our project for image processing and wifi communication operations");    
    } else if (name_mesh[index] == "arduino") {
        activateBtn.textBlock.text = "ARDUINO";
        $("#element_desc_title").html("ARDUINO UNO");
        $("#element_desc_text").html("The most famous controller in the world, used in our project for rover handling and sensor control operations");    
    } else if (name_mesh[index] == "picamera") {
        activateBtn.textBlock.text = "PI CAMERA";
        $("#element_desc_title").html("PI CAMERA");
        $("#element_desc_text").html("Raspberry pi camera module");
    } else if (name_mesh[index] == "servo") {
        activateBtn.textBlock.text = "SERVO";
        $("#element_desc_title").html("SERVO MOTOR");
        $("#element_desc_text").html("motor used to carry out angular movements. used in our project for the movement of the ultrasonic sensor and for the opening of the metal case");
    } else if (name_mesh[index] == "drone") {
        activateBtn.textBlock.text = "DRONE";
        $("#element_desc_title").html("DRONE");
        $("#element_desc_text").html("quadcopter used for aerial patrols. it is capable of autonomous operations based on the demands of the main rover");
    } else if (name_mesh[index] == "motor") {
        activateBtn.textBlock.text = "DC MOTOR";
        $("#element_desc_title").html("DC MOTOR");
        $("#element_desc_text").html("engines used to move the rover");
    } else if (name_mesh[index] == "buzzer") {
        activateBtn.textBlock.text = "BUZZER";
        $("#element_desc_title").html("BUZZER");
        $("#element_desc_text").html("piezoresistive element, used to emulate alarm sounds");
    } else if (name_mesh[index] == "wheel") {
        activateBtn.textBlock.text = "WHEEL";
        $("#element_desc_title").html("WHEEL");
        $("#element_desc_text").html("wheels mounted on the engines of the rover");
    }
}
