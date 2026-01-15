'use client';

import { useState } from 'react';

interface ArbLeg {
  bookmaker: string;
  outcome: string;
  odds: number;
}

interface StakeCalculatorProps {
  legs: ArbLeg[];
}

export default function StakeCalculator({ legs }: StakeCalculatorProps) {
  const [totalStake, setTotalStake] = useState(1000);

  if (legs.length !== 2) {
    return <p className="text-red-500">Stake calculator only supports 2-leg arbitrage.</p>;
  }

  const [legA, legB] = legs;
  const invA = 1 / legA.odds;
  const invB = 1 / legB.odds;
  const sumInv = invA + invB;

  const stakeA = (totalStake * invA) / sumInv;
  const stakeB = totalStake - stakeA;
  const guaranteedReturn = stakeA * legA.odds;
  const profit = guaranteedReturn - totalStake;
  const profitPercentage = (profit / totalStake) * 100;

  const copyToClipboard = () => {
    const text = `Total Stake: $${totalStake.toFixed(2)}\n\nBet 1 (${legA.outcome} @ ${legA.odds} on ${legA.bookmaker}): $${stakeA.toFixed(2)}\nBet 2 (${legB.outcome} @ ${legB.odds} on ${legB.bookmaker}): $${stakeB.toFixed(2)}\n\nGuaranteed Return: $${guaranteedReturn.toFixed(2)}\nProfit: $${profit.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    alert('Stakes copied to clipboard!');
  };

  return (
    <div className="bg-arb-green p-6 rounded-xl border border-gray-700">
      <h3 className="text-2xl font-bold text-arb-lime mb-4 text-center">Quick Stake Calculator</h3>

      <div className="mb-4">
        <label htmlFor="total-stake" className="block text-sm font-medium text-gray-300 mb-1">Total Stake ($)</label>
        <input
          id="total-stake"
          type="number"
          value={totalStake}
          onChange={(e) => setTotalStake(Number(e.target.value))}
          className="w-full bg-gray-800 text-white placeholder-gray-500 p-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-arb-lime"
        />
      </div>

      <div className="space-y-3 text-lg">
        <div className="flex justify-between p-2 bg-gray-800 rounded-md">
          <span className="font-semibold">{legA.outcome} ({legA.bookmaker}):</span>
          <span className="font-bold text-white">${stakeA.toFixed(2)}</span>
        </div>
        <div className="flex justify-between p-2 bg-gray-800 rounded-md">
          <span className="font-semibold">{legB.outcome} ({legB.bookmaker}):</span>
          <span className="font-bold text-white">${stakeB.toFixed(2)}</span>
        </div>
        <hr className="border-gray-700" />
        <div className="flex justify-between font-bold">
          <span>Guaranteed Return:</span>
          <span>${guaranteedReturn.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-arb-profit">
          <span>Profit:</span>
          <span>+${profit.toFixed(2)} ({profitPercentage.toFixed(2)}%)</span>
        </div>
      </div>

      <button
        onClick={copyToClipboard}
        className="mt-6 w-full bg-arb-lime text-arb-dark font-bold py-3 rounded-full text-lg transition-transform hover:scale-105"
      >
        Copy Stakes
      </button>

      {/* --- TON Integration Placeholder --- */}
      <button
        onClick={() => alert('TON Connect integration pending. This will trigger a smart contract transaction.')}
        disabled
        className="mt-4 w-full bg-gray-600 text-white font-bold py-3 rounded-full text-lg cursor-not-allowed"
      >
        Place Bets via TON
      </button>
    </div>
  );
}
