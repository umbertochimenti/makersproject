import numpy as np
import cv2

cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

refPt = []
crop = False
object = "?"

def set_object_to_detect(obj):
	global object
	object = obj
	print ("[INFO] Setting hsv for " + object)

def click_and_crop (event, x, y, flags, param):

	global crop, refPt
	
    # if the left mouse button was clicked
	if event == cv2.EVENT_LBUTTONDOWN:
		refPt = [(x, y)]
	
    # check to see if the left mouse button was released
	elif event == cv2.EVENT_LBUTTONUP:
		crop = True
		refPt.append((x, y))

cv2.namedWindow('Frame')
cv2.setMouseCallback('Frame', click_and_crop)

def start_main():
	global crop
	while(True):

		ret, frame = cap.read()

		# draw a rectangle around the region of interest
		if len(refPt) == 2 and crop:
			cv2.rectangle(frame, refPt[0], refPt[1], (0, 255, 0), 2)
			#start: left_buttom
			start_x = refPt[0][0]
			start_y = refPt[0][1]
			#end: right_low
			end_x = refPt[1][0]
			end_y = refPt[1][1]
			#print() #[(277, 319), (368, 363)]
			roi = frame[start_y:end_y,start_x:end_x]
			roi_HSV = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
			average = roi_HSV.mean(axis=0).mean(axis=0)
			st_dev = roi_HSV.std(axis=0).std(axis=0)
			print(average)
			print(st_dev)
			f = open("./config/hsv_not_def.conf", "w")
			if object == "ball":
				f = open("./config/hsv_ball.conf", "w")
			elif object == "team1":
				f = open("./config/hsv_team1.conf", "w")
			elif object == "team2":
				f = open("./config/hsv_team2.conf", "w")
			
			f.write("H=" + str(round(average[0])) + ",Hs=" + str(round(st_dev[0])) +
					"|S=" + str(round(average[1])) + ",Ss=" + str(round(st_dev[1])) +
					"|V=" + str(round(average[2])) + ",Vs=" + str(round(st_dev[2])) + "#")
			f.close()
			cv2.imshow("roi_HSV", roi_HSV)
			crop = False
		
		cv2.imshow("Frame", frame)

		if cv2.waitKey(1) & 0xFF == ord('q'):
			break

	# When everything done, release the capture
	cap.release()
	cv2.destroyAllWindows()
