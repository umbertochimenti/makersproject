#!/usr/bin/env python

import asyncio
import websockets
import json

position_update = { 
    "ball": { "x": 100, "y": 30 },
    "t1": { "x": "nan", "y": "nan" },
    "t2": { "x": "nan", "y": "nan" }
}

# position_update = { 
#     "ball": { "x": "nan", "y": "nan" },
#     "t1": { "x": 100, "y": 120 },
#     "t2": { "x": "nan", "y": "nan" }
# }

# position_update = { 
#     "ball": { "x": "nan", "y": "nan" },
#     "t1": { "x": "nan", "y": "nan" },
#     "t2": { "x": 13, "y": 34 }
# }

async def response_to_clients(websocket, path):
    
    global position_update
    msg_client = await websocket.recv()

    if msg_client == "request(table)":
        msg_server = json.dumps(position_update)
        await websocket.send(msg_server)
    else:
        print("[INFO] update soccer table position!")
        print(msg_client)
        position_update = msg_client
        #await websocket.send(update_msg_server)

start_server = websockets.serve(response_to_clients, "localhost", 8900)
print ("[INFO] ws-server started!")
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
