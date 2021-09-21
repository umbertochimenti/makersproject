#!/usr/bin/env python
from importlib import import_module
import os
from flask import Flask, render_template, Response
import camera_opencv
import camera_opencv_2
from camera_opencv import Camera
from camera_opencv_2 import Camera2
import cv2
import numpy as np
from time import sleep
# from camera_pi import Camera

app = Flask(__name__)
camera1 = Camera()
sleep(.2)
camera2 = Camera2()
sleep(.2)

@app.route('/')
def index():
    """Video streaming home page."""
    return render_template('index.html')

@app.route('/getmethod/<jsdata>')
def save_frame_1(jsdata):
    cv2.imwrite("./frames/"+str(jsdata)+".png", camera1.current_frame)
    return jsdata

@app.route('/getmethod2/<jsdata>')
def save_frame_2(jsdata):
    cv2.imwrite("./frames/"+str(jsdata)+".png", camera_opencv_2.current_frame)
    return jsdata

@app.route('/start_vids_front/<jsdata>')
def start_vids_front(jsdata):
    camera_opencv.start_record_video = True
    camera_opencv.record_file_name = jsdata
    camera_opencv.record_video = True
    return jsdata

@app.route('/stop_vids_front/<jsdata>')
def stop_vids_front(jsdata):
    camera_opencv.record_video = False
    return jsdata

@app.route('/start_vids_retro/<jsdata>')
def start_vids_retro(jsdata):
    camera_opencv_2.start_record_video = True
    camera_opencv_2.record_file_name = jsdata
    camera_opencv_2.record_video = True
    return jsdata

@app.route('/stop_vids_retro/<jsdata>')
def stop_vids_retro(jsdata):
    camera_opencv_2.record_video = False
    return jsdata

def gen(camera):
    
    """Video streaming generator function."""
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    """Video streaming route. Put this in the src attribute of an img tag."""
    return Response(gen(camera1),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/video_feed_2')
def video_feed_2():
    """Video streaming route. Put this in the src attribute of an img tag."""
    return Response(gen(camera2),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='192.168.43.193', port=5000, threaded=True)
