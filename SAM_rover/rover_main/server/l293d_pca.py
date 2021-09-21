#sudo pip3 install adafruit-circuitpython-pca9685
#sudo pip3 install adafruit-circuitpython-servokit
from time import sleep
import board
import busio
import adafruit_pca9685
i2c = busio.I2C(board.SCL, board.SDA)
pca = adafruit_pca9685.PCA9685(i2c)
pca.frequency = 60

speed = 0.5
pwm_value = 0
m1_1 = None
m1_2 = None
m2_1 = None
m2_2 = None

def setup():
    global m1_1, m1_2, m2_1, m2_2
    m1_1 = pca.channels[6]
    m1_2 = pca.channels[7]
    m2_1 = pca.channels[8]
    m2_2 = pca.channels[9]
    from_speed_to_pwm_value()
    sleep(0.5)
    print("[INFO] setup done!")

def from_speed_to_pwm_value():
    global speed, pwm_value
    pwm_value = int(speed*65535)

def left():
    global m1_1, m1_2, m2_1, m2_2, pwm_value
    m1_1.duty_cycle = pwm_value
    m1_2.duty_cycle = 0
    m2_1.duty_cycle = pwm_value
    m2_2.duty_cycle = 0

def right():
    global m1_1, m1_2, m2_1, m2_2, pwm_value
    m1_1.duty_cycle = 0
    m1_2.duty_cycle = pwm_value
    m2_1.duty_cycle = 0
    m2_2.duty_cycle = pwm_value

def back():
    global m1_1, m1_2, m2_1, m2_2, pwm_value
    m1_1.duty_cycle = pwm_value
    m1_2.duty_cycle = 0
    m2_1.duty_cycle = 0
    m2_2.duty_cycle = pwm_value

def front():
    global m1_1, m1_2, m2_1, m2_2, pwm_value
    m1_1.duty_cycle = 0
    m1_2.duty_cycle = pwm_value
    m2_1.duty_cycle = pwm_value
    m2_2.duty_cycle = 0

def stop_robot():
    global m1_1, m1_2, m2_1, m2_2
    m1_1.duty_cycle = 0
    m1_2.duty_cycle = 0
    m2_1.duty_cycle = 0
    m2_2.duty_cycle = 0

def get_speed():
    global speed
    return speed

def set_speed(s):
    global speed
    speed = s
    from_speed_to_pwm_value()

def test_l293d():
    print("[INFO] Test L293d pca!")
    setup()
    front()
    sleep(1)
    stop_robot()
    sleep(1)
    back()
    sleep(1)    
    stop_robot()
    sleep(1)
    right()
    sleep(1)
    stop_robot()
    sleep(1)
    left()
    sleep(1)    
    stop_robot()

#test_l293d()
