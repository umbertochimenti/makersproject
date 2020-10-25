from flask import Flask, render_template, Response
from usb_camera_ctrl import VideoCamera
import requests

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', config="null")

@app.route('/getinfo')
def getinfo():
    print("get_info")
    return result

def gen(camera):
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(gen(VideoCamera()), mimetype='multipart/x-mixed-replace; boundary=frame')

def start_web_stream():
    app.run(host='192.168.43.55', port=9001, threaded=False, debug=False)
