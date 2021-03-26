#RASPBERRY
import time
import socket #import the socket module
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
GPIO.cleanup()
GPIO.setwarnings(False)
MOTOR1B=14  #Left Motor
MOTOR1E=15
MOTOR2B=18  #Right Motor
MOTOR2E=23
SERVONE=12

HOST = '192.168.1.xx'
PORT = 8080

GPIO.setup(MOTOR1B, GPIO.OUT)
GPIO.setup(MOTOR1E, GPIO.OUT)
GPIO.setup(MOTOR2B, GPIO.OUT)
GPIO.setup(MOTOR2E, GPIO.OUT)
GPIO.setup(SERVONE,GPIO.OUT)

def stopp():
    GPIO.output(MOTOR1E,GPIO.LOW)
    GPIO.output(MOTOR1B,GPIO.LOW)
    GPIO.output(MOTOR2E,GPIO.LOW)
    GPIO.output(MOTOR2B,GPIO.LOW)


print("[INFO] Start server on IP:"+ str(HOST) + " on PORT:"+ str(PORT))
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
    servo1 = GPIO.PWM(SERVONE,50)
    servo1.start(0)
    server.bind((HOST,PORT))
    server.listen()
    print('[INFO] Server in ascolto..')
    while True:
        conn, addres = server.accept()
        print('[INFO] Server accept client' + str(addres))
        #stampa messaggio ricevuto dal client
        clientmex = conn.recv(1024)#i 1024 sono i bit che puo ricevere max
        messaggio = (clientmex.decode('utf-8'))
        print(str(messaggio))
        if (messaggio == "prendi"):
            duty = 2
            while duty <= 12:
                servo1.ChangeDutyCycle(duty)
                time.sleep(1)
                duty = duty + 1
        if (messaggio == "lascia"):
            servo1.ChangeDutyCycle(7)
            print ("Turning back to 0 degrees")
            servo1.ChangeDutyCycle(2)
            time.sleep(0.5)
            servo1.ChangeDutyCycle(0)
            servo1.stop()
            
        if (messaggio == "avanti"):
            GPIO.output(MOTOR1B, GPIO.HIGH)
            GPIO.output(MOTOR1E, GPIO.LOW)
            GPIO.output(MOTOR2B, GPIO.HIGH)
            GPIO.output(MOTOR2E, GPIO.LOW)
            time.sleep(0.5)
            stopp()

        if (messaggio == "indietro"):
            GPIO.output(MOTOR1B, GPIO.LOW)
            GPIO.output(MOTOR1E, GPIO.HIGH)
            GPIO.output(MOTOR2B, GPIO.LOW)
            GPIO.output(MOTOR2E, GPIO.HIGH)
            time.sleep(0.5)
            stopp()

        if (messaggio == "sinistra"):
            GPIO.output(MOTOR1B,GPIO.LOW)
            GPIO.output(MOTOR1E,GPIO.HIGH)
            GPIO.output(MOTOR2B,GPIO.HIGH)
            GPIO.output(MOTOR2E,GPIO.LOW)
            time.sleep(0.5)
            stopp()

        if (messaggio == "destra"):
            GPIO.output(MOTOR1B,GPIO.HIGH)
            GPIO.output(MOTOR1E,GPIO.LOW)
            GPIO.output(MOTOR2B,GPIO.LOW)
            GPIO.output(MOTOR2E,GPIO.HIGH)
            time.sleep(0.5)
            stopp()
            

        if (messaggio == "stop"):
            GPIO.output(MOTOR1E,GPIO.LOW)
            GPIO.output(MOTOR1B,GPIO.LOW)
            GPIO.output(MOTOR2E,GPIO.LOW)
            GPIO.output(MOTOR2B,GPIO.LOW)

GPIO.cleanup()

        
	        
