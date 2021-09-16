var ws_client_local_com;
var server_ip = "192.168.43.114";
var server_port = "9000";
var start_gui = false;
var move_controller;
var connection_ok = false;
var test_conn;
var ultrasonics_loop_update;
var ir_hole_detector_loop_update;
var meteo_data_loop_update;
var robot_speed = -1;
var alert_dist = 40;
var hole_warning_modal_is_yet_open = false;

// joypad_ctrl_vars
var joypad_connected = false;
var loop_joypad;
var joypad_mode = false;

// node js gyroscope
var web_socket_arduino_data;
var gyro_pitch;

$(document).ready(function() {

    $("#gauge_temp").gaugeMeter();
    $("#gauge_humid").gaugeMeter();
    crete_gauge_mpu_data_gui();
    // $("#gauge_pitch").gaugeMeter();
    // $("#gauge_roll").gaugeMeter();

    $('#manual_mode').prop('disabled', true);
    $('#auto_mode').prop('disabled', false);
    $('#joypad_mode').prop('disabled', false);

    $('#default_ip').val(server_ip);
    $('#default_port').val(server_port);
    $('#speed_rover_perc').text(robot_speed + "%");
    
    $("#connection_form").show();
    var h = $(window).height();
    var w = $(window).width();
    var s = w;
    if(h >= w)
        s=h;

    move_controller = nipplejs.create({
        zone: document.getElementById('left'),
        mode: 'static',
        position: { left: '20%', top: '60%' },
        color: 'green',
        size: s/3
    });
    
    var sp = s/2
    var size_space_left = (sp).toString() + "px";
    $('#left').css('height', size_space_left);

    test_conn = setInterval(function() {
        if(connection_ok) {
            $("#connection_result_title").html("INFO");
            $("#connection_result_text").html("connection ok!");
            start_gui_control(s);
            $("#connection_form").hide();
            clearInterval(test_conn);

            ir_hole_detector_loop_update = setInterval(function() {
                ws_client_local_com.send("rover_hole_detectors#");
            }, 300);

            meteo_data_loop_update = setInterval(function() {
                ws_client_local_com.send("rover_meteo_data#");
            }, 5000);

            // ultrasonics_loop_update = setTimeout(function() {
            //     ws_client_local_com.send("rover_obstacle_distances#");
            //     console.log("rover_obstacle_distances");
            // }, 500);

        } else {
            $("#connection_result_title").html("ERROR");
            $("#connection_result_text").html("connection error!");  
         }
    }, 400);

    $( "#connection_button" ).click(function() {
        server_ip = $('#default_ip').val();
        server_port = $('#default_port').val();
        ws_server_connection();
        conn_result();
    });

    $( "#speed_min" ).click(function() {
        if(robot_speed >= 10) {
            robot_speed -= 10;
            $('#speed_rover_perc').text(robot_speed + "%");
            ws_client_local_com.send("rover_speed_min#");
        }
    });

    $( "#speed_plus" ).click(function() {
        if(robot_speed <= 90) {
            robot_speed += 10;
            $('#speed_rover_perc').text(robot_speed + "%");
            ws_client_local_com.send("rover_speed_plus#");
        }
    });

    $("#manual_mode").click(function() {
        ws_client_local_com.send("rover_manual_modality#");
        web_socket_arduino_data.send("rover_manual_modality#");
        $('#manual_mode').prop('disabled', true);
        $('#auto_mode').prop('disabled', false);
        $('#joypad_mode').prop('disabled', false);
        joypad_mode = false;
    });

    $("#auto_mode").click(function() {
        ws_client_local_com.send("rover_auto_modality#");
        web_socket_arduino_data.send("rover_auto_modality#");
        $('#manual_mode').prop('disabled', false);
        $('#auto_mode').prop('disabled', true);
        $('#joypad_mode').prop('disabled', false);
        joypad_mode = false;
    });

    $("#joypad_mode").click(function() {
        ws_client_local_com.send("rover_joypad_modality#");
        $('#manual_mode').prop('disabled', false);
        $('#auto_mode').prop('disabled', false);
        $('#joypad_mode').prop('disabled', true);
        joypad_ctrl();
    });

    $("#update_alert_dist").click(function() {
        alert_dist = $('#alert-distance').val();
        ws_client_local_com.send("rover_update_alert_distance#"+alert_dist);
    });

    $("#update_critical_dist").click(function() {
        var critical_dist = $('#critical-distance').val();
        ws_client_local_com.send("rover_update_critical_distance#"+critical_dist);
    });

    arm_6_axis_ctrl();
    ws_manage_gyroscope();

});

