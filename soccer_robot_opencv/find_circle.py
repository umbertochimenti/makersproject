import numpy as np
import cv2
import ws_client

blue =	(255, 0, 0)
green = (0, 255, 0)
red =	(0, 0, 255)

def findCirclesColored (gray, img, frame_threshold, object):

	circles = cv2.HoughCircles(gray, cv2.HOUGH_GRADIENT, 1.15, 20)

	if circles is not None:
		circles = np.round(circles[0, :]).astype("int")

		for (x, y, r) in circles:
			cv2.circle(img, (x, y), r, green, 4)
			cv2.circle(img, (x, y), 2, red, 4)
			# top left corner of rectangle
			start_point = (x-r, y-r)
			# bottom right corner of rectangle 
			end_point = (x+r, y+r)
			box = cv2.rectangle(img, start_point, end_point, blue, 4)
			roi = frame_threshold[y-r:y+r, x-r:x+r]
			if cv2.countNonZero(roi) > 1000:
				if object == "ball":
					print("[INFO] Find ball!")
					ws_client.send_ws_server("ball("+str(x)+","+str(y)+")")
				elif object == "team1":
					print("[INFO] Find robot team 1!")
					ws_client.send_ws_server("t1("+str(x)+","+str(y)+")")
				elif object == "team2":
					print("[INFO] Find robot team 2!")
					ws_client.send_ws_server("t2("+str(x)+","+str(y)+")")

