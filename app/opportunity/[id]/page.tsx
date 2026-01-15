'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import StakeCalculator from '../../components/StakeCalculator';

// --- Interfaces ---
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

// --- Mock Data Fetching ---
// In a real app, this would fetch from `/api/arbs?id=${id}`
const fetchArbById = async (id: string): Promise<ArbitrageOpportunity | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // This is a mock implementation. A real backend would query its data source.
  const mockOpportunities: ArbitrageOpportunity[] = [
    {
      id: "mock-event-2-arb",
      match: "Chelsea vs Manchester City",
      profit_percentage: 2.41,
      commence_time: "2024-08-18T16:30:00Z",
      legs: [
        { bookmaker: "bookie_x", outcome: "Over 2.5", odds: 2.15 },
        { bookmaker: "bookie_z", outcome: "Under 2.5", odds: 2.05 },
      ],
    },
    // Add other mock arbs here if needed for testing different IDs
  ];

  return mockOpportunities.find(arb => arb.id === id) || null;
};


export default function OpportunityDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [arb, setArb] = useState<ArbitrageOpportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const getArbDetails = async () => {
        try {
          setLoading(true);
          const data = await fetchArbById(id);
          if (!data) {
            throw new Error('Arbitrage opportunity not found.');
          }
          setArb(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      getArbDetails();
    }
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10">Loading opportunity details...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">Error: {error}</p>;
  }

  if (!arb) {
    return <p className="text-center mt-10">No data available for this opportunity.</p>;
  }

  return (
    <div className="bg-arb-dark min-h-screen p-4 md:p-8 text-white">
      <div className="max-w-4xl mx-auto">
        {/* --- Header --- */}
        <div className="mb-6">
          <Link href="/feed" className="text-arb-lime hover:underline">&larr; Back to Feed</Link>
          <h1 className="text-3xl md:text-4xl font-bold text-center mt-2">{arb.match}</h1>
          <p className="text-center text-gray-400 text-lg">
            {new Date(arb.commence_time).toLocaleString()}
          </p>
          <div className="text-center mt-2 text-2xl font-bold text-arb-profit">
            Guaranteed Profit: +{arb.profit_percentage}%
          </div>
        </div>

        {/* --- Main Content: Legs and Calculator --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* --- Execution Legs --- */}
          <div className="bg-arb-green p-6 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Execution Legs</h2>
            <div className="space-y-4">
              {arb.legs.map((leg, index) => (
                <div key={index} className="p-4 bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">{leg.outcome}</span>
                    <span className="text-2xl font-bold text-arb-lime">{leg.odds.toFixed(2)}</span>
                  </div>
                  <div className="text-right text-gray-400 mt-1">
                    on {leg.bookmaker}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- Stake Calculator --- */}
          <StakeCalculator legs={arb.legs} />
        </div>
      </div>
    </div>
  );
}
