from fastapi import FastAPI, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from pricing import ec2_price, lambda_price, rds_price, bedrock_price, s3_price

app = FastAPI()

# Mount frontend static files
frontend_dist = Path(__file__).parent / "frontend_dist"
app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")

@app.get("/api/price")
def get_price(
    service: str = Query(..., description="Service name like ec2, lambda, rds, bedrock, s3"),
    region: str = Query('us-east-1', description="AWS region"),
    instance: str = Query(None, description="Instance type, required for EC2")
):
    service = service.lower()

    if service == 'ec2':
        if not instance:
            raise HTTPException(status_code=400, detail="Missing 'instance' query parameter for EC2 pricing")
        price = ec2_price(instance, region)

    elif service == 'lambda':
        price = lambda_price(region)
    elif service == 'rds':
        price = rds_price(region)
    elif service == 'bedrock':
        price = bedrock_price(region)
    elif service == 's3':
        price = s3_price(region)
    else:
        raise HTTPException(status_code=404, detail=f"Unsupported service '{service}'")

    if not price:
        raise HTTPException(status_code=404, detail="Pricing not found")

    return {"service": service, "price_per_unit": price[0], "unit": price[1]}
