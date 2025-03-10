from pydantic import BaseModel, Field
from typing import List, Annotated

class TrainParameters(BaseModel):
    alpha: Annotated[float, Field(gt=0)]
    layers: list[Annotated[int, Field(gt=1)]]
    epochs: Annotated[int, Field(gt=0)]
    train_set_percentage: Annotated[float, Field(ge=0, le=100)]
    test_set_percentage: Annotated[float, Field(ge=0, le=100)]
    validate_set_percentage: Annotated[float, Field(ge=0, le=100)] | None = None
