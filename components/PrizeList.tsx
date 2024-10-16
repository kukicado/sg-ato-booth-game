import React from 'react';

interface Prize {
  id: number;
  name: string;
  description: string;
}

interface PrizeListProps {
  prizes: Prize[];
  onSelectPrize: (prizeId: number) => void;
}

const PrizeList: React.FC<PrizeListProps> = ({ prizes, onSelectPrize }) => {
  return (
    <div className="prize-list">
      <h2 className="text-2xl font-bold mb-4">Choose Your Prize</h2>
      <ul className="space-y-4">
        {prizes.map((prize) => (
          <li key={prize.id} className="bg-background text-foreground p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{prize.name}</h3>
            <p className="mt-2">{prize.description}</p>
            <button
              onClick={() => onSelectPrize(prize.id)}
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Select Prize
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PrizeList;
