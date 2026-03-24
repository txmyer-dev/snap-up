import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StatusBanner from './components/StatusBanner';
import DashboardGrid from './components/DashboardGrid';
import demoPayload from '../../data/demo-fixtures/demo-payload.json';

const isDemo = new URLSearchParams(window.location.search).get('demo') === 'true';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    if (isDemo) {
      setData(demoPayload);
      setLastUpdated(new Date());
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('https://n8n.felaniam.cloud/webhook/catch-me-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date());
    } catch (e) {
      console.error('Fetch failed:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    if (!isDemo) {
      const interval = setInterval(fetchData, 300000);
      return () => clearInterval(interval);
    }
  }, [fetchData]);

  return (
    <main className="relative min-h-screen">
      <Header lastUpdated={lastUpdated} onRefresh={fetchData} loading={loading} />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 pt-24">
        {isDemo && (
          <div className="mb-4 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono text-center">
            Demo Mode — showing curated fixture data
          </div>
        )}
        <StatusBanner data={data} />
        <DashboardGrid data={data} loading={loading} />
      </div>
    </main>
  );
}
