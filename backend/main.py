from typing import Annotated
from pydantic import BaseModel
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from NeuralNetwork import NeuralNetwork
from request_models import TrainParameters

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

train_data = None

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/upload-train-data")
async def create_upload_file(file: UploadFile):
    train_data = file
    return {"filename": train_data.filename}

@app.post("/train-model")
async def train_model(train_parametrs: TrainParameters):
    print(train_parametrs)

@app.post('/train-model/abort')
async def abort_training_model():
    print('aborted')