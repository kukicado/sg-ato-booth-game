import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { code } = req.body;
    const winningCode = process.env.WINNING_CODE;

    if (code === winningCode) {
      res.status(200).json({ correct: true });
    } else {
      res.status(200).json({ correct: false });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