function crete_gauge_mpu_data_gui() {

    gyro_pitch = Gauge(
        document.getElementById("gyro_pitch"),
        {
          max: 90,
          min: -90,
          dialStartAngle: 180,
          dialEndAngle: 0,
          value: 0,
          label: function(value) {
            return value.toFixed(2);
          }
        }
      );

      gyro_roll = Gauge(
        document.getElementById("gyro_roll"),
        {
          max: 360,
          min: -360,
          dialStartAngle: 180,
          dialEndAngle: 0,
          value: 0,
          label: function(value) {
            return value.toFixed(2);
          }
        }
      );

      gyro_yaw = Gauge(
        document.getElementById("gyro_yaw"),
        {
          max: 180,
          min: -180,
          dialStartAngle: 180,
          dialEndAngle: 0,
          value: 0,
          label: function(value) {
            return value.toFixed(2);
          }
        }
      );

      acc_acc = Gauge(
        document.getElementById("acc_acc"),
        {
          max: 10,
          min: 0,
          dialStartAngle: 180,
          dialEndAngle: 0,
          value: 0,
          label: function(value) {
            return value.toFixed(2);
          }
        }
      );

      acc_incl = Gauge(
        document.getElementById("acc_incl"),
        {
          max: 180,
          min: -180,
          dialStartAngle: 180,
          dialEndAngle: 0,
          value: 0,
          label: function(value) {
            return value.toFixed(2);
          }
        }
      );

      acc_orient = Gauge(
        document.getElementById("acc_orient"),
        {
          max: 2,
          min: -2,
          dialStartAngle: 180,
          dialEndAngle: 0,
          value: 0,
          label: function(value) {
            return value.toFixed(2);
          }
        }
      );

      acc_x = Gauge(document.getElementById("acc_x"), {
          max: 5, min: -5,
          dialStartAngle: 180, dialEndAngle: 0, value: 0,
          label: function(value) {
            return value.toFixed(2);
          }
        }
      );

      acc_y = Gauge(document.getElementById("acc_y"), {
        max: 5, min: -5,
        dialStartAngle: 180, dialEndAngle: 0, value: 0,
        label: function(value) {
          return value.toFixed(2);
        }
      }
    );

    acc_z = Gauge(document.getElementById("acc_z"), {
        max: 5, min: -5,
        dialStartAngle: 180, dialEndAngle: 0, value: 0,
        label: function(value) {
          return value.toFixed(2);
        }
      }
    );

    gyro_x = Gauge(document.getElementById("gyro_x"), {
        max: 180, min: 90,
        dialStartAngle: 180, dialEndAngle: 0, value: 0,
        label: function(value) {
          return value.toFixed(0);
        }
      }
    );

    gyro_y = Gauge(document.getElementById("gyro_y"), {
        max: 180, min: 90,
        dialStartAngle: 180, dialEndAngle: 0, value: 0,
        label: function(value) {
          return value.toFixed(0);
        }
      }
    );

    gyro_z = Gauge(document.getElementById("gyro_z"), {
        max: 180, min: 90,
        dialStartAngle: 180, dialEndAngle: 0, value: 0,
        label: function(value) {
          return value.toFixed(0);
        }
      }
    );

}

