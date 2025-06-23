import React, { useState } from 'react';

export default function App() {
  const [service, setService] = useState('ec2');
  const [region, setRegion] = useState('us-east-1');
  const [instanceType, setInstanceType] = useState('');
  const [engine, setEngine] = useState('MySQL');
  const [priceInfo, setPriceInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchPrice() {
    setError(null);
    setPriceInfo(null);
    setLoading(true);

    try {
      // Build query parameters based on service
      const params = new URLSearchParams({ service, region });
      if (service === 'ec2' || service === 'rds') {
        if (!instanceType) {
          setError('Please enter an instance type.');
          setLoading(false);
          return;
        }
        params.append(service === 'ec2' ? 'instanceType' : 'dbInstanceClass', instanceType);
      }
      if (service === 'rds') {
        params.append('engine', engine);
      }

      const resp = await fetch(`/api/price?${params.toString()}`);
      if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`API error: ${resp.status} ${errorText}`);
      }
      const data = await resp.json();
      if (!data.price) {
        setError('No price data found.');
      } else {
        setPriceInfo(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>AWS Pricing Quote</h1>

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

      <br /><br />

      <label>
        Region:
        <select value={region} onChange={e => setRegion(e.target.value)}>
          <option value="us-east-1">US East (N. Virginia)</option>
          <option value="us-west-2">US West (Oregon)</option>
          <option value="eu-west-1">EU (Ireland)</option>
        </select>
      </label>

      <br /><br />

      {(service === 'ec2' || service === 'rds') && (
        <label>
          {service === 'ec2' ? 'Instance Type:' : 'DB Instance Class:'}
          <input
            type="text"
            value={instanceType}
            onChange={e => setInstanceType(e.target.value)}
            placeholder={service === 'ec2' ? 'e.g. t3.medium' : 'e.g. db.t3.medium'}
            style={{ marginLeft: '10px' }}
          />
        </label>
      )}

      <br /><br />

      {service === 'rds' && (
        <label>
          DB Engine:
          <select value={engine} onChange={e => setEngine(e.target.value)} style={{ marginLeft: '10px' }}>
            <option value="MySQL">MySQL</option>
            <option value="PostgreSQL">PostgreSQL</option>
            <option value="MariaDB">MariaDB</option>
          </select>
        </label>
      )}

      <br /><br />

      <button onClick={fetchPrice} disabled={loading}>
        {loading ? 'Fetching...' : 'Get Price'}
      </button>

      <br /><br />

      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      {priceInfo && (
        <div>
          <strong>Price:</strong> ${priceInfo.price} per {priceInfo.unit}
        </div>
      )}
    </div>
  );
}