import { useState } from 'react';

export default function ServiceForm({ onQuote }) {
  const [instance, setInstance] = useState('');
  const [region, setRegion] = useState('us-east-1');

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('/api/get-pricing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ec2: instance || null, region }),
    });
    onQuote(await res.json());
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>EC2 Instance:</label>
        <input
          value={instance}
          onChange={e => setInstance(e.target.value)}
          placeholder="e.g. t3.medium"
        />
      </div>
      <div>
        <label>Region:</label>
        <select value={region} onChange={e => setRegion(e.target.value)}>
          <option value="us-east-1">US East (N. Virginia)</option>
          <option value="us-west-2">US West (Oregon)</option>
        </select>
      </div>
      <button type="submit">Get Quote</button>
    </form>
  );
}
