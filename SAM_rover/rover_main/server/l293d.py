import pyfirmata
from pyfirmata import OUTPUT
from time import sleep

board, in1, in2, in3, in4 = 0, 0, 0, 0, 0
speed = 0.5

def setup():
    global board, in1, in2, in3, in4
    board = pyfirmata.Arduino('/dev/ttyACM0')
    sleep(1)
    #set pin in pwm mode
    in1 = board.get_pin('d:9:p')
    in2 = board.get_pin('d:6:p')
    in3 = board.get_pin('d:11:p')
    in4 = board.get_pin('d:10:p')
    sleep(1)

def front():
    global in1, in2, in3, in4, speed
    in1.write(speed)
    in2.write(0)
    in3.write(speed)
    in4.write(0)

def back():
    global in1, in2, in3, in4, speed
    in1.write(0)
    in2.write(speed)
    in3.write(0)
    in4.write(speed)

def right():
    global in1, in2, in3, in4, speed
    in1.write(speed)
    in2.write(0)
    in3.write(0)
    in4.write(speed)

def left():
    global in1, in2, in3, in4, speed
    in1.write(0)
    in2.write(speed)
    in3.write(speed)
    in4.write(0)

def stop_robot():
    global in1, in2, in3, in4
    in1.write(0)
    in2.write(0)
    in3.write(0)
    in4.write(0)

def get_speed():
    global speed
    return speed

def set_speed(s):
    global speed
    speed = s

def test_l293d():
    print("[INFO] Test L293d pyfirmata!")
    setup()
    stop_robot()
    sleep(1)
    front()
    sleep(0.2)
    back()
    sleep(0.2)    
    stop_robot()
    sleep(1)
    right()
    sleep(0.2)
    left()
    sleep(0.2)    
    stop_robot()
    sleep(1)
