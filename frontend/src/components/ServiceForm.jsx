import React, { useState } from "react";

const SERVICES = [
  { value: "ec2", label: "EC2" },
  { value: "lambda", label: "Lambda" },
  { value: "rds", label: "RDS" },
  { value: "s3", label: "S3" },
  { value: "bedrock", label: "Bedrock" },
];

export default function ServiceForm() {
  const [service, setService] = useState("ec2");
  const [params, setParams] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleParamChange(key, value) {
    setParams((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Build query string from params
      const query = new URLSearchParams({ service, ...params }).toString();
      const res = await fetch(`/api/price?${query}`);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error fetching price");
      }

      const data = await res.json();
      setResult(data.price ? `${service.toUpperCase()}: $${data.price} / ${data.unit || "unit"}` : "No price found");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function renderInputs() {
    switch (service) {
      case "ec2":
        return (
          <>
            <label>
              Instance Type:
              <input
                type="text"
                value={params.instanceType || ""}
                onChange={(e) => handleParamChange("instanceType", e.target.value)}
                placeholder="e.g. t3.medium"
                required
              />
            </label>
            <label>
              Region:
              <input
                type="text"
                value={params.region || ""}
                onChange={(e) => handleParamChange("region", e.target.value)}
                placeholder="e.g. us-east-1"
                required
              />
            </label>
          </>
        );
      case "lambda":
      case "s3":
      case "bedrock":
        return (
          <label>
            Region:
            <input
              type="text"
              value={params.region || ""}
              onChange={(e) => handleParamChange("region", e.target.value)}
              placeholder="e.g. us-east-1"
              required
            />
          </label>
        );
      case "rds":
        return (
          <>
            <label>
              Instance Class:
              <input
                type="text"
                value={params.instanceClass || ""}
                onChange={(e) => handleParamChange("instanceClass", e.target.value)}
                placeholder="e.g. db.t3.medium"
                required
              />
            </label>
            <label>
              Engine:
              <input
                type="text"
                value={params.engine || ""}
                onChange={(e) => handleParamChange("engine", e.target.value)}
                placeholder="e.g. MySQL"
                required
              />
            </label>
            <label>
              Region:
              <input
                type="text"
                value={params.region || ""}
                onChange={(e) => handleParamChange("region", e.target.value)}
                placeholder="e.g. us-east-1"
                required
              />
            </label>
          </>
        );
      default:
        return null;
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Service:
        <select value={service} onChange={(e) => { setService(e.target.value); setParams({}); setResult(null); setError(null); }}>
          {SERVICES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      {renderInputs()}

      <button type="submit" disabled={loading}>
        {loading ? "Loading..." : "Get Price"}
      </button>

      {result && <div style={{ marginTop: "1em", color: "green" }}>{result}</div>}
      {error && <div style={{ marginTop: "1em", color: "red" }}>Error: {error}</div>}
    </form>
  );
}
