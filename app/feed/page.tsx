'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ArbLeg {
  bookmaker: string;
  outcome: string;
  odds: number;
}

interface ArbitrageOpportunity {
  id: string;
  match: string;
  profit_percentage: number;
  commence_time: string;
  legs: ArbLeg[];
}

export default function ArbFeedPage() {
  const [arbs, setArbs] = useState<ArbitrageOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minProfit, setMinProfit] = useState(2);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchArbs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/arbs');
      if (!response.ok) {
        throw new Error('Failed to fetch arbitrage opportunities.');
      }
      const data = await response.json();
      setArbs(data);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArbs(); // Initial fetch
    const interval = setInterval(fetchArbs, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const filteredArbs = arbs.filter(arb => arb.profit_percentage >= minProfit);

  return (
    <div className="bg-arb-dark min-h-screen p-4 text-white">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center text-arb-lime mb-2">Live Arbitrage Feed</h1>
        <p className="text-center text-gray-400">
          {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
        </p>
      </header>

      {/* --- Filters and Search --- */}
      <div className="mb-6 p-4 bg-arb-green rounded-xl">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search teams or leagues..."
            className="flex-grow bg-gray-800 text-white placeholder-gray-500 p-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-arb-lime"
            disabled
          />
          <div className="flex items-center gap-2">
            <label htmlFor="min-profit" className="font-semibold">Min Profit:</label>
            <input
              id="min-profit"
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={minProfit}
              onChange={(e) => setMinProfit(Number(e.target.value))}
              className="w-32"
            />
            <span className="text-arb-lime font-bold">{minProfit.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* --- Arb List --- */}
      {loading && arbs.length === 0 && <p className="text-center">Scanning for opportunities...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      <div className="space-y-4">
        {filteredArbs.length > 0 ? (
          filteredArbs.map(arb => (
            <Link href={`/opportunity/${arb.id}`} key={arb.id}>
              <div className="block bg-arb-green rounded-xl p-4 transition-transform hover:scale-105 cursor-pointer border border-transparent hover:border-arb-lime">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-bold">{arb.match}</h2>
                  <span className="text-xl font-bold text-arb-profit">
                    +{arb.profit_percentage}%
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  {new Date(arb.commence_time).toLocaleString()}
                </p>
                <div className="text-right mt-2">
                  <button className="bg-arb-lime text-arb-dark font-bold py-1 px-4 rounded-full text-sm">
                    Calculate
                  </button>
                </div>
              </div>
            </Link>
          ))
        ) : (
          !loading && <p className="text-center text-gray-500">No arbitrage opportunities found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}
