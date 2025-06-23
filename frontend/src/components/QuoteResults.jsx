export default function QuoteResults({ data }) {
  if (!data) return null;
  return (
    <div>
      <h2>Pricing Quote:</h2>
      <ul>
        {Object.entries(data).map(([svc, price]) =>
          <li key={svc}>{svc}: {price || 'N/A'}</li>
        )}
      </ul>
    </div>
  );
}
