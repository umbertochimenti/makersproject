import cv2

class UsbCamera(object):

    current_frame = None
    camera_width = 1
    camera_higth = 1

    def __init__(self):
        print("[INFO] start to capture camera from OpenCV ...")
    
    def set_source(self, source):
        self.video = cv2.VideoCapture(source)
        self.camera_width = int(self.video.get(3))
        self.camera_higth = int(self.video.get(4))

    def __del__(self):
        self.video.release()
    
    def get_frame(self):
        success, image = self.video.read()
        ret, jpeg = cv2.imencode('.jpg', image)
        self.current_frame = image
        return jpeg.tobytes()
