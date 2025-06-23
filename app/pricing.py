from fastapi import FastAPI, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from pricing import ec2_price, lambda_price, rds_price, s3_price, bedrock_price
from pathlib import Path

app = FastAPI()

@app.get("/api/price")
def get_price(
    service: str = Query(..., description="Service name (ec2, lambda, rds, s3, bedrock)"),
    region: str = Query("us-east-1", description="AWS Region"),
    instanceType: str = Query(None, description="Instance type (for ec2, rds)"),
    engine: str = Query("MySQL", description="DB engine (for rds)"),
):
    service = service.lower()
    if service == "ec2":
        if not instanceType:
            raise HTTPException(status_code=400, detail="Missing instanceType parameter for EC2")
        result = ec2_price(instanceType, region)
    elif service == "lambda":
        result = lambda_price(region)
    elif service == "rds":
        if not instanceType:
            raise HTTPException(status_code=400, detail="Missing instanceType parameter for RDS")
        result = rds_price(instanceType, region, engine)
    elif service == "s3":
        result = s3_price(region)
    elif service == "bedrock":
        result = bedrock_price(region)
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported service: {service}")

    if not result:
        raise HTTPException(status_code=404, detail="Pricing info not found")

    price, unit = result
    return {"price": price, "unit": unit}

frontend_dist = Path(__file__).parent / "frontend_dist"
app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")
