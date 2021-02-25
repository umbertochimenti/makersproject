import pyfirmata
from pyfirmata import SERVO
from time import sleep

board = "nan"
right_back_paw = "nan"
right_back_leg = "nan"
left_back_paw = "nan"
left_back_leg = "nan"
right_up_paw = "nan"
right_up_leg = "nan"
left_up_paw = "nan"
left_up_leg = "nan"
pause_move = 0.2

def setup_robot():
    global board
    board = pyfirmata.Arduino('/dev/ttyACM0')
    set_pins()
    set_all_home()

def set_pins():
    global board
    global right_back_leg, right_back_paw, left_back_leg, left_back_paw
    global right_up_leg, right_up_paw, left_up_leg, left_up_paw
    right_back_paw = board.get_pin('d:13:s')
    right_back_leg = board.get_pin('d:12:s')
    left_back_paw = board.get_pin('d:11:s')
    left_back_leg = board.get_pin('d:10:s')
    right_up_paw = board.get_pin('d:9:s')
    right_up_leg = board.get_pin('d:8:s')
    left_up_paw = board.get_pin('d:7:s')
    left_up_leg = board.get_pin('d:6:s')
    print("[INFO] board set_pin (OK)")

def set_all_home():
    global walking_stop
    walking_stop = True
    print("[INFO] set_all_home (..)")
    home_leg(right_up_leg, right_up_paw)
    home_leg(left_back_leg, left_back_paw)
    home_leg(left_up_leg, left_up_paw)
    home_leg(right_back_leg, right_back_paw)
    #sleep(pause_move)
    print("[INFO] set_all_home (OK)")

def home_leg(leg_pin, paw_pin):
    leg_pin.write(90)
    paw_pin.write(90)
    #sleep(pause_move)

def step (side, angle, leg_pin, paw_pin):

    if side == "right":
        paw_pin.write(120)
    else: 
        paw_pin.write(60)
    sleep(pause_move)
  
    if side == "right":
        leg_pin.write(90+angle)
    else:
        leg_pin.write(90-angle)
    sleep(pause_move)

    paw_pin.write(90)
    sleep(pause_move)
    leg_pin.write(90)
    sleep(pause_move)

def walking_on():
    print("[INFO] walking_on (..)")
    global right_back_leg, right_back_paw, left_back_leg, left_back_paw
    global right_up_leg, right_up_paw, left_up_leg, left_up_paw
    step ("right", 25, right_up_leg, right_up_paw)
    step ("left", 25, left_back_leg, left_back_paw)
    step ("left", 25, left_up_leg, left_up_paw)
    step ("right", 25, right_back_leg, right_back_paw)
    print("[INFO] walking step (OK)")

def walking_back():
    print("[INFO] walking_back ... TODO!")
    sleep(pause_move)

def turn_left():
    print("[INFO] turn_left ... TODO!")
    sleep(pause_move)

def turn_right():
    print("[INFO] turn_right ... TODO!")
    sleep(pause_move)

# try:
#     setup_robot()
#     walking_on()
#     sleep(pause_move)
# except KeyboardInterrupt:
#     board.exit()
