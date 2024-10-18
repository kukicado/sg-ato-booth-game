import { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';

export default function Home() {
  const [guess, setGuess] = useState('')
  const [message, setMessage] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [guessesLeft, setGuessesLeft] = useState(6)
  const [previousGuesses, setPreviousGuesses] = useState<string[]>(Array(6).fill(''))
  const [previousFeedback, setPreviousFeedback] = useState<string[][]>(Array(6).fill([]));
  const [gameWon, setGameWon] = useState(false) 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (guess.length !== 5) {
      setMessage('Please enter a 5-digit code.')
      return
    }
  
    const response = await fetch('/api/check-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: guess }),
    });
    const data = await response.json();
  
    const newGuesses = [...previousGuesses];
    newGuesses[6 - guessesLeft] = guess;
    setPreviousGuesses(newGuesses);
  
    const newFeedback = [...previousFeedback];
    newFeedback[6 - guessesLeft] = data.feedback;
    setPreviousFeedback(newFeedback);
  
    setGuessesLeft(guessesLeft - 1)
  
    if (data.correct) {
      setMessage('Congratulations!')
      setShowConfetti(true)
      setGameWon(true)
    } else if (guessesLeft === 1) {
      setMessage(`Game over. Try again!`)
    } else {
      setMessage(`${guessesLeft - 1} guesses left.`)
    }
    setGuess('') // Clear the current guess
  }
  
  

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleKeyPress = (key: string) => {
    if (guess.length < 5) {
      setGuess(prevGuess => prevGuess + key)
    }
  }

  const handleBackspace = () => {
    setGuess(prevGuess => prevGuess.slice(0, -1))
  }
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute left-0 top-0 w-1/2 h-full">
        <img src="/left-context-tiles.svg" alt="Left background" className="w-full h-full object-cover" />
      </div>
      <div className="absolute right-0 top-0 w-1/2 h-full">
        <img src="/right-context-tiles.svg" alt="Right background" className="w-full h-full object-cover" />
      </div>
      <div className="z-10">
        {showConfetti && <ReactConfetti />}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <img src='/cody-logo.png' alt="Cody Logo" className="w-24 h-24 mb-10 mx-auto" />
          <div className="mb-4">
          {gameWon && (
            <div className="text-center text-4xl mb-4">
              🎉🏆
            </div>
          )}
          {gameWon ? (
              // Show only the winning guess when the game is won
              <div className="flex mb-2 justify-center">
                {previousGuesses[previousGuesses.findIndex(guess => guess !== '')].split('').map((digit, digitIndex) => (
                  <div
                    key={digitIndex}
                    className="w-12 h-12 border-2 flex items-center justify-center text-2xl font-bold mr-2 bg-green-500 text-white"
                  >
                    {digit}
                  </div>
                ))}
              </div>
            ) : (
              [...Array(6)].map((_, index) => (
              <div key={index} className="flex mb-2">
                {(index === 6 - guessesLeft ? guess : previousGuesses[index] || '').padEnd(5).split('').map((digit, digitIndex) => (
                  <div
                    key={digitIndex}
                    className={`w-12 h-12 border-2 flex items-center justify-center text-2xl font-bold mr-2 ${
                      index === 6 - guessesLeft
                        ? 'bg-purple-100 border-purple-600' // Highlight current guess
                        : previousFeedback[index] && previousFeedback[index][digitIndex] === 'correct'
                        ? 'bg-green-500 text-white'
                        : previousFeedback[index] && previousFeedback[index][digitIndex] === 'present'
                        ? 'bg-yellow-500 text-white'
                        : previousFeedback[index] && previousFeedback[index][digitIndex] === 'absent'
                        ? 'bg-gray-300'
                        : 'bg-white'
                    }`}
                  >
                    {digit !== ' ' ? digit : ''}
                  </div>
                ))}
              </div>
            ))
          )}
          </div>
          {guessesLeft > 0 && !gameWon && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number) => (
              <button
                key={number}
                onClick={() => handleKeyPress(number.toString())}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
              >
                {number}
              </button>
            ))}
            <button
              onClick={handleBackspace}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              ⌫
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Enter
            </button>
          </div>
        )}
          {message && <p className="mt-4 text-xl text-center">{message}</p>}
        </div>
      </div>
    </div>
  )
}

// ... (EmailModal component remains unchanged)



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
