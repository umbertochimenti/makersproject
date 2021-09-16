import pyfirmata
from pyfirmata import INPUT
from time import sleep

board = 0
ir_right = 0
ir_left = 0

ir_values = {
    "ir_left": 0,
    "ir_right": 0
}

def setup():
    global board, ir_right, ir_left
    board = pyfirmata.Arduino('/dev/ttyACM0')
    ir_left = board.get_pin('d:2:i')
    ir_right = board.get_pin('d:4:i')
    it = pyfirmata.util.Iterator(board)
    it.start()
    sleep(1)

def read_ir(pin):
    if pin.read() == 1:
        print("[WARNING] Hole!")
    else:
        print("[INFO] ok!")

def loop_sensors():
    global ir_values, ir_right, ir_left
    while True:
        ir_values["ir_right"] = ir_right.read()
        ir_values["ir_left"] = ir_left.read()
        sleep(0.05)

def test_ir():
    global ir_left, ir_right
    print("[INFO] Test ir_sensors pyfirmata!")
    setup()
    while True:
        read_ir(ir_right)
        read_ir(ir_left)
        sleep(0.2)

def get_ir_values():
    global ir_values
    return ir_values
