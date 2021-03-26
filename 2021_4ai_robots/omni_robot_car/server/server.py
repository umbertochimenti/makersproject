import sys
import time
import motori
import signal
import serial
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
WS_SERVER_PORT = 9000
serial_conn = ""
class wsServer(WebSocket):
    global serial_conn
    def handleMessage(self):
        msg = self.data
        print(msg)
        if (msg).find("car_right_up#") != -1:
            print("right_up")
            #serial_conn.write(b'w/r/n')
            motori.trasl_right_up()
        elif (msg).find("car_stop#") != -1:
            print("stop")

            #serial_conn.write(b'f/r/n')
            motori.reset_all()
        elif (msg).find("car_right_down#") != -1:
            print("right_down")
            motori.trasl_right_down()
            #serial_conn.write(b's/r/n')
        elif (msg).find("car_left_down#") != -1:
            print("left_down")
            motori.trasl_left_down()
            #serial_conn.write(b'd/r/n')
        elif (msg).find("car_left_up#") != -1:
            print("left_up")
            motori.trasl_left_up()
            #serial_conn.write(b'a/r/n')
        elif (msg).find("car_trasl_right#") != -1:
            print("trasl_right")
            motori.trasl_right()
            #serial_conn.write(b's/r/n')
        elif (msg).find("car_trasl_left#") != -1:
            print("trasl_left")
            motori.trasl_left()
            #serial_conn.write(b'd/r/n')

        #if
        elif (msg).find("car_on#") != -1:
            print("on")
            #serial_conn.write(b'w/r/n')
            motori.front()
        elif (msg).find("car_stop#") != -1:
            print("stop")

            #serial_conn.write(b'f/r/n')
            motori.reset_all()
        elif (msg).find("car_down#") != -1:
            print("back")
            motori.back()
            #serial_conn.write(b's/r/n')
        elif (msg).find("car_right#") != -1:
            print("right")
            motori.right()
            #serial_conn.write(b'd/r/n')
        elif (msg).find("car_left#") != -1:
            print("left")
            motori.left()
            #serial_conn.write(b'a/r/n')'''
        #fine if
        elif (msg).find("arm_off#") != -1:
            print("arm_off")
            serial_conn.write(b'b')
        elif (msg).find("arm1_sx#") != -1:
            print("arm_sx")
            serial_conn.write(b'c')
        elif (msg).find("arm1_dx#") != -1:
            print("arm1_dx")
            serial_conn.write(b'd')
        elif (msg).find("arm2_up#") != -1:
            print("arm2_up")
            serial_conn.write(b'e')
        elif (msg).find("arm2_down#") != -1:
            print("arm2_down")
            serial_conn.write(b'f')
        elif (msg).find("arm3_up#") != -1:
            print("arm3_up")
            serial_conn.write(b'g')
        elif (msg).find("arm3_down#") != -1:
            print("arm3_down")
            serial_conn.write(b'h')
        elif (msg).find("arm4_up#") != -1:
            print("arm4_up")
            serial_conn.write(b'i')
        elif (msg).find("arm4_down#") != -1:
            print("arm4_down")
            serial_conn.write(b'l')
        elif (msg).find("arm5_up#") != -1:
            print("arm5_up")
            serial_conn.write(b'm')
        elif (msg).find("arm5_down#") != -1:
            print("arm5_down")
            serial_conn.write(b'n')
        elif (msg).find("arm6_up#") != -1:
            print("arm_up")
            serial_conn.write(b'o')
        elif (msg).find("arm6_down#") != -1:
            print("arm6_down")
            serial_conn.write(b'p')
        '''elif (msg).find("cam_down#") != -1:
            print("cam_down")
            serial_conn.write(b'q')
        elif (msg).find("cam_up#") != -1:
            print("cam_up")
            serial_conn.write(b'r')'''

  
    def handleConnected(self):
        print("[INFO] client connected!")
    def handleClose(self):
        print(self.address, 'closed')
def start_ws_server():
    server = SimpleWebSocketServer('', WS_SERVER_PORT, wsServer)
    print("[MAIN] INFO: Web Sockets server listen on " + str(WS_SERVER_PORT))
    server.serveforever()
# main
print("[MAIN] INFO: start wifi robot control program!")
try:
    motori.setup_board()
    motori.reset_all()
    serial_conn = serial.Serial()
    serial_conn.baudrate = 9600
    serial_conn.port = "/dev/ttyACM0"
    serial_conn.open()  
    print("[INFO] Serial port open!")
    start_ws_server()
except KeyboardInterrupt:
    GPIO.cleanup()
    print('[INFO] Exit wifi robot control program')
    sys.exit(0)