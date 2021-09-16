#sudo pip3 install adafruit-circuitpython-servokit
#https://learn.adafruit.com/16-channel-pwm-servo-driver/python-circuitpython
#For continuous Rotation Servos (kit.continuous_servo[1].throttle = [1, 0.5, 0, -1])

from time import sleep
from adafruit_servokit import ServoKit

kit = None

arm_6_axis = {
	"axis1": {
        "pin": 0,
		"angle": 90,
        "jog": {
            "plus": False,
            "minus": False
        }
	},
    "axis2": {
        "pin": 1,
		"angle": 90,
        "jog": {
            "plus": False,
            "minus": False
        }
	},
    "axis3": {
        "pin": 2,
		"angle": 90,
        "jog": {
            "plus": False,
            "minus": False
        }
	},
    "axis4": {
        "pin": 3,
		"angle": 90,
        "jog": {
            "plus": False,
            "minus": False
        }
	},
    "axis5": {
        "pin": 4,
		"angle": 90,
        "jog": {
            "plus": False,
            "minus": False
        }
	},
    "axis6": {
        "pin": 5,
		"angle": 90,
        "jog": {
            "plus": False,
            "minus": False
        }
	}
}

def setup():
    global kit, arm_6_axis
    kit = ServoKit(channels=16)
    print("[INFO] setup done!")

def set_angle(servo, angle):
    global kit
    print("set servo pin: " + str(servo) + " at angle: " + str(angle))
    kit.servo[servo].angle = angle

def set_home():
    global arm_6_axis
    for servo in arm_6_axis.values():
        pin_servo = servo["pin"]
        set_angle(pin_servo, 90)
        sleep(0.5)

def test_6_axis_servo():
    global arm_6_axis
    for a in range (0,181,15):
        for servo in arm_6_axis.values():
            pin_servo = servo["pin"]
            set_angle(pin_servo, a)
            sleep(0.2)
    print("[INFO] end loop test!")

# setup()
# sleep(1)
# set_home()
# sleep(1)
# test_6_axis_servo()
