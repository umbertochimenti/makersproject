import RPi.GPIO as GPIO
import numpy as np
import cv2
import time
from time import sleep

GPIO.setmode(GPIO.BCM)

GPIO_TRIGGER1 = 27      #Left ultrasonic sensor
GPIO_ECHO1 = 17

GPIO_TRIGGER2 = 25      #Front ultrasonic sensor
GPIO_ECHO2 = 22

GPIO_TRIGGER3 = 24      #Right ultrasonic sensor
GPIO_ECHO3 = 23

MOTOR1B=6  #Left Motor
MOTOR1E=5
MOTOR2B=20  #Right Motor
MOTOR2E=21

GPIO.setwarnings(False)
GPIO.setup(GPIO_TRIGGER1,GPIO.OUT)  # Trigger
GPIO.setup(GPIO_ECHO1,GPIO.IN)      # Echo
GPIO.setup(GPIO_TRIGGER2,GPIO.OUT)  # Trigger
GPIO.setup(GPIO_ECHO2,GPIO.IN)      # Echo
GPIO.setup(GPIO_TRIGGER3,GPIO.OUT)  # Trigger
GPIO.setup(GPIO_ECHO3,GPIO.IN)      # Echo

# Set trigger to False (Low)
GPIO.output(GPIO_TRIGGER1, False)
GPIO.output(GPIO_TRIGGER2, False)
GPIO.output(GPIO_TRIGGER3, False)

GPIO.setup(MOTOR1B, GPIO.OUT)
GPIO.setup(MOTOR1E, GPIO.OUT)
GPIO.setup(MOTOR2B, GPIO.OUT)
GPIO.setup(MOTOR2E, GPIO.OUT)

#Define Robot Command
def reverse():
      GPIO.output(MOTOR1B, GPIO.HIGH)
      GPIO.output(MOTOR1E, GPIO.LOW)
      GPIO.output(MOTOR2B, GPIO.HIGH)
      GPIO.output(MOTOR2E, GPIO.LOW)
     
def forward():
      GPIO.output(MOTOR1B, GPIO.LOW)
      GPIO.output(MOTOR1E, GPIO.HIGH)
      GPIO.output(MOTOR2B, GPIO.LOW)
      GPIO.output(MOTOR2E, GPIO.HIGH)
     
def rightturn():
      GPIO.output(MOTOR1B,GPIO.LOW)
      GPIO.output(MOTOR1E,GPIO.HIGH)
      GPIO.output(MOTOR2B,GPIO.HIGH)
      GPIO.output(MOTOR2E,GPIO.LOW)
     
def leftturn():
      GPIO.output(MOTOR1B,GPIO.HIGH)
      GPIO.output(MOTOR1E,GPIO.LOW)
      GPIO.output(MOTOR2B,GPIO.LOW)
      GPIO.output(MOTOR2E,GPIO.HIGH)

def stop():
      GPIO.output(MOTOR1E,GPIO.LOW)
      GPIO.output(MOTOR1B,GPIO.LOW)
      GPIO.output(MOTOR2E,GPIO.LOW)
      GPIO.output(MOTOR2B,GPIO.LOW)
  
# Function For the distance between Utrasonic    
def sonar(GPIO_TRIGGER,GPIO_ECHO):
      start=0
      stop=0
      # Set pins as output and input
      GPIO.setup(GPIO_TRIGGER,GPIO.OUT)  # Trigger
      GPIO.setup(GPIO_ECHO,GPIO.IN)      # Echo
     
      # Set trigger to False (Low)
      GPIO.output(GPIO_TRIGGER, False)
     
      # Allow module to settle
      time.sleep(0.01)
           
      #while distance > 5:
      #Send 10us pulse to trigger
      GPIO.output(GPIO_TRIGGER, True)
      time.sleep(0.00001)
      GPIO.output(GPIO_TRIGGER, False)
      begin = time.time()
      while GPIO.input(GPIO_ECHO)==0 and time.time()<begin+0.05:
            start = time.time()
     
      while GPIO.input(GPIO_ECHO)==1 and time.time()<begin+0.1:
            stop = time.time()
     
      # Calculate pulse length
      elapsed = stop-start
      distance = elapsed * 34000
     
      # That was the distance there and back so halve the value
      distance = distance / 2
     
      print("Distance : %.1f" % distance)
      # Reset GPIO settings
      return distance


#lower_and_upper = adaptive_hsv_filter.set_hsv_filter_object()
#print(lower_and_upper)
MIN_PIXEL_BALL = 700
MAX_PIXEL_BALL = 20000
min_pixel_found = False
car_near_ball = False

#Start
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

while cap.isOpened():
    #distance coming from front ultrasonic sensor
    distanceC = sonar(GPIO_TRIGGER2,GPIO_ECHO2)
    #distance coming from right ultrasonic sensor
    distanceR = sonar(GPIO_TRIGGER3,GPIO_ECHO3)
    #distance coming from left ultrasonic sensor
    distanceL = sonar(GPIO_TRIGGER1,GPIO_ECHO1)
    ret, frame = cap.read()
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    lower_red = np.array([0,50,50])
    upper_red = np.array([10,255,255])
    mask0 = cv2.inRange(hsv, lower_red, upper_red)
    lower_red = np.array([170,50,50])
    upper_red = np.array([180,255,255])
    mask1 = cv2.inRange(hsv, lower_red, upper_red)
    mask = mask0+mask1
    roi_left = mask[0:480,0:212]
    roi_center = mask[0:480,212:425]
    roi_right = mask[0:480,425:640]
    #cv2.imshow("roi_left", roi_left)
    #cv2.imshow("roi_center", roi_center)
    #cv2.imshow("roi_right", roi_right)
    #se la distanza dall'ultrasonic e maggiore di 15 la macchina riparte con la ricerca
    if distanceC > 15:
        car_near_ball = False
    #Dividiamo il frame il 3 porzioni Left Right e Central
    central_white_pixel = np.sum(roi_center == 255)
    left_white_pixel = np.sum(roi_left == 255)
    right_white_pixel = np.sum(roi_right == 255)
    print("left:" + str(left_white_pixel) + " center: " + str(central_white_pixel) + " right: " + str(right_white_pixel))

    if not car_near_ball:
        if central_white_pixel > MIN_PIXEL_BALL or left_white_pixel > MIN_PIXEL_BALL or right_white_pixel > MIN_PIXEL_BALL:
            min_pixel_found = True
        else:
            min_pixel_found = False

        if min_pixel_found:
            #se ci sono piu pixel bianchi nell frame centrale la macchina va avanti
            if central_white_pixel >= left_white_pixel and central_white_pixel >= right_white_pixel:
                print("go_on")
                forward()
                sleep(0.05)
                stop()
            #se ci sono piu pixel bianchi nell frame di destra la macchina va a destra
            elif right_white_pixel > central_white_pixel:
                print("go_right")
                rightturn()
                sleep(0.05)
                stop()
            #se ci sono piu pixel bianchi nell frame di sinistra la macchina va a sinistra
            elif left_white_pixel > central_white_pixel:
                print("car_left")
                leftturn()
                sleep(0.05)
                stop()
            #se la macchina si sta per scontrare / si è avvicinata all'oggetto rosso si ferma
            if distanceC < 15:
                car_near_ball = True
                
        else:
            #fase di ricerca della palla, gira a sinistra con pausa
            print("research")
            leftturn()       
            sleep(0.1)
            print("stop_car")
            stop()
            sleep(0.1)

    if cv2.waitKey(1) == ord('q'):
        break
cap.release()
cv2.destroyAllWindows()