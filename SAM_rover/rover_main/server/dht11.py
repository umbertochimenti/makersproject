import RPi.GPIO as GPIO
import Adafruit_DHT
import time

dht11_pin = 27

meteo_data = {
  "temperature": -1,
  "humidity": -1
}

def setup():
    GPIO.setmode(GPIO.BCM)
 
def loop_sensor():
    global meteo_data, dht11_pin
    while True:
        humidity, temperature = Adafruit_DHT.read_retry(11, dht11_pin)
        meteo_data["temperature"] = temperature
        meteo_data["humidity"] = humidity
        #print("T= "+str(temperature)+"°, H= " + str(humidity) + "%")
        time.sleep(5)
 
def get_meteo_data():
    global meteo_data
    return meteo_data
