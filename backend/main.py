from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi import Depends
import json
import asyncio
import numpy as np
import pandas as pd

from NeuralNetwork import NeuralNetwork
from request_models import TrainParameters
from context import get_context
from context import Context

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAIN_LOOP = asyncio.get_event_loop()

@app.post("/upload-train-data")
async def create_upload_file(file: UploadFile, context: Context = Depends(get_context)):
    file_location = f"train_data.csv"
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())

    context.train_data = file_location

    return {"filename": file.filename}  

@app.post("/train-model")
async def train_model(train_parametrs: TrainParameters, context: Context = Depends(get_context)):
    
    if(context.train_data == None):
        raise HTTPException(status_code=400, detail="No training data uploaded")
    
    if(train_parametrs.test_set_percentage + train_parametrs.test_set_percentage > 100):
        raise HTTPException(status_code=400, detail="Test Set + Train Set percentages can not be more than 100.")

    df = pd.read_csv(context.train_data)
    train_data_set = df[:int(len(df) * train_parametrs.train_set_percentage)]
    architecture = [len(np.array(train_data_set.drop(columns=['result']).values.tolist()).T)] + train_parametrs.layers + [1]

    context.model = NeuralNetwork(
        architecture=architecture, 
        epochs_count=train_parametrs.epochs, 
        alpha=train_parametrs.alpha)

    asyncio.create_task(asyncio.to_thread(
        context.model.train, train_data_set, trigger_graph_event_send_message, trigger_visulization_send_message, 300
    ))

    return architecture

@app.post('/train-model/abort')
async def abort_training_model(context: Context = Depends(get_context)):
    if(context.model):
        context.model.abort = True
        context.model = None

def trigger_graph_event_send_message(epochNumber, cost):
    asyncio.run_coroutine_threadsafe(
        get_context().epoch_graph_message_queue.put(
            json.dumps({"epochNum": epochNumber, "cost": cost})
        ),
        MAIN_LOOP,
    )

async def graph_event_stream():
    while True:
        message = await get_context().epoch_graph_message_queue.get()  # Wait for an event
        yield f"data: {message}\n\n"  # Send the event to frontend


@app.get("/model/epoch-graph-update-stream")
async def graph_stream():
    return StreamingResponse(graph_event_stream(), media_type="text/event-stream")

def trigger_visulization_send_message(activeLayer, status):
    asyncio.run_coroutine_threadsafe(
        get_context().visualization_message_queue.put(
            json.dumps({"activeLayer": activeLayer, "status": status})
        ),
        MAIN_LOOP,
    )

async def visualization_event_stream():
    while True:
        message = await get_context().visualization_message_queue.get()  # Wait for an event
        yield f"data: {message}\n\n"  # Send the event to frontend


@app.get("/model/visualization-update-stream")
async def graph_stream():
    return StreamingResponse(visualization_event_stream(), media_type="text/event-stream")