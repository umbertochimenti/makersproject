import os
import cv2
from base_camera_2 import BaseCamera2
import numpy as np

video_source = 0
start_record_video = False
record_video = False
record_file_name = "retro"
fourcc = cv2.VideoWriter_fourcc(*'XVID')
camera = cv2.VideoCapture(video_source)
camera_width = int(camera.get(3))
camera_higth = int(camera.get(4))
out = cv2.VideoWriter("./vids/"+record_file_name+".avi", fourcc, 20.0, (camera_width, camera_higth))
current_frame = 0

class Camera2(BaseCamera2):
    
    current_frame = 0

    def __init__(self):
        super(Camera2, self).__init__()

    def frames():
        global video_source, record_video, record_file_name, start_record_video, fourcc, out, camera, current_frame
        # camera = cv2.VideoCapture(video_source)
        if not camera.isOpened():
            raise RuntimeError('Could not start camera.')

        while True:
            if start_record_video:
                out = cv2.VideoWriter("./vids/"+record_file_name+".avi", fourcc, 20.0, (camera_width, camera_higth))
                start_record_video = False

            # read current frame
            _, img = camera.read()
            current_frame = img
            if record_video:
                out.write(img)
            elif not record_video:
                out.release()

            # encode as a jpeg image and return it
            yield cv2.imencode('.jpg', img)[1].tobytes()

