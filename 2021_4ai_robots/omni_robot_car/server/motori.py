import RPi.GPIO as GPIO
import time

in_3 = 23
in_4 = 24
in_1 = 25
in_2 = 16
in_7 = 17
in_8 = 27
in_5 = 22
in_6 = 5




GPIO.setwarnings(False)

def setup_board():
    global in_1, in_2, in_3, in_4, in_5, in_6, in_7, in_8
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(in_1, GPIO.OUT)
    GPIO.setup(in_2, GPIO.OUT)
    GPIO.setup(in_3, GPIO.OUT)
    GPIO.setup(in_4, GPIO.OUT)
    GPIO.setup(in_5, GPIO.OUT)
    GPIO.setup(in_6, GPIO.OUT)
    GPIO.setup(in_7, GPIO.OUT)
    GPIO.setup(in_8, GPIO.OUT)
def reset_all():
    global  in_1, in_2, in_3, in_4, in_5, in_6, in_7, in_8
    GPIO.output(in_1, GPIO.LOW)
    GPIO.output(in_2, GPIO.LOW)
    GPIO.output(in_3, GPIO.LOW)
    GPIO.output(in_4, GPIO.LOW)
    GPIO.output(in_5, GPIO.LOW)
    GPIO.output(in_6, GPIO.LOW)
    GPIO.output(in_7, GPIO.LOW)
    GPIO.output(in_8, GPIO.LOW)
def front():
    global  in_1, in_2, in_3, in_4, in_5, in_6, in_7, in_8
    GPIO.output(in_1, GPIO.LOW)
    GPIO.output(in_2, GPIO.HIGH)
    GPIO.output(in_3, GPIO.LOW)
    GPIO.output(in_4, GPIO.HIGH)
    GPIO.output(in_5, GPIO.HIGH)
    GPIO.output(in_6, GPIO.LOW)
    GPIO.output(in_7, GPIO.HIGH)
    GPIO.output(in_8, GPIO.LOW)

def back():
    global  in_1, in_2, in_3, in_4, in_5, in_6, in_7, in_8
    GPIO.output(in_1, GPIO.HIGH)
    GPIO.output(in_2, GPIO.LOW)
    GPIO.output(in_3, GPIO.HIGH)
    GPIO.output(in_4, GPIO.LOW)
    GPIO.output(in_5, GPIO.LOW)
    GPIO.output(in_6, GPIO.HIGH)
    GPIO.output(in_7, GPIO.LOW)
    GPIO.output(in_8, GPIO.HIGH)


def trasl_left():
    global  in_1, in_2, in_3, in_4, in_5, in_6, in_7, in_8
    GPIO.output(in_1, GPIO.HIGH)
    GPIO.output(in_2, GPIO.LOW)
    GPIO.output(in_3, GPIO.HIGH)
    GPIO.output(in_4, GPIO.LOW)
    GPIO.output(in_5, GPIO.HIGH)
    GPIO.output(in_6, GPIO.LOW)
    GPIO.output(in_7, GPIO.HIGH)
    GPIO.output(in_8, GPIO.LOW)

def trasl_right():
    global  in_1, in_2, in_3, in_4, in_5, in_6, in_7, in_8
    GPIO.output(in_1, GPIO.LOW)
    GPIO.output(in_2, GPIO.HIGH)
    GPIO.output(in_3, GPIO.LOW)
    GPIO.output(in_4, GPIO.HIGH)
    GPIO.output(in_5, GPIO.LOW)
    GPIO.output(in_6, GPIO.HIGH)
    GPIO.output(in_7, GPIO.LOW)
    GPIO.output(in_8, GPIO.HIGH)

def trasl_left_down():
    global  in_1, in_2, in_3, in_4, in_5, in_6, in_7, in_8
    GPIO.output(in_1, GPIO.HIGH)
    GPIO.output(in_2, GPIO.LOW)
    GPIO.output(in_3, GPIO.HIGH)
    GPIO.output(in_4, GPIO.LOW)
    GPIO.output(in_5, GPIO.LOW)
    GPIO.output(in_6, GPIO.LOW)
    GPIO.output(in_7, GPIO.LOW)
    GPIO.output(in_8, GPIO.LOW)

def trasl_left_up():
    global  in_1, in_2, in_3, in_4, in_5, in_6, in_7, in_8
    GPIO.output(in_1, GPIO.LOW)
    GPIO.output(in_2, GPIO.LOW)
    GPIO.output(in_3, GPIO.LOW)
    GPIO.output(in_4, GPIO.LOW)
    GPIO.output(in_5, GPIO.HIGH)
    GPIO.output(in_6, GPIO.LOW)
    GPIO.output(in_7, GPIO.HIGH)
    GPIO.output(in_8, GPIO.LOW)
def trasl_right_up():
    global  in_1, in_2, in_3, in_4, in_5, in_6, in_7, in_8
    GPIO.output(in_1, GPIO.LOW)
    GPIO.output(in_2, GPIO.HIGH)
    GPIO.output(in_3, GPIO.LOW)
    GPIO.output(in_4, GPIO.HIGH)
    GPIO.output(in_5, GPIO.LOW)
    GPIO.output(in_6, GPIO.LOW)
    GPIO.output(in_7, GPIO.LOW)
    GPIO.output(in_8, GPIO.LOW)

def trasl_right_down():
    global  in_1, in_2, in_3, in_4, in_5, in_6, in_7, in_8
    GPIO.output(in_1, GPIO.LOW)
    GPIO.output(in_2, GPIO.LOW)
    GPIO.output(in_3, GPIO.LOW)
    GPIO.output(in_4, GPIO.LOW)
    GPIO.output(in_5, GPIO.LOW)
    GPIO.output(in_6, GPIO.HIGH)
    GPIO.output(in_7, GPIO.LOW)
    GPIO.output(in_8, GPIO.HIGH)

def left():
    global  in_1, in_2, in_3, in_4, in_5, in_6, in_7, in_8
    GPIO.output(in_1, GPIO.HIGH)
    GPIO.output(in_2, GPIO.LOW)
    GPIO.output(in_3, GPIO.LOW)
    GPIO.output(in_4, GPIO.HIGH)
    GPIO.output(in_5, GPIO.HIGH)
    GPIO.output(in_6, GPIO.LOW)
    GPIO.output(in_7, GPIO.LOW)
    GPIO.output(in_8, GPIO.HIGH)

def right():
    global  in_1, in_2, in_3, in_4, in_5, in_6, in_7, in_8
    GPIO.output(in_1, GPIO.LOW)
    GPIO.output(in_2, GPIO.HIGH)
    GPIO.output(in_3, GPIO.HIGH)
    GPIO.output(in_4, GPIO.LOW)
    GPIO.output(in_5, GPIO.LOW)
    GPIO.output(in_6, GPIO.HIGH)
    GPIO.output(in_7, GPIO.HIGH)
    GPIO.output(in_8, GPIO.LOW)