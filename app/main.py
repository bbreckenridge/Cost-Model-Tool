from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from pricing import ec2_price
import os

app = FastAPI()

class QuoteRequest(BaseModel):
    ec2: str = None
    region: str = 'us-east-1'

@app.post("/api/get-pricing")
def get_pricing(q: QuoteRequest):
    data = {}
    if q.ec2:
        pr = ec2_price(q.ec2, q.region)
        data['EC2'] = f"\/{pr[1]}" if pr else None
    return data

frontend_dist = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist')
app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")
