const { Board, IMU, Proximity } = require("johnny-five");
const board = new Board({
    port: "/dev/ttyACM1"
});

var WebSocketServer = require('websocket').server;
var http = require('http');
var server = http.createServer(function(request, response) { });
var connection = null;
var mpu6050_data = {};
var ultrasonics_data = {};
var auto_modality = false;
var alert_distance = 40;
var critical_distance = 7;
server.listen(4500, function() {
  console.log('[INFO] server ws listen on 4500!');
});

wsServer = new WebSocketServer({
 httpServer: server
});

board.on("ready", function() {

    const imu = new IMU({
        controller: "MPU6050"
      });

      const left = new Proximity({
        controller: "HCSR04",
        pin: 7
      });

      left.on("change", () => {
        const {centimeters} = left;
        //console.log("  cm  : ", centimeters);
        //console.log("-----------------");
        ultrasonics_data.hc_sr04_left = centimeters;
      });

      const center = new Proximity({
        controller: "HCSR04",
        pin: 6
      });

      center.on("change", () => {
        const {centimeters} = center;
        //console.log("  cm  : ", centimeters);
        //console.log("-----------------");
        ultrasonics_data.hc_sr04_center = centimeters;
      });

      const right = new Proximity({
        controller: "HCSR04",
        pin: 5
      });

      right.on("change", () => {
        const {centimeters} = right;
        //console.log("  cm  : ", centimeters);
        //console.log("-----------------");
        ultrasonics_data.hc_sr04_right = centimeters;
      });

      const right_check = new Proximity({
        controller: "HCSR04",
        pin: 4
      });

      right_check.on("change", () => {
        const {centimeters} = right_check;
        //console.log("  cm  : ", centimeters);
        //console.log("-----------------");
        ultrasonics_data.hc_sr04_right_check = centimeters;
      });

      imu.on("change", () => {
        mpu6050_data.acc_x = imu.accelerometer.x;
        mpu6050_data.acc_y = imu.accelerometer.y;
        mpu6050_data.acc_z = imu.accelerometer.z;
        mpu6050_data.acc_pitch = imu.accelerometer.pitch;
        mpu6050_data.acc_roll = imu.accelerometer.roll;
        mpu6050_data.acc_acc = imu.accelerometer.acceleration;
        mpu6050_data.acc_incl = imu.accelerometer.inclination;
        mpu6050_data.acc_orient = imu.accelerometer.orientation;

        mpu6050_data.gyro_pitch = imu.gyro.pitch.angle;
        mpu6050_data.gyro_roll = imu.gyro.roll.angle;
        mpu6050_data.gyro_yaw = imu.gyro.yaw.angle;
        mpu6050_data.gyro_x = imu.gyro.x;
        mpu6050_data.gyro_y = imu.gyro.y;
        mpu6050_data.gyro_z = imu.gyro.z;
      });

      wsServer.on('request', function(request) {
        connection = request.accept(null, request.origin);
        connection.on('message', function(message) {
            //console.log(message);
            if (message.type === 'utf8') {
                var clientMsg = message.utf8Data;
                if (clientMsg == "command|mpu6050_data#") {
                    // console.log('[INFO] client msg: ' + clientMsg);
                    connection.sendUTF(JSON.stringify(mpu6050_data));
                } else if (clientMsg == "command|ultrasonics_data#") {
                  // console.log('[INFO] client msg: ' + clientMsg);
                  connection.sendUTF(JSON.stringify(ultrasonics_data));
              } else if (clientMsg == "rover_auto_modality#") {
                console.log('[INFO] client msg: ' + clientMsg);
                auto_modality = true;
              } else if (clientMsg == "rover_manual_modality#") {
                console.log('[INFO] client msg: ' + clientMsg);
                auto_modality = false;
              }
            }
        });
        connection.on('close', function(connection) {
            console.log('[INFO] client close!');
        });
    });

    manage_auto_move();

});


async function manage_auto_move() {
  setInterval(function() {
    if(auto_modality) {
      console.log("auto cycle");
      if (ultrasonics_data.hc_sr04_left < alert_distance || ultrasonics_data.hc_sr04_center < alert_distance || ultrasonics_data.hc_sr04_right < alert_distance) {
        if (ultrasonics_data.hc_sr04_right_check < alert_distance) {
          connection.sendUTF("rover_go_left#");
          sleep(1500).then(() => {
            // Do something after the sleep!
        });
          // await sleep(200);
        } else {
          connection.sendUTF("rover_go_right#");
        }
        if (ultrasonics_data.hc_sr04_left < critical_distance || ultrasonics_data.hc_sr04_center < critical_distance || ultrasonics_data.hc_sr04_right < critical_distance) {
          connection.sendUTF("rover_go_back#");
          // await sleep(100);
          sleep(500).then(() => {
            // Do something after the sleep!
        });
        }
      } else {
        connection.sendUTF("rover_go_front#");
      }
    }
  }, 100);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