function ws_manage_gyroscope() {
    web_socket_arduino_data = new WebSocket('ws://192.168.43.114:4500');
    web_socket_arduino_data.onopen = function(event) {
        console.log("[INFO] Connected to server!");
    };
    web_socket_arduino_data.onerror = function(event) {
        console.log("[ERROR] Not Connected to server!");
    };
    web_socket_arduino_data.onclose = function(event) {
        console.log("[INFO] Closed from server!");
    };
    web_socket_arduino_data.onmessage = function(event) {

        var msg = event.data;
        if (msg.includes("rover_go")) {
            // console.log("jon??");
            if (msg.includes("left")) {
                console.log("rover_go_left");
                ws_client_local_com.send("rover_left#");
            } else if (msg.includes("right")) {
                console.log("rover_go_right");
                ws_client_local_com.send("rover_right#");
            } else if (msg.includes("front")) {
                console.log("rover_go_front");
                ws_client_local_com.send("rover_front#");
            } else if (msg.includes("back")) {
                console.log("rover_go_back");
                ws_client_local_com.send("rover_back#");
            }
        } else {
            arduino_data = JSON.parse(msg);
        // console.log(mpu_data["gyro_y"]);

        if(arduino_data["gyro_pitch"]) {
            gyro_pitch.setValueAnimated(arduino_data["gyro_pitch"]);
            gyro_roll.setValueAnimated(arduino_data["gyro_roll"]);
            gyro_yaw.setValueAnimated(arduino_data["gyro_yaw"]);

            acc_acc.setValueAnimated(arduino_data["acc_acc"]);
            acc_incl.setValueAnimated(arduino_data["acc_incl"]);
            acc_orient.setValueAnimated(arduino_data["acc_orient"]);

            acc_x.setValueAnimated(arduino_data["acc_x"]);
            acc_y.setValueAnimated(arduino_data["acc_y"]);
            acc_z.setValueAnimated(arduino_data["acc_z"]);

            gyro_x.setValueAnimated(arduino_data["gyro_x"]);
            gyro_y.setValueAnimated(arduino_data["gyro_y"]);
            gyro_z.setValueAnimated(arduino_data["gyro_z"]);
        } else if (arduino_data["hc_sr04_left"]) {
            // console.log(arduino_data["hc_sr04_left"]);
            var l = arduino_data["hc_sr04_left"];
            var c = arduino_data["hc_sr04_center"];
            var r = arduino_data["hc_sr04_right"];
            var rc = arduino_data["hc_sr04_right_check"];

            if(l<alert_dist) {
                $("#ultra_rover_left").removeClass('bg-primary').addClass('bg-danger');
            } else {
                $("#ultra_rover_left").removeClass('bg-danger').addClass('bg-primary');
            }
            if(c<alert_dist) {
                $("#ultra_rover_center").removeClass('bg-primary').addClass('bg-danger');
            } else {
                $("#ultra_rover_center").removeClass('bg-danger').addClass('bg-primary');
            }
            if(r<alert_dist) {
                $("#ultra_rover_right").removeClass('bg-primary').addClass('bg-danger');
            } else {
                $("#ultra_rover_right").removeClass('bg-danger').addClass('bg-primary');
            }
            if(rc<alert_dist) {
                $("#ultra_rover_right_check").removeClass('bg-primary').addClass('bg-danger');
            } else {
                $("#ultra_rover_right_check").removeClass('bg-danger').addClass('bg-primary');
            }

            $('#ultra_rover_left').text(l + " cm");
            $('#ultra_rover_center').text(c + " cm");
            $('#ultra_rover_right').text(r + " cm");
            $('#ultra_rover_right_check').text(rc + " cm");
        }
    }   
    };

    ws_update_cycle_request();
}

function ws_update_cycle_request() {
    setInterval(function(){
        web_socket_arduino_data.send("command|mpu6050_data#");
    }, 300);

    setInterval(function(){
        web_socket_arduino_data.send("command|ultrasonics_data#");
    }, 150);
}

