import type { NextApiRequest, NextApiResponse } from 'next'

type Feedback = 'correct' | 'present' | 'absent';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { code } = req.body;
    const winningCode = process.env.WINNING_CODE || '12345'; // Provide a default code if not set

    if (code.length !== winningCode.length) {
      return res.status(400).json({ error: 'Invalid code length' });
    }

    const feedback: Feedback[] = new Array(code.length).fill('absent');
    const winningCodeArray = winningCode.split('');
    const codeArray = code.split('');

    // First pass: check for correct digits
    for (let i = 0; i < codeArray.length; i++) {
      if (codeArray[i] === winningCodeArray[i]) {
        feedback[i] = 'correct';
        winningCodeArray[i] = '';
        codeArray[i] = '';
      }
    }

    // Second pass: check for present digits
    for (let i = 0; i < codeArray.length; i++) {
      if (codeArray[i] !== '') {
        const index = winningCodeArray.indexOf(codeArray[i]);
        if (index !== -1) {
          feedback[i] = 'present';
          winningCodeArray[index] = '';
        }
      }
    }

    const correct = feedback.every(f => f === 'correct');

    res.status(200).json({ correct, feedback });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}