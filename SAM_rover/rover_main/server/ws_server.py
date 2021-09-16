import sys
import time
import signal
import threading
import json
import l293d
#import hcrs04_sensors
import dht11
import ir_sensors
import axis_6_servo
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
from threading import Thread

WS_SERVER_PORT = 9000
auto_mode = False
alert_distance = 40
critical_distance = 7
hole_detect = False
clients = []
#thread_loop_hcrs04_to_clients = None
#thread_loop_hcrs04_to_clients_started = False

class wsServer(WebSocket):
	
	def handleMessage(self):
		global auto_mode, start_send_ultrasonic_values, alert_distance, critical_distance
		msg = self.data
		#print(msg)
		if (msg).find("front#") != -1 and not hole_detect:
			print("front")
			l293d.front()
		elif (msg).find("stop#") != -1:
			print("stop")
			l293d.stop_robot()
		elif (msg).find("back#") != -1:
			print("back")
			l293d.back()
		elif (msg).find("right#") != -1 and not hole_detect:
			print("right")
			l293d.right()
		elif (msg).find("left#") != -1 and not hole_detect:
			print("left")
			l293d.left()
		elif (msg).find("speed_min#") != -1:
			print("rover_speed_min")
			s = l293d.get_speed()
			l293d.set_speed(s-0.1)
		elif (msg).find("speed_plus#") != -1:
			print("rover_speed_plus")
			s = l293d.get_speed()
			l293d.set_speed(s+0.1)
		elif (msg).find("obstacle_distances#") != -1:
			print("obstacle_distances")
			# start_loop_hcrs_values_push_to_clients()
		elif (msg).find("hole_detectors#") != -1:
			#print("hole_detectors")
			self.sendMessage(json.dumps(ir_sensors.get_ir_values()))
		elif (msg).find("meteo_data#") != -1:
			#print("meteo_data")
			self.sendMessage(json.dumps(dht11.get_meteo_data()))
		elif (msg).find("auto_modality#") != -1:
			print("auto_modality")
			auto_mode = True
		elif (msg).find("manual_modality#") != -1 or (msg).find("joypad_modality#") != -1:
			print("[INFO] manual/joypad modality setted!")
			auto_mode = False
			l293d.stop_robot()
		elif (msg).find("update_alert_distance#") != -1:
			alert_distance = int(msg[msg.index("#")+1:])
			#print("update_alert_distance: " + str(alert_distance))
		elif (msg).find("update_critical_distance#") != -1:
			critical_distance = int(msg[msg.index("#")+1:])
			#print("update_critical_distance: " + str(critical_distance))
		elif (msg).find("arm_start?") != -1:
			print(msg)
			arm_axis = msg[ msg.index("?")+1 : msg.index(",") ]
			arm_command = msg[ msg.index(",")+1:]
			print("arm: " + str(arm_axis) + " command: " + arm_command)
			axis_6_servo.arm_6_axis[arm_axis]["jog"][arm_command] = True
		elif (msg).find("arm_stop?") != -1:
			print(msg)
			arm_axis = msg[ msg.index("?")+1 : msg.index(",") ]
			arm_command = msg[msg.index(",")+1:]
			print("arm: " + str(arm_axis) + " command: " + arm_command)
			axis_6_servo.arm_6_axis[arm_axis]["jog"][arm_command] = False

	def handleConnected(self):
		print("[INFO] client " + str(self.address) + " connected!")
		clients.append(self)
		rover_speed = {"rover_speed":l293d.get_speed()}
		self.sendMessage(json.dumps(rover_speed))

	def handleClose(self):
		# global thread_loop_hcrs04_to_clients, thread_loop_hcrs04_to_clients_started
		global clients
		for cl in clients:
			print(cl.address)
			if cl.address == self.address:
				clients.remove(cl)
		# if not clients:
		# 	# thread_loop_hcrs04_to_clients.join()
		# 	thread_loop_hcrs04_to_clients_started = False
		print(self.address, 'closed')

def start_ws_server():
	server = SimpleWebSocketServer('', WS_SERVER_PORT, wsServer)
	print("[MAIN] INFO: Web Sockets server listen on " + str(WS_SERVER_PORT))
	server.serveforever()