function arm_6_axis_ctrl() {

    $("#axis_1_min").mousedown(function() {
        ws_client_local_com.send("rover_arm_start?axis1,minus");
        document.getElementById("axis_1_min").classList.remove("btn-danger");
        document.getElementById("axis_1_min").classList.add("btn-success");
    });
    $("#axis_1_min").mouseup(function() {
        ws_client_local_com.send("rover_arm_stop?axis1,minus");
        document.getElementById("axis_1_min").classList.remove("btn-success");
        document.getElementById("axis_1_min").classList.add("btn-danger");
    });
    
    $("#axis_1_plus").mousedown(function() {
        ws_client_local_com.send("rover_arm_start?axis1,plus");
        document.getElementById("axis_1_plus").classList.remove("btn-danger");
        document.getElementById("axis_1_plus").classList.add("btn-success");
    });
    $("#axis_1_plus").mouseup(function() {
        ws_client_local_com.send("rover_arm_stop?axis1,plus");
        document.getElementById("axis_1_plus").classList.remove("btn-success");
        document.getElementById("axis_1_plus").classList.add("btn-danger");
    });

    $("#axis_2_min").mousedown(function() {
        ws_client_local_com.send("rover_arm_start?axis2,minus");
        document.getElementById("axis_2_min").classList.remove("btn-danger");
        document.getElementById("axis_2_min").classList.add("btn-success");
    });
    $("#axis_2_min").mouseup(function() {
        ws_client_local_com.send("rover_arm_stop?axis2,minus");
        document.getElementById("axis_2_min").classList.remove("btn-success");
        document.getElementById("axis_2_min").classList.add("btn-danger");
    });
    $("#axis_2_plus").mousedown(function() {
        ws_client_local_com.send("rover_arm_start?axis2,plus");
        document.getElementById("axis_2_plus").classList.remove("btn-danger");
        document.getElementById("axis_2_plus").classList.add("btn-success");
    });
    $("#axis_2_plus").mouseup(function() {
        ws_client_local_com.send("rover_arm_stop?axis2,plus");
        document.getElementById("axis_2_plus").classList.remove("btn-success");
        document.getElementById("axis_2_plus").classList.add("btn-danger");
    });

    $("#axis_3_min").mousedown(function() {
        ws_client_local_com.send("rover_arm_start?axis3,minus");
        document.getElementById("axis_3_min").classList.remove("btn-danger");
        document.getElementById("axis_3_min").classList.add("btn-success");
    });
    $("#axis_3_min").mouseup(function() {
        ws_client_local_com.send("rover_arm_stop?axis3,minus");
        document.getElementById("axis_3_min").classList.remove("btn-success");
        document.getElementById("axis_3_min").classList.add("btn-danger");
    });
    $("#axis_3_plus").mousedown(function() {
        ws_client_local_com.send("rover_arm_start?axis3,plus");
        document.getElementById("axis_3_plus").classList.remove("btn-danger");
        document.getElementById("axis_3_plus").classList.add("btn-success");
    });
    $("#axis_3_plus").mouseup(function() {
        ws_client_local_com.send("rover_arm_stop?axis3,plus");
        document.getElementById("axis_3_plus").classList.remove("btn-success");
        document.getElementById("axis_3_plus").classList.add("btn-danger");
    });

    $("#axis_4_min").mousedown(function() {
        ws_client_local_com.send("rover_arm_start?axis4,minus");
        document.getElementById("axis_4_min").classList.remove("btn-danger");
        document.getElementById("axis_4_min").classList.add("btn-success");
    });
    $("#axis_4_min").mouseup(function() {
        ws_client_local_com.send("rover_arm_stop?axis4,minus");
        document.getElementById("axis_4_min").classList.remove("btn-success");
        document.getElementById("axis_4_min").classList.add("btn-danger");
    });
    $("#axis_4_plus").mousedown(function() {
        ws_client_local_com.send("rover_arm_start?axis4,plus");
        document.getElementById("axis_4_plus").classList.remove("btn-danger");
        document.getElementById("axis_4_plus").classList.add("btn-success");
    });
    $("#axis_4_plus").mouseup(function() {
        ws_client_local_com.send("rover_arm_stop?axis4,plus");
        document.getElementById("axis_4_plus").classList.remove("btn-success");
        document.getElementById("axis_4_plus").classList.add("btn-danger");
    });

    $("#axis_5_min").mousedown(function() {
        ws_client_local_com.send("rover_arm_start?axis5,minus");
        document.getElementById("axis_5_min").classList.remove("btn-danger");
        document.getElementById("axis_5_min").classList.add("btn-success");
    });
    $("#axis_5_min").mouseup(function() {
        ws_client_local_com.send("rover_arm_stop?axis5,minus");
        document.getElementById("axis_5_min").classList.remove("btn-success");
        document.getElementById("axis_5_min").classList.add("btn-danger");
    });
    $("#axis_5_plus").mousedown(function() {
        ws_client_local_com.send("rover_arm_start?axis5,plus");
        document.getElementById("axis_5_plus").classList.remove("btn-danger");
        document.getElementById("axis_5_plus").classList.add("btn-success");
    });
    $("#axis_5_plus").mouseup(function() {
        ws_client_local_com.send("rover_arm_stop?axis5,plus");
        document.getElementById("axis_5_plus").classList.remove("btn-success");
        document.getElementById("axis_5_plus").classList.add("btn-danger");
    });

    $("#axis_6_min").mousedown(function() {
        ws_client_local_com.send("rover_arm_start?axis6,minus");
        document.getElementById("axis_6_min").classList.remove("btn-danger");
        document.getElementById("axis_6_min").classList.add("btn-success");
    });
    $("#axis_6_min").mouseup(function() {
        ws_client_local_com.send("rover_arm_stop?axis6,minus");
        document.getElementById("axis_6_min").classList.remove("btn-success");
        document.getElementById("axis_6_min").classList.add("btn-danger");
    });
    $("#axis_6_plus").mousedown(function() {
        ws_client_local_com.send("rover_arm_start?axis6,plus");
        document.getElementById("axis_6_plus").classList.remove("btn-danger");
        document.getElementById("axis_6_plus").classList.add("btn-success");
    });
    $("#axis_6_plus").mouseup(function() {
        ws_client_local_com.send("rover_arm_stop?axis6,plus");
        document.getElementById("axis_6_plus").classList.remove("btn-success");
        document.getElementById("axis_6_plus").classList.add("btn-danger");
    });
}

