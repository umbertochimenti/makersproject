#!/usr/bin/env python
from importlib import import_module
import os
from flask import Flask, render_template, Response
import cv2
import numpy as np
from time import sleep
from usb_camera import UsbCamera

app = Flask(__name__)
camera = UsbCamera()
camera.set_source(0)
start_record_video = False
record_video = False
record_file_name = ""
video_writer = cv2.VideoWriter("./vids/empty.avi", cv2.VideoWriter_fourcc(*'XVID'), 20.0, (640, 480))

@app.route('/')
def index():
    """Video streaming home page."""
    return render_template('index.html')

@app.route('/getmethod/<jsdata>')
def save_frame_1(jsdata):
    cv2.imwrite("./frames/"+str(jsdata)+".png", camera.current_frame)
    return jsdata

@app.route('/start_vids_front/<jsdata>')
def start_vids_front(jsdata):
    global start_record_video, record_video, record_file_name
    record_file_name = jsdata
    start_record_video = True
    record_video = True
    return jsdata

@app.route('/stop_vids_front/<jsdata>')
def stop_vids_front(jsdata):
    global record_video
    record_video = False
    return jsdata

def gen(camera):
    global start_record_video, record_video, record_file_name, video_writer
    while True:
        frame = camera.get_frame()
        if start_record_video:
            video_writer = cv2.VideoWriter("./vids/"+record_file_name+".avi", cv2.VideoWriter_fourcc(*'XVID'), 20.0, (camera.camera_width, camera.camera_higth))
            start_record_video = False
        
        if record_video:
            video_writer.write(camera.current_frame)
        elif not record_video:
            video_writer.release()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    """Video streaming route. Put this in the src attribute of an img tag."""
    return Response(gen(camera),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='192.168.43.114', port=5000, threaded=True)