def thread_hcrs04_manage(arg):
	hcrs04_sensors.loop_sensors()

def thread_ir_manage(arg):
	ir_sensors.loop_sensors()

def thread_dht_manage(arg):
	dht11.loop_sensor()

def thread_hole_detect(arg):
	global hole_detect
	while True:
		ir_values = ir_sensors.get_ir_values()
		if ir_values['ir_left'] or ir_values['ir_right']:
			hole_detect = True
			#l293d.back()
			#time.sleep(0.5)
			l293d.stop_robot()
			time.sleep(2)
		else:
			hole_detect = False
		time.sleep(0.05)

def arm_ctrl_loop(arg):
	while True:
		#print("arm_ctrl_loop")
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

# def start_loop_hcrs_values_push_to_clients():
# 	global thread_loop_hcrs04_to_clients, thread_loop_hcrs04_to_clients_started
# 	if not thread_loop_hcrs04_to_clients_started:
# 		thread_loop_hcrs04_to_clients = threading.Thread(target=push_hcrs04_values_to_clients, args=(1,))
# 		thread_loop_hcrs04_to_clients.start()
# 		thread_loop_hcrs04_to_clients_started = True

# def push_hcrs04_values_to_clients(arg):
# 	global clients
# 	while True:
# 		for client in clients:
# 			client.sendMessage(json.dumps(hcrs04_sensors.get_distances()))
# 		time.sleep(0.2)

def thread_automatic_manage(arg):
	global alert_distance, critical_distance, hole_detect
	while True:
		if auto_mode and not hole_detect:
			print("auto cycle")
			ultrasonic_values = hcrs04_sensors.get_distances()
			if (
				ultrasonic_values["left"] < alert_distance or
				ultrasonic_values["center"] < alert_distance or
				ultrasonic_values["right"] < alert_distance
				):
				if ultrasonic_values["check-right"] < alert_distance:
					l293d.left()
					time.sleep(1.5)
				else:
					l293d.right()
					time.sleep(0.5)
				if (
					ultrasonic_values["left"] < critical_distance or
					ultrasonic_values["center"] < critical_distance or
					ultrasonic_values["right"] < 7):
					l293d.back()
					time.sleep(0.5)
					l293d.right()
					time.sleep(0.5)
			else:
				l293d.front()
			time.sleep(0.01)
		else:
			time.sleep(0.5)

# main
print("[MAIN] INFO: start wifi robot control program!")
try:
	l293d.setup()
	print("[INFO] l293d setup OK!")
	ir_sensors.setup()
	thread_ir = threading.Thread(target=thread_ir_manage, args=(1,))
	thread_ir.start()
	print("[INFO] Start ir sensors thread manage!")
	dht11.setup()
	time.sleep(0.5)
	thread_dht = threading.Thread(target=thread_dht_manage, args=(1,))
	thread_dht.start()
	time.sleep(0.5)
	print("[INFO] Start dht11 sensor thread manage!")
	#thread_auto = threading.Thread(target=thread_automatic_manage, args=(1,))
	#thread_auto.start()
	#print("[INFO] Start automatic/manual thread robot manage!")
	#time.sleep(0.5)
	thread_hole_detect = threading.Thread(target=thread_hole_detect, args=(1,))
	thread_hole_detect.start()
	print("[INFO] Start hole detect thread!")
	time.sleep(0.5)
	axis_6_servo.setup()
	axis_6_servo.set_home()
	thread_arm_ctrl = threading.Thread(target=arm_ctrl_loop, args=(1,))
	thread_arm_ctrl.start()
	print("[INFO] Setup robot 6-axis arm complete!")
	#hcrs04_sensors.setup()
	#thread_hcrs04 = threading.Thread(target=thread_hcrs04_manage, args=(1,))
	#thread_hcrs04.start()
	#time.sleep(0.5)
	#print("[INFO] Start hcrs04 ultrasonics thread manage!")
	start_ws_server()
	print("[INFO] Start ws-server!")
except KeyboardInterrupt:
	GPIO.cleanup()
	print('[INFO] Exit wifi robot control program')
	sys.exit(0)
