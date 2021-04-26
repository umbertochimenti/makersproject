import sys
import time
import signal
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
from threading import Thread

WS_SERVER_PORT = 9000

class wsServer(WebSocket):

	def handleMessage(self):
		msg = self.data
		print(msg)
		# if (msg).find("rewabot|go_to_table#") != -1:
		# 	print("on")
		# 	l293d.car_on()
		# elif (msg).find("car_stop#") != -1:
		# 	print("stop")
		# 	l293d.car_stop()
		# elif (msg).find("car_back#") != -1:
		# 	print("back")
		# 	l293d.car_back()
		# elif (msg).find("car_right#") != -1:
		# 	print("right")
		# 	l293d.car_right()
		# elif (msg).find("car_left#") != -1:
		# 	print("left")
		# 	l293d.car_left()

	def handleConnected(self):
		print("[INFO] client connected!")

	def handleClose(self):
		print(self.address, 'closed')

def start_ws_server():
	server = SimpleWebSocketServer('', WS_SERVER_PORT, wsServer)
	print("[MAIN] INFO: Web Sockets server listen on " + str(WS_SERVER_PORT))
	server.serveforever()
	
# main
print("[MAIN] INFO: start rewabot robot control program!")
try:
	start_ws_server()
	print("[INFO] Start ws-server!")
except KeyboardInterrupt:
	print('[INFO] Exit rewabot control program!')
	sys.exit(0)