function ws_server_connection() {

    console.log(server_ip);
	
	ws_client_local_com = new WebSocket( "ws://"+server_ip+":"+server_port);
	
	ws_client_local_com.onopen = function() {
        console.log("[INFO] Connected to server!");
        connection_ok = true;
	}

	ws_client_local_com.onmessage = function (msg) {
        // console.log("message from server: " + msg.data);
        var msg = JSON.parse(msg.data);

        if("check-right" in msg) {
            // var l = parseFloat(msg["left"]);
            // var c = parseFloat(msg["center"]);
            // var r = parseFloat(msg["right"]);
            // var rc = parseFloat(msg["check-right"]);

            // if(l<alert_dist) {
            //     $("#ultra_rover_left").removeClass('bg-primary').addClass('bg-danger');
            // } else {
            //     $("#ultra_rover_left").removeClass('bg-danger').addClass('bg-primary');
            // }
            // if(c<alert_dist) {
            //     $("#ultra_rover_center").removeClass('bg-primary').addClass('bg-danger');
            // } else {
            //     $("#ultra_rover_center").removeClass('bg-danger').addClass('bg-primary');
            // }
            // if(r<alert_dist) {
            //     $("#ultra_rover_right").removeClass('bg-primary').addClass('bg-danger');
            // } else {
            //     $("#ultra_rover_right").removeClass('bg-danger').addClass('bg-primary');
            // }
            // if(rc<alert_dist) {
            //     $("#ultra_rover_right_check").removeClass('bg-primary').addClass('bg-danger');
            // } else {
            //     $("#ultra_rover_right_check").removeClass('bg-danger').addClass('bg-primary');
            // }

            // // $('#ultra_rover_left').text(msg["left"].toFixed(0) + " cm");
            // $('#ultra_rover_center').text(msg["center"].toFixed(0) + " cm");
            // $('#ultra_rover_right').text(msg["right"].toFixed(0) + " cm");
            // $('#ultra_rover_right_check').text(msg["check-right"].toFixed(0) + " cm");
        }
        else if("ir_left" in msg) {
            var right = msg["ir_right"];
            var left = msg["ir_left"];

            if(left) {
                $("#ir_rover_left").removeClass('bg-info').addClass('bg-danger');
                $('#ir_rover_left').text("HOLE!");
            } else if (!left) {
                $("#ir_rover_left").removeClass('bg-danger').addClass('bg-info');
                $('#ir_rover_left').text("OK");
            }
            if(right) {
                $("#ir_rover_right").removeClass('bg-info').addClass('bg-danger');
                $('#ir_rover_right').text("HOLE!");
            } else if (!right) {
                $("#ir_rover_right").removeClass('bg-danger').addClass('bg-info');
                $('#ir_rover_right').text("OK");
            }

            if((left || right) && (!hole_warning_modal_is_yet_open)) {
                hole_warning_modal_is_yet_open = true;
                hole_warning_modal();
            } else if (!left && !right) {
                hole_warning_modal_is_yet_open = false;
            }
        }
        else if("temperature" in msg) {
            $("#gauge_temp").gaugeMeter({
                percent: msg["temperature"]
            });
            $("#gauge_humid").gaugeMeter({
                percent: msg["humidity"]
            });
        }
        else if("rover_speed" in msg) {
            console.log(msg);
            robot_speed = Math.round(msg["rover_speed"]*100);
            $('#speed_rover_perc').text(robot_speed + "%");
        }
    }

	ws_client_local_com.onclose = function() {
		console.log("[WARNING] Close connection!");
	}

    ws_client_local_com.onerror = function() {
        console.log("[ERROR] Connection Error!");
    }
}

