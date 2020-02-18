from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket

class wsServer(WebSocket):

    hello_msg = "[PY_SERVER] Hello from server!"
    ultrasonic_msg="..."

    def handleMessage(self):
        if (self.data).find("DISTANCE") != -1:
            print("[FROM STATION]: " + self.data)
            wsServer.ultrasonic_msg = self.data

        if (self.data).find("ID_JS") != -1:
            self.sendMessage(wsServer.ultrasonic_msg)

    def handleConnected(self):
        if (self.data).find("ID_JS") != -1:
            print("[INFO] Is a JS CLient!")

    def handleClose(self):
        print(self.address, 'closed')

server = SimpleWebSocketServer('', 9000, wsServer)
print("[INFO] Server listen ..")
server.serveforever()
