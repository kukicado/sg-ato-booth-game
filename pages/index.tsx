import { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';

export default function Home() {
  const [guess, setGuess] = useState('')
  const [message, setMessage] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [guessesLeft, setGuessesLeft] = useState(4)
  const [previousGuesses, setPreviousGuesses] = useState<string[]>(Array(4).fill(''))
  const [previousFeedback, setPreviousFeedback] = useState<string[][]>(Array(4).fill([]));
  const [gameWon, setGameWon] = useState(false) 
  const [winningCode, setWinningCode] = useState('')

  const generateWinningCode = () => {
    return Array(5).fill(0).map(() => Math.floor(Math.random() * 10)).join('')
  }

  useEffect(() => {
    setWinningCode(generateWinningCode())
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(winningCode);
    if (guess.length !== 5) {
      setMessage('Please enter a 5-digit code.')
      return
    }
  
    const feedback = guess.split('').map((digit, index) => {
      if (digit === winningCode[index]) return 'correct'
      if (winningCode.includes(digit)) return 'present'
      return 'absent'
    })
  
    const newGuesses = [...previousGuesses]
    newGuesses[4 - guessesLeft] = guess
    setPreviousGuesses(newGuesses)
  
    const newFeedback = [...previousFeedback]
    newFeedback[4 - guessesLeft] = feedback
    setPreviousFeedback(newFeedback)
  
    setGuessesLeft(guessesLeft - 1)
  
    if (guess === winningCode) {
      setMessage('Congratulations!')
      setShowConfetti(true)
      setGameWon(true)
    } else if (guessesLeft === 1) {
      setMessage(`Game over. The correct code was ${winningCode}. Try again!`)
    } else {
      setMessage(`${guessesLeft - 1} guesses left.`)
    }
    setGuess('')
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
    {winningCode.split('').map((digit, digitIndex) => (
      <div
        key={digitIndex}
        className="w-12 h-12 border-2 flex items-center justify-center text-2xl font-bold mr-2 bg-green-500 text-white"
      >
        {digit}
      </div>
    ))}
  </div>
            ) : (
              [...Array(4)].map((_, index) => (
              <div key={index} className="flex mb-2">
                {(index === 4 - guessesLeft ? guess : previousGuesses[index] || '').padEnd(5).split('').map((digit, digitIndex) => (
                  <div
                    key={digitIndex}
                    className={`w-12 h-12 border-2 flex items-center justify-center text-2xl font-bold mr-2 ${
                      index === 4 - guessesLeft
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