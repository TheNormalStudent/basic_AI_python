from pydantic import BaseModel
from typing import List

class TrainParameters(BaseModel):
    alpha: float
    layers: List[int]
    epochs: int
    train_set_percentage: int
    test_set_percentage: int
    validate_set_percentage: int | None = None