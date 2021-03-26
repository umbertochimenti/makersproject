from picamera.array import PiRGBArray
from picamera import PiCamera
from imutils.video import VideoStream
from flask import Response
from flask import Flask
from flask import render_template
import threading
import argparse
import datetime
import imutils
import time
import cv2

outputFrame = None
# lock to ensure thread-safe exchanges of frames (when multiple browsers/tabs are viewing the stream)
lock = threading.Lock()
# initialize a flask object
app = Flask(__name__,template_folder = 'html')
# initialize the video stream and allow the camera sensor to warmup
vs = VideoStream(usePiCamera=1).start()
#vs = VideoStream(src=0).start()
time.sleep(2.0)

@app.route("/")
def index():
	# return the rendered template
	return render_template("index.html")

def capture_from_camera():
	global outputFrame
	while True:
		frame = vs.read()
		frame = imutils.resize(frame, width=400)
		gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
		#imOut = cv2.cvtColor(frame,cv2.COLOR_GRAY2BGR)
		with lock:
			outputFrame = gray.copy()

def generate():
	# grab global references to the output frame and lock variables
	global outputFrame, lock
	# loop over frames from the output stream
	while True:
		# wait until the lock is acquired
		with lock:
			# check if the output frame is available, otherwise skip
			# the iteration of the loop
			if outputFrame is None:
				continue
			# encode the frame in JPEG format
			(flag, encodedImage) = cv2.imencode(".jpg", outputFrame)
			# ensure the frame was successfully encoded
			if not flag:
				continue
		# yield the output frame in the byte format
		yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + 
			bytearray(encodedImage) + b'\r\n')

@app.route("/video_feed")
def video_feed():
	# return the response generated along with the specific media
	# type (mime type)
	return Response(generate(),
		mimetype = "multipart/x-mixed-replace; boundary=frame")

if __name__ == '__main__':
	t = threading.Thread(target=capture_from_camera,)
	t.daemon = True
	t.start()
	app.run(host="192.168.137.117", port=9001, debug=True, threaded=True, use_reloader=False)

#vs.stop()