import cv2
import numpy as np

S_DEV_MULTIPLY = 7
mask_ball = 0
mask_team1 = 0
mask_team2 = 0

def read_config_hsv_file():
	
	global h, s, v, hs, ss, vs

	first_line = "|"
	with open("./config/hsv.conf") as f:
		first_line = f.readline()
	
	h = int(float(first_line[first_line.find("H=")+2:first_line.find(",Hs=")-1]))
	hs = int(float(first_line[first_line.find("Hs=")+3:first_line.find("S=")-1]))
	s = int(float(first_line[first_line.find("S=")+2:first_line.find("Ss=")-1]))
	ss = int(float(first_line[first_line.find("Ss=")+3:first_line.find("V=")-1]))
	v = int(float(first_line[first_line.find("V=")+2:first_line.find("Vs=")-1]))
	vs = int(float(first_line[first_line.find("Vs=")+3:first_line.find("#")]))

def set_hsv_from_file(file_name):
	
	global mask_ball, mask_team1, mask_team2

	first_line = "|"
	with open(file_name) as f:
		first_line = f.readline()

	h = int(float(first_line[first_line.find("H=")+2:first_line.find(",Hs=")-1]))
	hs = int(float(first_line[first_line.find("Hs=")+3:first_line.find("S=")-1]))
	s = int(float(first_line[first_line.find("S=")+2:first_line.find("Ss=")-1]))
	ss = int(float(first_line[first_line.find("Ss=")+3:first_line.find("V=")-1]))
	v = int(float(first_line[first_line.find("V=")+2:first_line.find("Vs=")-1]))
	vs = int(float(first_line[first_line.find("Vs=")+3:first_line.find("#")]))

	h_l = h-(hs*S_DEV_MULTIPLY)
	s_l = s-(ss*S_DEV_MULTIPLY)
	v_l = v-(vs*S_DEV_MULTIPLY)
	h_h = h+(hs*S_DEV_MULTIPLY)
	s_h = s+(ss*S_DEV_MULTIPLY)
	v_h = v+(vs*S_DEV_MULTIPLY)

	if h_l < 0: h_l = 0
	if s_l < 0: s_l = 0
	if v_l < 0: v_l = 0
	if h_h > 180: h_h = 180
	if s_h > 255: s_h = 255
	if v_h > 255: v_h = 255

	if file_name == "./config/hsv_ball.conf":
		mask_ball = np.array([[h_l, s_l, v_l], [h_h, s_h, v_h]])
	elif file_name == "./config/hsv_team1.conf":
		mask_team1 = np.array([[h_l, s_l, v_l], [h_h, s_h, v_h]])
	elif file_name == "./config/hsv_team2.conf":
		mask_team2 = np.array([[h_l, s_l, v_l], [h_h, s_h, v_h]])

def filter_by_color(frame, object_name):
	
	frame_HSV = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
	if object_name == "ball":
		frame_threshold = cv2.inRange(frame_HSV, mask_ball[0], mask_ball[1])
	elif object_name == "team1":
		frame_threshold = cv2.inRange(frame_HSV, mask_team1[0], mask_team1[1])
	elif object_name == "team2":
		frame_threshold = cv2.inRange(frame_HSV, mask_team2[0], mask_team2[1])
	
	return frame_threshold
