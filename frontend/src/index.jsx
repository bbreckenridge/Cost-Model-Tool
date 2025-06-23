import React, { useState } from 'react';
import { fetchPrice } from './api';

export default function PricingForm() {
  const [service, setService] = useState('ec2');
  const [region, setRegion] = useState('us-east-1');
  const [instanceType, setInstanceType] = useState('');
  const [engine, setEngine] = useState('MySQL');
  const [priceInfo, setPriceInfo] = useState(null);
  const [error, setError] = useState(null);

  async function handleGetPrice() {
    setError(null);
    setPriceInfo(null);
    try {
      const data = await fetchPrice({ service, instanceType, region, engine });
      setPriceInfo(data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>Get AWS Pricing</h2>
      <label>
        Service:
        <select value={service} onChange={e => setService(e.target.value)}>
          <option value="ec2">EC2</option>
          <option value="lambda">Lambda</option>
          <option value="rds">RDS</option>
          <option value="s3">S3</option>
          <option value="bedrock">Bedrock</option>
        </select>
      </label>

      <br />

      <label>
        Region:
        <select value={region} onChange={e => setRegion(e.target.value)}>
          <option value="us-east-1">US East (N. Virginia)</option>
          <option value="us-west-2">US West (Oregon)</option>
          <option value="eu-west-1">EU (Ireland)</option>
          {/* add more if needed */}
        </select>
      </label>

      <br />

      {(service === 'ec2' || service === 'rds') && (
        <>
          <label>
            {service === 'ec2' ? 'Instance Type:' : 'DB Instance Class:'}
            <input
              type="text"
              value={instanceType}
              onChange={e => setInstanceType(e.target.value)}
              placeholder={service === 'ec2' ? 'e.g. t3.medium' : 'e.g. db.t3.medium'}
            />
          </label>
          <br />
        </>
      )}

      {service === 'rds' && (
        <>
          <label>
            DB Engine:
            <select value={engine} onChange={e => setEngine(e.target.value)}>
              <option value="MySQL">MySQL</option>
              <option value="PostgreSQL">PostgreSQL</option>
              <option value="MariaDB">MariaDB</option>
              {/* Add more if you want */}
            </select>
          </label>
          <br />
        </>
      )}

      <button onClick={handleGetPrice}>Get Price</button>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {priceInfo && (
        <p>
          Price: ${priceInfo.price} per {priceInfo.unit}
        </p>
      )}
    </div>
  );
}
