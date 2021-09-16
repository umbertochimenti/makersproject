import RPi.GPIO as GPIO
import time

trig_central = 23
echo_central = 24
trig_right = 25
echo_right = 8
trig_left = 14
echo_left = 15
trig_check_right = 7
echo_check_right = 1

distances = {
  "right": -1,
  "center": -1,
  "left": -1,
  "check-right":-1
}

def setup():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(trig_central, GPIO.OUT)
    GPIO.setup(echo_central, GPIO.IN)
    GPIO.setup(trig_right, GPIO.OUT)
    GPIO.setup(echo_right, GPIO.IN)
    GPIO.setup(trig_left, GPIO.OUT)
    GPIO.setup(echo_left, GPIO.IN)
    GPIO.setup(trig_check_right, GPIO.OUT)
    GPIO.setup(echo_check_right, GPIO.IN)
 
def compute_distance(trig, echo):
    GPIO.output(trig, True) 
    # set Trigger after 0.01ms to LOW
    time.sleep(0.00001)
    GPIO.output(trig, False)
 
    start_time = time.time()
    stop_time = time.time()
 
    # save StartTime
    while GPIO.input(echo) == 0:
        start_time = time.time()
 
    # save time of arrival
    while GPIO.input(echo) == 1:
        stop_time = time.time()
 
    # time difference between start and arrival
    time_enlapsed = stop_time - start_time
    # multiply with the sonic speed (34300 cm/s)
    # and divide by 2, because there and back
    distance = (time_enlapsed*34300)/2
 
    return distance

def test_sensors():
    setup()
    print ("[INFO] setup (OK)")
    while True:
        print("[INFO] central: " + str(compute_distance(trig_central, echo_central)))
        time.sleep(0.04)
        print("[INFO] right: " + str(compute_distance(trig_right, echo_right)))
        time.sleep(0.04)
        print("[INFO] left: " + str(compute_distance(trig_left, echo_left)))
        time.sleep(0.04)
        print("[INFO] check-right: " + str(compute_distance(trig_check_right, echo_check_right)))
        time.sleep(0.04)

def loop_sensors():
    global distances
    while True:
        distances["right"] = compute_distance(trig_right, echo_right)
        time.sleep(0.07)
        distances["center"] = compute_distance(trig_central, echo_central)
        time.sleep(0.07)
        distances["left"] = compute_distance(trig_left, echo_left)
        time.sleep(0.07)
        distances["check-right"] = compute_distance(trig_check_right, echo_check_right)
        time.sleep(0.07)
        #print("ultrasonic loop")

def get_distances():
    global distances
    return distances
