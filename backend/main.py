from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import json
import asyncio
import numpy as np
import pandas as pd

from NeuralNetwork import NeuralNetwork
from request_models import TrainParameters

class Context:
    def __init__(self):
        self.train_data = None
        self.model = None
        self.epoch_graph_message_queue = asyncio.Queue()
        self.visualization_message_queue = asyncio.Queue()

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

context = Context()

MAIN_LOOP = asyncio.get_event_loop()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/upload-train-data")
async def create_upload_file(file: UploadFile):
    file_location = f"train_data.csv"
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())

    context.train_data = file_location

    return {"filename": file.filename}  

@app.post("/train-model")
async def train_model(train_parametrs: TrainParameters):
    if(context.train_data == None):
        raise HTTPException(status_code=400, detail="No training data uploaded")
    if(train_parametrs.train_set_percentage > 100 or train_parametrs.train_set_percentage < 0):
        raise HTTPException(status_code=400, detail=f"Train Set percentage can not contain such value: {train_parametrs.train_set_percentage}")
    if(train_parametrs.test_set_percentage > 100 or train_parametrs.test_set_percentage < 0):
        raise HTTPException(status_code=400, detail=f"Test Set percentage can not contain such value: {train_parametrs.train_set_percentage}")
    
    if(train_parametrs.test_set_percentage + train_parametrs.test_set_percentage > 100):
        raise HTTPException(status_code=400, detail="Test Set + Train Set percentages can not be more than 100.")


    df = pd.read_csv(context.train_data)
    train_data_set = df[:int(len(df) * train_parametrs.train_set_percentage)]
    architecture = [len(np.array(train_data_set.drop(columns=['result']).values.tolist()).T)] + train_parametrs.layers + [1]
    context.model = NeuralNetwork(architecture=architecture, epochs_count=train_parametrs.epochs, alpha=train_parametrs.alpha)
    asyncio.create_task(asyncio.to_thread(context.model.train, train_data_set, trigger_graph_event_send_message, trigger_visulization_send_message, 900))
    return architecture

@app.post('/train-model/abort')
async def abort_training_model():
    return "aborted"

def trigger_graph_event_send_message(epochNumber, cost):
    asyncio.run_coroutine_threadsafe(
        context.epoch_graph_message_queue.put(
            json.dumps({"epochNum": epochNumber, "cost": cost})
        ),
        MAIN_LOOP,
    )

async def graph_event_stream():
    while True:
        message = await context.epoch_graph_message_queue.get()  # Wait for an event
        print('sent message')
        yield f"data: {message}\n\n"  # Send the event to frontend


@app.get("/model/epoch-graph-update-stream")
async def graph_stream():
    return StreamingResponse(graph_event_stream(), media_type="text/event-stream")



def trigger_visulization_send_message(activeLayer, status):
    asyncio.run_coroutine_threadsafe(
        context.visualization_message_queue.put(
            json.dumps({"activeLayer": activeLayer, "status": status})
        ),
        MAIN_LOOP,
    )

async def visualization_event_stream():
    while True:
        message = await context.visualization_message_queue.get()  # Wait for an event
        print('sent message')
        yield f"data: {message}\n\n"  # Send the event to frontend


@app.get("/model/visualization-update-stream")
async def graph_stream():
    return StreamingResponse(visualization_event_stream(), media_type="text/event-stream")