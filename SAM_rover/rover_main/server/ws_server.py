import sys
import time
import signal
import threading
import json
#import l293d
import l293d_pca
import dht11
# import ir_sensors
import axis_6_servo
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
from threading import Thread
from types import SimpleNamespace

WS_SERVER_PORT = 9000
auto_mode = False
alert_distance = 40
critical_distance = 7
hole_detect = False
clients = []
ir_values = None

class wsServer(WebSocket):
	
	def handleMessage(self):
		global auto_mode, start_send_ultrasonic_values, alert_distance, critical_distance, hole_detect, ir_values
		msg = self.data
		if (msg).find("front#") != -1 and not hole_detect:
			print("front")
			l293d_pca.front()
		elif (msg).find("stop#") != -1:
			print("stop")
			l293d_pca.stop_robot()
		elif (msg).find("back#") != -1:
			print("back")
			l293d_pca.back()
		elif (msg).find("right#") != -1 and not hole_detect:
			print("right")
			l293d_pca.right()
		elif (msg).find("left#") != -1 and not hole_detect:
			print("left")
			l293d_pca.left()
		elif (msg).find("speed_min#") != -1:
			print("rover_speed_min")
			s = l293d_pca.get_speed()
			l293d_pca.set_speed(s-0.1)
		elif (msg).find("speed_plus#") != -1:
			print("rover_speed_plus")
			s = l293d_pca.get_speed()
			l293d_pca.set_speed(s+0.1)
		# elif (msg).find("hole_detectors#") != -1:
		# 	self.sendMessage(json.dumps(ir_sensors.get_ir_values())
		elif (msg).find("meteo_data#") != -1:
			self.sendMessage(json.dumps(dht11.get_meteo_data()))
		elif (msg).find("auto_modality#") != -1:
			auto_mode = True
		elif (msg).find("manual_modality#") != -1 or (msg).find("joypad_modality#") != -1:
			auto_mode = False
			l293d_pca.stop_robot()
		elif (msg).find("update_alert_distance#") != -1:
			alert_distance = int(msg[msg.index("#")+1:])
			#print("update_alert_distance: " + str(alert_distance))
		elif (msg).find("update_critical_distance#") != -1:
			critical_distance = int(msg[msg.index("#")+1:])
			#print("update_critical_distance: " + str(critical_distance))
		elif (msg).find("arm_start?") != -1:
			arm_axis = msg[ msg.index("?")+1 : msg.index(",") ]
			arm_command = msg[ msg.index(",")+1:]
			print("arm: " + str(arm_axis) + " command: " + arm_command)
			axis_6_servo.arm_6_axis[arm_axis]["jog"][arm_command] = True
		elif (msg).find("arm_stop?") != -1:
			arm_axis = msg[ msg.index("?")+1 : msg.index(",") ]
			arm_command = msg[msg.index(",")+1:]
			print("arm: " + str(arm_axis) + " command: " + arm_command)
			axis_6_servo.arm_6_axis[arm_axis]["jog"][arm_command] = False
		elif (msg).find("ir_right") != -1:
			ir_values = json.loads(msg, object_hook=lambda d: SimpleNamespace(**d))

	def handleConnected(self):
		print("[INFO] client " + str(self.address) + " connected!")
		clients.append(self)
		rover_speed = {"rover_speed":l293d_pca.get_speed()}
		self.sendMessage(json.dumps(rover_speed))

	def handleClose(self):
		global clients
		for cl in clients:
			print(cl.address)
			if cl.address == self.address:
				clients.remove(cl)
		print(self.address, 'closed')

def start_ws_server():
	server = SimpleWebSocketServer('', WS_SERVER_PORT, wsServer)
	print("[MAIN] INFO: Web Sockets server listen on " + str(WS_SERVER_PORT))
	server.serveforever()

# def thread_ir_manage(arg):
# 	ir_sensors.loop_sensors()

def thread_dht_manage(arg):
	dht11.loop_sensor()

def thread_hole_detect(arg):
	global hole_detect, ir_values
	while True:
		if ir_values is not None:
			if ir_values.ir_right or ir_values.ir_left:
				hole_detect = True
				l293d_pca.stop_robot()
				time.sleep(2)
			else:
				hole_detect = False
		time.sleep(0.05)

def arm_ctrl_loop(arg):
	while True:
		for servo_key, servo in axis_6_servo.arm_6_axis.items():
			if servo["jog"]["minus"] and axis_6_servo.arm_6_axis[servo_key]["angle"] >= 2:
				axis_6_servo.set_angle(servo["pin"], servo["angle"]-2)
				axis_6_servo.arm_6_axis[servo_key]["angle"] -= 2
				print(str(axis_6_servo.arm_6_axis[servo_key]["angle"]))
			elif servo["jog"]["plus"] and axis_6_servo.arm_6_axis[servo_key]["angle"] <= 178:
				axis_6_servo.set_angle(servo["pin"], servo["angle"]+2)
				axis_6_servo.arm_6_axis[servo_key]["angle"] += 2
				print(str(axis_6_servo.arm_6_axis[servo_key]["angle"]))
		time.sleep(0.1)

print("[MAIN] INFO: start wifi robot control program!")
try:
	l293d_pca.setup()
	print("[INFO] l293d setup OK!")
	# ir_sensors.setup()
	# thread_ir = threading.Thread(target=thread_ir_manage, args=(1,))
	# thread_ir.start()
	# print("[INFO] Start ir sensors thread manage!")
	dht11.setup()
	time.sleep(0.5)
	thread_dht = threading.Thread(target=thread_dht_manage, args=(1,))
	thread_dht.start()
	time.sleep(0.5)
	print("[INFO] Start dht11 sensor thread manage!")
	thread_hole_detect = threading.Thread(target=thread_hole_detect, args=(1,))
	thread_hole_detect.start()
	print("[INFO] Start hole detect thread!")
	time.sleep(0.5)
	axis_6_servo.setup()
	axis_6_servo.set_home()
	thread_arm_ctrl = threading.Thread(target=arm_ctrl_loop, args=(1,))
	thread_arm_ctrl.start()
	print("[INFO] Setup robot 6-axis arm complete!")
	start_ws_server()
	print("[INFO] Start ws-server!")
except KeyboardInterrupt:
	GPIO.cleanup()
	print('[INFO] Exit wifi robot control program')
	sys.exit(0)
