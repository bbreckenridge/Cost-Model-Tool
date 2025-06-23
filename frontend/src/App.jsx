import { useState } from 'react';
import ServiceForm from './components/ServiceForm';
import QuoteResults from './components/QuoteResults';

export default function App() {
  const [quote, setQuote] = useState(null);
  return (
    <div className="p-6">
      <h1>AWS Cost Model Tool</h1>
      <ServiceForm onQuote={setQuote} />
      <QuoteResults data={quote} />
    </div>
  );
}
