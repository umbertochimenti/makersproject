import sys
import time
import signal
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
from threading import Thread
import quadruped_8_servo_pyfirmata
import ultrasonic_ctrl

WS_SERVER_PORT = 9000
ultrasonic_distance = -1
autonoumous_obstable_avoid = True
quadruped_dir = "stop"

class Thread_Walking(Thread):
    def __init__(self):
        Thread.__init__(self)
        
    def run(self):
        walking(dir)

class Thread_Ultrasonic_distance(Thread):
    def __init__(self):
        Thread.__init__(self)

    def run(self):
        global ultrasonic_distance, autonoumous_obstable_avoid, quadruped_dir
        while True:
            ultrasonic_distance = ultrasonic_ctrl.distance()
            print ("distance: " + str(ultrasonic_distance))
            if autonoumous_obstable_avoid:
                if ultrasonic_distance > 10:
                    quadruped_dir = "front"
                else:
                    quadruped_dir = "right"
            time.sleep(1)

class wsServer(WebSocket):
    
    def handleMessage(self):
        global quadruped_dir
        msg = self.data
        print(msg)
        if (msg).find("quadruped_on#") != -1:
            quadruped_dir = "front"
        elif (msg).find("quadruped_stop#") != -1:
            quadruped_dir = "stop"
        elif (msg).find("quadruped_back#") != -1:
            quadruped_dir = "back"
        elif (msg).find("quadruped_right#") != -1:
            quadruped_dir = "right"
        elif (msg).find("quadruped_left#") != -1:
            quadruped_dir = "left"

    def handleConnected(self):
        print("[INFO] client connected!")

    def handleClose(self):
        print(self.address, 'closed')

def start_ws_server():
    server = SimpleWebSocketServer('', WS_SERVER_PORT, wsServer)
    print("[MAIN] INFO: Web Sockets server listen on " + str(WS_SERVER_PORT))
    server.serveforever()

def walking(dir):
    global quadruped_dir
    quadruped_8_servo_pyfirmata.set_all_home()
    while True:
        print(quadruped_dir)
        while quadruped_dir == "front":
            quadruped_8_servo_pyfirmata.walking_on()
        while quadruped_dir == "back":
            quadruped_8_servo_pyfirmata.walking_back()
        while quadruped_dir == "right":
            quadruped_8_servo_pyfirmata.turn_right()
        while quadruped_dir == "left":
            quadruped_8_servo_pyfirmata.turn_left()
        if quadruped_dir == "stop":
            quadruped_8_servo_pyfirmata.set_all_home()
        time.sleep(1)

print("[MAIN] INFO: start wifi robot control program!")
try:
    quadruped_8_servo_pyfirmata.setup_robot()
    th_walk = Thread_Walking()
    th_walk.start()
    print("[MAIN] Start Walking thread!")
    ultrasonic_ctrl.start_module()
    th_distance = Thread_Ultrasonic_distance()
    th_distance.start()
    print("[MAIN] Start Ultrasonic measure system!")
    start_ws_server()
    print("[MAIN] Start ws-server!")
except KeyboardInterrupt:
    print('[INFO] Exit wifi quadruped control program')
    ultrasonic_ctrl.close_module()
    sys.exit(0)
