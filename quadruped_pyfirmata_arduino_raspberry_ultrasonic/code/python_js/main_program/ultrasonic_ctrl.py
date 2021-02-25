#Libraries
import RPi.GPIO as GPIO
import time

GPIO_TRIGGER = 16
GPIO_ECHO = 12

def setup_pin():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(GPIO_TRIGGER, GPIO.OUT)
    GPIO.setup(GPIO_ECHO, GPIO.IN)

def distance():
    GPIO.output(GPIO_TRIGGER, True) 
    # set Trigger after 0.01ms to LOW
    time.sleep(0.00001)
    GPIO.output(GPIO_TRIGGER, False)
 
    StartTime = time.time()
    StopTime = time.time()
 
    # save StartTime
    while GPIO.input(GPIO_ECHO) == 0:
        StartTime = time.time()
 
    # save time of arrival
    while GPIO.input(GPIO_ECHO) == 1:
        StopTime = time.time()

    TimeElapsed = StopTime - StartTime
    distance = (TimeElapsed * 34300) / 2
 
    return distance

def start_module():
    print ("[ULTRASONIC] INFO: start module ...")
    setup_pin()
    print ("[ULTRASONIC] INFO: setup (OK)")
    time.sleep(0.3)

def close_module():
    GPIO.cleanup()

#start_module()
#while True:
#    d = distance()
#    print ("distance: " + str(d))
