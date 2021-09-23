import cv2
import numpy as np
# import the necessary packages
from imutils import build_montages
from datetime import datetime
import numpy as np
import imagezmq
import argparse
import imutils
import cv2

# initialize the ImageHub object
imageHub = imagezmq.ImageHub()

lastActive = {}
lastActiveCheck = datetime.now()


roi = np.zeros((200,200,3), np.uint8)
bgr_avg = np.zeros((200,200,3), np.uint8)
hsv_avg = np.zeros((200,200,3), np.uint8)
final_result = np.zeros((640,480,3), np.uint8)
rect = []
press_and_release = False
rect_hsv = []
press_and_release_hsv = False

def frame_mouse(event, x, y, flags, param):
    global rect, press_and_release
    if event == cv2.EVENT_LBUTTONDOWN:
        rect = [(x,y)]
        press_and_release = False
    if event == cv2.EVENT_LBUTTONUP:
        rect.append((x,y))
        press_and_release = True

def frame_mouse_hsv(event, x, y, flags, param):
    global rect_hsv, press_and_release_hsv
    if event == cv2.EVENT_LBUTTONDOWN:
        rect_hsv = [(x,y)]
        press_and_release_hsv = False
    if event == cv2.EVENT_LBUTTONUP:
        rect_hsv.append((x,y))
        press_and_release_hsv = True

cap = cv2.VideoCapture(0)
cv2.namedWindow("frame")
cv2.moveWindow("frame", 10,10)
cv2.namedWindow("hsv")
cv2.moveWindow("hsv", 670,10)
cv2.namedWindow("roi")
cv2.moveWindow("roi", 10,660)
cv2.namedWindow("bgr_avg")
cv2.moveWindow("bgr_avg", 700,670)
cv2.namedWindow("hsv_avg")
cv2.moveWindow("hsv_avg", 1100,670)
cv2.namedWindow("final_result")
cv2.moveWindow("final_result", 1100,670)
cv2.setMouseCallback("frame", frame_mouse)
cv2.setMouseCallback("hsv", frame_mouse_hsv)

while True:
    (rpiName, frame) = imageHub.recv_image()
    imageHub.send_reply(b'OK')
	# if a device is not in the last active dictionary then it means
	# that its a newly connected device
    if rpiName not in lastActive.keys():
        print("[INFO] receiving data from {}...".format(rpiName))
	# record the last active time for the device from which we just
	# received a frame
    lastActive[rpiName] = datetime.now()
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    if press_and_release:
        roi = frame [rect[0][1]:rect[1][1],rect[0][0]:rect[1][0]]
        bgr_avg_color_per_row = np.average(roi, axis=0)
        bgr_avg_color = np.average(bgr_avg_color_per_row, axis=0)
        bgr_avg[0:200,0:200] = bgr_avg_color

    if press_and_release_hsv:
        roi_hsv = hsv [rect_hsv[0][1]:rect_hsv[1][1],rect_hsv[0][0]:rect_hsv[1][0]]
        hsv_avg_color_per_row = np.average(roi_hsv, axis=0)
        hsv_avg_color = np.average(hsv_avg_color_per_row, axis=0)
        hsv_avg[0:200,0:200] = hsv_avg_color
        param = 10
        lower_h = 0 if hsv_avg_color[0]-param < 0 else hsv_avg_color[0]-param
        lower_s = 0 if hsv_avg_color[1]-param < 0 else hsv_avg_color[1]-param
        lower_v = 0 if hsv_avg_color[2]-param < 0 else hsv_avg_color[2]-param
        upper_h = 179 if hsv_avg_color[0]+param > 179 else hsv_avg_color[0]+param
        upper_s = 255 if hsv_avg_color[1]+param > 255 else hsv_avg_color[1]+param
        upper_v = 255 if hsv_avg_color[2]+param > 255 else hsv_avg_color[2]+param
        lower = np.array([lower_h,lower_s,lower_v])
        upper = np.array([upper_h,upper_s,upper_v])
        mask = cv2.inRange(hsv, lower, upper)
        final_result = cv2.bitwise_and(frame,frame, mask= mask)

    cv2.imshow("frame", frame)
    cv2.imshow("hsv", hsv)
    cv2.imshow("roi", roi)
    cv2.imshow("bgr_avg", bgr_avg)
    cv2.imshow("hsv_avg", hsv_avg)
    cv2.imshow("final_result", final_result)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break
cap.release()
cv2.destroyAllWindows()