function hole_warning_modal() {
    $("#hole_detector_warning").show();
    setTimeout(function(){ 
        $("#hole_detector_warning").hide();
    }, 4000);
}

function conn_result() {
    $("#connection_result").show();
    setTimeout(function(){ 
        $("#connection_result").hide();
    }, 2000);
}

function start_gui_control(s) {

    move_controller.on('end', function (evt, data) {
        // console.log(data.position);
        ws_client_local_com.send("rover_stop#");
    }).on('move', function (evt, data) {
        // console.log("move");
    }).on('dir:up plain:up dir:left plain:left dir:down plain:down dir:right plain:right',
    function (evt, data) {
        console.log(data.direction.angle);
        // if(data.distance > s/20) {
            if(data.direction.angle == "right") {
                console.log("go_right");
                ws_client_local_com.send("rover_right#");
            } else if(data.direction.angle == "left") {
                console.log("go_left");
                ws_client_local_com.send("rover_left#");
            } else if(data.direction.angle == "down") {
                console.log("go_down");
                ws_client_local_com.send("rover_back#");
            } else if(data.direction.angle == "up") {
                console.log("go_up");
                ws_client_local_com.send("rover_front#");
            }
        // }
    });
}

function joypad_ctrl() {

    joypad_mode = true;

    var loop_check_joypad;

    if (canGame()) {
		$(window).on("gamepadconnected", function() {
			joypad_connected = true;
			console.log("[INFO] joypad connected!");
			loop_joypad = window.setInterval(reportOnGamepad, 100);
		});

		$(window).on("gamepaddisconnected", function() {
            console.log("[INFO] joypad disconnected!");
            joypad_connected = false;
            window.clearInterval(loop_joypad);
            window.clearInterval(loop_check_joypad);
        });
        
        if(!joypad_connected) {
            loop_check_joypad = window.setInterval(function() {
                var msg_alert = "[INFO] Connect a joypad to USB port and press a button!";
                console.log(msg_alert);
                if(navigator.getGamepads()[0]) {
                    $(window).trigger("gamepadconnected");
                    window.clearInterval(loop_check_joypad);
                }
            }, 1000);
        }        
	}
}

function canGame() {
	return "getGamepads" in navigator;
}

function reportOnGamepad() {
    if (joypad_mode) {
        var gp = navigator.getGamepads()[0];
        if (gp.buttons[1].pressed) {
            ws_client_local_com.send("rover_stop#");
            console.log("stop");
        } else if (gp.buttons[2].pressed) {
            console.log("[INFO] press button 2");
        } else if (gp.buttons[3].pressed) {
            console.log("[INFO] press button 3");
        } else if (gp.buttons[4].pressed) {
            console.log("[INFO] press button 4");
        }

        for(var i=0;i<gp.axes.length; i+=2) {
            if (gp.axes[i+1] === -1) {
                ws_client_local_com.send("rover_front#");
                console.log("go_front");
            } else if (gp.axes[i+1] === 1) {
                ws_client_local_com.send("rover_back#");
                console.log("go_back");
            } else if (gp.axes[i] === 1) {
                ws_client_local_com.send("rover_right#");
                console.log("go_right");
            } else if (gp.axes[i] === -1) {
                ws_client_local_com.send("rover_left#");
                console.log("go_left");
            }
        }
    }
}
