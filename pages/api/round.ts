import { NextApiRequest, NextApiResponse } from 'next';

const ROUNDS = [
  { word: 'CODER', roundNumber: 1 },
  { word: 'BUILD', roundNumber: 2 },
  { word: 'AGENT', roundNumber: 3 },
  { word: 'VERMILLION', roundNumber: 4, isBonus: true }
];

// In-memory storage for current round
let currentRound = 1;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Check if there's a round parameter to update the current round
    const roundParam = req.query.round;
    if (roundParam) {
      const newRound = parseInt(roundParam as string);
      if (newRound >= 1 && newRound <= ROUNDS.length) {
        currentRound = newRound;
      }
    }

    const roundData = ROUNDS.find(r => r.roundNumber === currentRound);
    return res.status(200).json(roundData);
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 