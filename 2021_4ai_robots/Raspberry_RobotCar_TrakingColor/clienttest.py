#PORTATILE CLIENT 
import socket
import speech_recognition as sr
from tkinter import *
from tkinter.ttk import *

class Example(Frame): #Example estende la classe Frame

    def __init__(self):
        super().__init__() #super: init della classe Frame
        self.initUI() # init della classe Example
    
    def initUI(self):
        self.pack(fill=BOTH, expand=1)
        def prendi():
            testo = "prendi"
            HOST = '192.168.1.69'#IP RASPBERRY
            PORT = 8080
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((HOST,PORT))
            s.send(testo.encode())
        def lascia():
            testo = "lascia"
            HOST = '192.168.1.69'#IP RASPBERRY
            PORT = 8080
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((HOST,PORT))
            s.send(testo.encode())
        def inviadati():
            testo = "stop"
            HOST = '192.168.1.69'#IP RASPBERRY
            PORT = 8080
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((HOST,PORT))
            s.send(testo.encode())
        def indietro():
            testo = "indietro"
            HOST = '192.168.1.69'#IP RASPBERRY
            PORT = 8080
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((HOST,PORT))
            s.send(testo.encode())
        def avanti():
            testo = "avanti"
            HOST = '192.168.1.69'#IP RASPBERRY
            PORT = 8080
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((HOST,PORT))
            s.send(testo.encode())
        def destra():
            testo = "destra"
            HOST = '192.168.1.69'#IP RASPBERRY
            PORT = 8080
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((HOST,PORT))
            s.send(testo.encode())
        def sinistra():
            testo = "sinistra"
            HOST = '192.168.1.69'#IP RASPBERRY
            PORT = 8080
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((HOST,PORT))
            s.send(testo.encode())
        invia = Button(self, text="STOP", command=inviadati)
        invia.place(x=10,y=170)
        invia = Button(self, text="TAKE", command=prendi)
        invia.place(x=110,y=170)
        invia = Button(self, text="DROP", command=lascia)
        invia.place(x=110,y=130)
        avanti = Button(self, text="⇧", command=avanti)
        avanti.place(x=60,y=10)
        indietro = Button(self, text="⇩", command=indietro)
        indietro.place(x=60,y=70)
        sinistra = Button(self, text="⇦", command=sinistra)
        sinistra.place(x=10,y=40)
        destra = Button(self, text="⇨", command=destra)
        destra.place(x=110,y=40)

def vocale():
        recognizer_instance = sr.Recognizer()
        with sr.Microphone() as source:
            recognizer_instance.adjust_for_ambient_noise(source)
            print("Sono in ascolto...")
            audio = recognizer_instance.listen(source)
        try:
            text = recognizer_instance.recognize_google(audio, language="it-IT")
            print("Google ha capito: \n", text)
            testo = text
        except Exception as e:
            print(e)
        HOST = '192.168.1.69'#IP RASPBERRY
        PORT = 8080
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((HOST,PORT))
        s.send(testo.encode())
# main
root = Tk()
root.geometry("200x200")
app = Example()
root.mainloop()

