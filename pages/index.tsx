import { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import PrizeList from '../components/PrizeList';

export default function Home() {
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [showModal, setShowModal] = useState(true)
  const [email, setEmail] = useState('')
  const [showPrizes, setShowPrizes] = useState(false)

  console.log(email);

  const prizes = [
    { id: 1, name: "Prize 1", description: "Description of Prize 1" },
    { id: 2, name: "Prize 2", description: "Description of Prize 2" },
    { id: 3, name: "Prize 3", description: "Description of Prize 3" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/check-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    const data = await response.json();
    
    if (data.correct) {
      setMessage('Congratulations! You won a prize!')
      setShowConfetti(true)
      setShowPrizes(true)
    } else {
      setMessage('Access denied. Try again!')
    }
    setCode('')
  }

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleEmailSubmit = (submittedEmail: string) => {
    setEmail(submittedEmail)
    setShowModal(false)
  }

  const handleNumberClick = (number: string) => {
    if (code.length < 4) {
      setCode(prevCode => prevCode + number)
    }
  }

  const handleClear = () => {
    setCode('')
  }

  const handleSelectPrize = (prizeId: number) => {
    // Handle prize selection logic here
    console.log(`Selected prize with id: ${prizeId}`);
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center">
      {showConfetti && <ReactConfetti />}
      {showModal ? (
        <EmailModal onSubmit={handleEmailSubmit} />
      ) : (
        <div className="bg-gray-700 p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-8 text-center">Cody's Vault</h1>
          <div className="mb-4 h-12 bg-gray-900 rounded flex items-center justify-center">
            <span className="text-2xl">{code.padEnd(4, '*')}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <button
                key={number}
                onClick={() => handleNumberClick(number.toString())}
                className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-4 px-6 rounded"
              >
                {number}
              </button>
            ))}
            <button
              onClick={handleClear}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              onClick={() => handleNumberClick('0')}
              className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-4 px-6 rounded"
            >
              0
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
          {message && <p className="mt-4 text-xl">{message}</p>}
          {showPrizes && <PrizeList prizes={prizes} onSelectPrize={handleSelectPrize} />}
        </div>
      )}
    </div>
  )
}
const EmailModal = ({ onSubmit }: { onSubmit: (email: string) => void }) => {
  const [inputEmail, setInputEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputEmail.includes('@') && inputEmail.includes('.')) {
      onSubmit(inputEmail)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-700 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Enter your email to play</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            className="w-full p-2 mb-4 text-black rounded"
            placeholder="your@email.com"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Start Game
          </button>
        </form>
      </div>
    </div>
  )
}
