#!/usr/bin/env python

import asyncio
import websockets
import time

async def start_ws_communication(msg):
    uri = "ws://127.0.0.1:8900"
    async with websockets.connect(uri, subprotocols=["example-protocol"]) as websocket:
        await websocket.send(msg)
        print("[INFO] Client send msg: " + msg + " to server!")
        #response = await websocket.recv()
        #server_res = json.loads(response)
        #print(server_res["ball"]["x"])

def send_ws_server(msg):
    asyncio.get_event_loop().run_until_complete(start_ws_communication(msg))
