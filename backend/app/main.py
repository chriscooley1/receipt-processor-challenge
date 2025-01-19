from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import Receipt, ReceiptResponse, PointsResponse
import uuid
from datetime import datetime
import math
import re

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
receipts = {}

def calculate_points(receipt: Receipt) -> int:
    points = 0
    
    # Rule 1: One point for every alphanumeric character in the retailer name
    points += sum(1 for c in receipt.retailer if c.isalnum())
    
    # Rule 2: 50 points if the total is a round dollar amount
    total_float = float(receipt.total)
    if total_float.is_integer():
        points += 50
    
    # Rule 3: 25 points if the total is a multiple of 0.25
    if total_float % 0.25 == 0:
        points += 25
    
    # Rule 4: 5 points for every two items
    points += (len(receipt.items) // 2) * 5
    
    # Rule 5: Points for items with descriptions that are multiples of 3
    for item in receipt.items:
        desc_length = len(item.shortDescription.strip())
        if desc_length % 3 == 0:
            points += math.ceil(float(item.price) * 0.2)
    
    # Rule 6: 5 points if total is greater than 10.00 (LLM generated)
    if total_float > 10.00:
        points += 5
    
    # Rule 7: 6 points if the day in the purchase date is odd
    if receipt.purchaseDate.day % 2 == 1:
        points += 6
    
    # Rule 8: 10 points if time is between 2:00pm and 4:00pm
    purchase_hour = receipt.purchaseTime.hour
    purchase_minute = receipt.purchaseTime.minute
    if (14 <= purchase_hour < 16) or (purchase_hour == 16 and purchase_minute == 0):
        points += 10
    
    return points

@app.post("/receipts/process", response_model=ReceiptResponse)
async def process_receipt(receipt: Receipt):
    receipt_id = str(uuid.uuid4())
    receipts[receipt_id] = receipt
    return ReceiptResponse(id=receipt_id)

@app.get("/receipts/{id}/points", response_model=PointsResponse)
async def get_points(id: str):
    if id not in receipts:
        raise HTTPException(status_code=404, description="No receipt found for that ID.")
    
    points = calculate_points(receipts[id])
    return PointsResponse(points=points)
