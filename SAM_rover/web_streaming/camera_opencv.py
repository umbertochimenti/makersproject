import os
import cv2
from base_camera import BaseCamera
import numpy as np

video_source = 2
start_record_video = False
record_video = False
record_file_name = "front"
fourcc = cv2.VideoWriter_fourcc(*'XVID')
out = cv2.VideoWriter("./vids/"+record_file_name+".avi", fourcc, 20.0, (640, 480))

class Camera(BaseCamera):
    
    current_frame = 0
    
    def __init__(self):
        super(Camera, self).__init__()

    def frames():
        global video_source, record_video, record_file_name, start_record_video, fourcc, out
        camera = cv2.VideoCapture(video_source)
        if not camera.isOpened():
            raise RuntimeError('Could not start camera.')

        while True:
            if start_record_video:
                out = cv2.VideoWriter("./vids/"+record_file_name+".avi", fourcc, 20.0, (640, 480))
                start_record_video = False

            # read current frame
            _, img = camera.read()
            Camera.current_frame = img
            if record_video:
                out.write(img)
            elif not record_video:
                out.release()

            # encode as a jpeg image and return it
            yield cv2.imencode('.jpg', img)[1].tobytes()

