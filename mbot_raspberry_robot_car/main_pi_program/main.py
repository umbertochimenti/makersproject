import sys
import time
import signal
import serial
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
from threading import Thread
import usb_camera_web_streaming

WS_SERVER_PORT = 9000
serial_conn = ""

class ThreadWebStreamUSB(Thread):
    def __init__(self):
        Thread.__init__(self)
        
    def run(self):
        usb_camera_web_streaming.start_web_stream()

class wsServer(WebSocket):

	global serial_conn

	def handleMessage(self):
		msg = self.data
		print(msg)
		if (msg).find("car_on#") != -1:
			print("on")
			serial_conn.write(b'w/r/n')
		elif (msg).find("car_stop#") != -1:
			print("stop")
			serial_conn.write(b'f/r/n')
		elif (msg).find("car_back#") != -1:
			print("back")
			serial_conn.write(b's/r/n')
		elif (msg).find("car_right#") != -1:
			print("right")
			serial_conn.write(b'd/r/n')
		elif (msg).find("car_left#") != -1:
			print("left")
			serial_conn.write(b'a/r/n')
		elif (msg).find("follow_active#") != -1:
			print("follow")
			serial_conn.write(b'i/r/n')
		elif (msg).find("obstacle_active#") != -1:
			print("obstacle")
			serial_conn.write(b'u/r/n')
		elif (msg).find("wifi_active#") != -1:
			print("wifi")
			serial_conn.write(b'y/r/n')
		elif (msg).find("speed_up#") != -1:
			print("speed_up")
			serial_conn.write(b'+/r/n')
		elif (msg).find("speed_down#") != -1:
			print("speed_down")
			serial_conn.write(b'-/r/n')

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
	serial_conn = serial.Serial()
	serial_conn.baudrate = 9600
	serial_conn.port = "/dev/ttyUSB0"
	serial_conn.open()
	print("[INFO] Serial port open!")
	thWebUSB = ThreadWebStreamUSB()
	thWebUSB.start()
	print("[INFO] USB-Camera Web stream active!")
	start_ws_server()
	print("[INFO] Start ws-server!")

except KeyboardInterrupt:
	GPIO.cleanup()
	print('[INFO] Exit wifi robot control program')
	sys.exit(0)
