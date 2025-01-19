from pydantic import BaseModel, Field
from typing import List
from datetime import date, time

class Item(BaseModel):
    shortDescription: str = Field(..., pattern=r"^[\w\s\-]+$")
    price: str = Field(..., pattern=r"^\d+\.\d{2}$")

class Receipt(BaseModel):
    retailer: str = Field(..., pattern=r"^[\w\s\-&]+$")
    purchaseDate: date
    purchaseTime: time
    items: List[Item]
    total: str = Field(..., pattern=r"^\d+\.\d{2}$")

class ReceiptResponse(BaseModel):
    id: str

class PointsResponse(BaseModel):
    points: int
