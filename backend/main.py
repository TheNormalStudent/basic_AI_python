from typing import Annotated
from pydantic import BaseModel
from fastapi import FastAPI, File, UploadFile

from NeuralNetwork import NeuralNetwork

app = FastAPI()

class TrainParameters(BaseModel):
    alpha: float
    layers: list[int]
    epochs: int
    train_set_percentage: int
    test_set_percentage: int
    validate_set_percentage: int | None

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
    train_data = NeuralNetwork(train_parametrs.layers)