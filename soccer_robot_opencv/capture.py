import numpy as np
from time import sleep
import cv2
import find_circle
import filter_color
import imutils

cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

filter_color.set_hsv_from_file("./config/hsv_ball.conf")
filter_color.set_hsv_from_file("./config/hsv_team1.conf")
filter_color.set_hsv_from_file("./config/hsv_team2.conf")

while(True):
	
	#sleep(0.3)
	ret, frame = cap.read()
	#frame = cv2.flip(frame, 0)
	#frame_threshold = filter_color.colorMask(frame)
	frame_threshold_ball = filter_color.filter_by_color(frame, "ball")
	frame_threshold_team1 = filter_color.filter_by_color(frame, "team1")
	frame_threshold_team2 = filter_color.filter_by_color(frame, "team2")

	gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
	find_circle.findCirclesColored(gray, frame, frame_threshold_ball, "ball")
	find_circle.findCirclesColored(gray, frame, frame_threshold_team1, "team1")
	find_circle.findCirclesColored(gray, frame, frame_threshold_team2, "team2")
	#find_circle.findCirclesDistance(gray, frame)
	#area_pixel.compute_area_pixel(frame, frame_threshold)

	cv2.imshow("Frame", frame)
	cv2.imshow("frame_threshold_ball", frame_threshold_ball)
	cv2.imshow("frame_threshold_team1", frame_threshold_team1)
	cv2.imshow("frame_threshold_team2", frame_threshold_team2)

	if cv2.waitKey(1) & 0xFF == ord('q'):
		break

# When everything done, release the capture
cap.release()
cv2.destroyAllWindows()
