# import the necessary packages
from imutils import build_montages
from datetime import datetime
import numpy as np
import imagezmq
import argparse
import imutils
import cv2

imageHub = imagezmq.ImageHub()
lastActive = {}
lastActiveCheck = datetime.now()

while True:
	(rpiName, frame) = imageHub.recv_image()
	imageHub.send_reply(b'OK')
	if rpiName not in lastActive.keys():
		print("[INFO] receiving data from {}...".format(rpiName))
	lastActive[rpiName] = datetime.now()
	
	h,w = frame.shape[:2]
	x = w//2
	y = h//2
	frame = frame[int(y-h/4):int(y+h/4),int(x-w/4):int(x+w/4)]
	hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
	lower_blue = np.array([110,50,50])
	upper_blue = np.array([130,255,255])
	mask_blue = cv2.inRange(hsv, lower_blue, upper_blue)
	blue_result = cv2.bitwise_and(frame,frame, mask=mask_blue)
	lower_red = np.array([0,50,50])
	upper_red = np.array([10,255,255])
	mask0 = cv2.inRange(hsv, lower_red, upper_red)
	lower_red = np.array([170,50,50])
	upper_red = np.array([180,255,255])
	mask1 = cv2.inRange(hsv, lower_red, upper_red)
	mask_red = mask0+mask1
	red_result = cv2.bitwise_and(frame,frame, mask=mask_red)

	cv2.imshow('frame', frame)
	cv2.imshow('blue', blue_result)
	cv2.imshow('red', red_result)

	key = cv2.waitKey(1) & 0xFF

	if key == ord("q"):
		break

cv2.destroyAllWindows()
