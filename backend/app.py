import os
import sys
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.evaluator import TriSealEvaluator
from backend.crypto_ledger import CryptographicLedger

app = FastAPI(title="TriSeal Bayora Secure Logic Engine", version="2.4.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Real Core Instances
crypto_ledger = CryptographicLedger()
evaluator = TriSealEvaluator(ledger=crypto_ledger)

# Static Files Setup
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
app.mount("/css", StaticFiles(directory=os.path.join(BASE_DIR, "css")), name="css")
app.mount("/js", StaticFiles(directory=os.path.join(BASE_DIR, "js")), name="js")

@app.get("/", response_class=HTMLResponse)
async def get_index():
    index_path = os.path.join(BASE_DIR, "index.html")
    if os.path.exists(index_path):
        with open(index_path, "r", encoding="utf-8") as f:
            return f.read()
    return "TriSeal Backend Engine Active"

# REST API Endpoints

class EvalRequest(BaseModel):
    custom_prompt: str = None

@app.post("/api/eval/run")
async def trigger_evaluation(req: EvalRequest = None):
    prompt = req.custom_prompt if req else None
    result = evaluator.run_single_evaluation(custom_prompt=prompt)
    return JSONResponse(content=result)

@app.get("/api/ledger/blocks")
async def get_ledger_blocks():
    return JSONResponse(content={"blocks": crypto_ledger.chain, "height": len(crypto_ledger.chain)})

@app.get("/api/ledger/verify")
async def verify_ledger_chain():
    result = crypto_ledger.verify_chain()
    return JSONResponse(content=result)

@app.post("/api/ledger/tamper")
async def tamper_ledger_block(block_index: int = 1):
    success = crypto_ledger.tamper_block(block_index)
    return JSONResponse(content={"tampered": success, "block_index": block_index})

@app.get("/api/assurance_report")
async def get_assurance_report():
    report = crypto_ledger.generate_assurance_report()
    return JSONResponse(content=report)

# Real Telemetry WebSocket Endpoint
active_websockets = []

@app.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_websockets.append(websocket)
    try:
        while True:
            # Execute real evaluation round
            eval_event = evaluator.run_single_evaluation()
            
            # Send real event payload to client
            await websocket.send_json(eval_event)
            await asyncio.sleep(1.0)
    except WebSocketDisconnect:
        active_websockets.remove(websocket)
    except Exception as e:
        if websocket in active_websockets:
            active_websockets.remove(websocket)
