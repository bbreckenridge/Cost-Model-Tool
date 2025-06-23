import boto3, json

pr = boto3.client('pricing', region_name='us-east-1')
LOC = {
    'us-east-1': 'US East (N. Virginia)',
    'us-west-2': 'US West (Oregon)',
    'eu-west-1': 'EU (Ireland)'
}

def get_price(service_code, filters):
    resp = pr.get_products(ServiceCode=service_code, Filters=filters, MaxResults=1)
    if not resp['PriceList']: return None
    prod = json.loads(resp['PriceList'][0])
    od = next(iter(prod['terms']['OnDemand'].values()))
    pd = next(iter(od['priceDimensions'].values()))
    return float(pd['pricePerUnit']['USD']), pd['unit']

def ec2_price(instance, region):
    return get_price('AmazonEC2', [
        {'Type':'TERM_MATCH','Field':'instanceType','Value':instance},
        {'Type':'TERM_MATCH','Field':'location','Value':LOC[region]},
        {'Type':'TERM_MATCH','Field':'operatingSystem','Value':'Linux'},
        {'Type':'TERM_MATCH','Field':'preInstalledSw','Value':'NA'},
        {'Type':'TERM_MATCH','Field':'tenancy','Value':'Shared'},
        {'Type':'TERM_MATCH','Field':'capacitystatus','Value':'Used'}
    ])
