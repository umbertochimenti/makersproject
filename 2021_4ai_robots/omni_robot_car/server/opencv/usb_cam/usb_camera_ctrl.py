import cv2
class VideoCamera(object):
    def __init__(self):
        self.video = cv2.VideoCapture(-1)
        print("[INFO] start to capture camera from OpenCV ...")
    def __del__(self):
        self.video.release()
    def get_frame(self):
        _, image = self.video.read()
        _, jpeg = cv2.imencode('.jpg', image)
        return jpeg.tobytes()