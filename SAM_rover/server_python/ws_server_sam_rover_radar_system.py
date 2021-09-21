from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket

class wsServer(WebSocket):

    hello_msg = "[PY_SERVER] Hello from server!"
    ultrasonic_msg="{\"1\":\"34\",\"2\":\"23\",\"3\":\"45\",\"4\":\"56\",\"15\":\"23\",\"16\":\"12\",\"7\":\"34\",\"8\":\"14\",\"9\":\"78\",\"10\":\"23\",\"11\":\"16\",\"12\":\"43\",\"13\":\"31\"}"

    def handleMessage(self):
        if (self.data).find("JS_RADAR") != -1:
            self.sendMessage(wsServer.ultrasonic_msg)
        else:
            print("[FROM STATION]: " + self.data)
            wsServer.ultrasonic_msg = self.data

    def handleConnected(self):
        print("[INFO] Client connected!")

    def handleClose(self):
        print(self.address, 'closed')

server = SimpleWebSocketServer('', 9000, wsServer)
print("[INFO] Server listen ..")
server.serveforever()
