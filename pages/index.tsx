import { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import { QRCodeSVG } from 'qrcode.react';

const HowToPlayModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md">
        <h2 className="text-2xl font-bold mb-4">How to Play</h2>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Guess the 5-digit code in 4 tries or less</li>
          <li>After each guess, you&apos;ll get feedback:</li>
          <li className="ml-4">🟩 Green: Correct digit in correct position</li>
          <li className="ml-4">🟨 Yellow: Correct digit in wrong position</li>
          <li className="ml-4">⬜ Gray: Digit not in the code</li>
          <li>Each digit is used only once</li>
        </ul>
        <button
          onClick={onClose}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const [guess, setGuess] = useState('')
  const [message, setMessage] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [guessesLeft, setGuessesLeft] = useState(4)
  const [previousGuesses, setPreviousGuesses] = useState<string[]>(Array(4).fill(''))
  const [previousFeedback, setPreviousFeedback] = useState<string[][]>(Array(4).fill([]));
  const [gameWon, setGameWon] = useState(false) 
  const [winningCode, setWinningCode] = useState('')
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  const generateWinningCode = () => {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const shuffled = digits.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 5).join('')
  }

  useEffect(() => {
    setWinningCode(generateWinningCode())
  }, [])

  const handlePlayAgain = () => {
    window.location.reload();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
      setMessage(`The correct code was ${winningCode}.`)
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

  const generateShareText = () => {
    const emojiMap = {
      'correct': '🟩',
      'present': '🟨',
      'absent': '⬜'
    };
    
    const rows = previousFeedback.slice(0, 4 - guessesLeft);
    const emojiGrid = rows.map(row => 
      row.map(feedback => emojiMap[feedback as keyof typeof emojiMap]).join('')
    ).join('\n');
    
    return `Cody AI Code Game\n${4 - guessesLeft}/4\n\n${emojiGrid}\n\nPlay at https://ato.cody.dev`;
  }
  
  const handleShare = () => {
    const shareText = generateShareText();
    const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(tweetUrl, '_blank');
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Add Modal component */}
      <HowToPlayModal isOpen={isHowToPlayOpen} onClose={() => setIsHowToPlayOpen(false)} />
      <div className="absolute left-0 top-0 w-1/2 h-full">
        <img src="/left-context-tiles.svg" alt="Left background" className="w-full h-full object-cover" />
      </div>
      <div className="absolute right-0 top-0 w-1/2 h-full">
        <img src="/right-context-tiles.svg" alt="Right background" className="w-full h-full object-cover" />
      </div>
      <div className="z-10">
        {showConfetti && <ReactConfetti />}
        <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex flex-col items-center mb-10">
          <img src='/cody-logo.png' alt="Cody Logo" className="w-24 h-24 mb-4" />
          </div>
          <div className="mb-4">
          {gameWon && (
            <div className="text-center text-4xl mb-4">
              🎉🏆
            </div>
          )}
          {gameWon ? (
              // Show only the played rows up to the winning guess
  [...Array(4 - guessesLeft)].map((_, index) => (
    <div key={index} className="flex mb-2 justify-center">
      {previousGuesses[index].split('').map((digit, digitIndex) => (
        <div
          key={digitIndex}
          className={`w-12 h-12 border-2 flex items-center justify-center text-2xl font-bold mr-2 ${
            previousFeedback[index][digitIndex] === 'correct'
              ? 'bg-green-500 text-white'
              : previousFeedback[index][digitIndex] === 'present'
              ? 'bg-yellow-500 text-white'
              : previousFeedback[index][digitIndex] === 'absent'
              ? 'bg-gray-300'
              : 'bg-white'
          }`}
        >
          {/* Only show digits for the winning row (last row) */}
          {index === (4 - guessesLeft - 1) ? digit : ''}
        </div>
      ))}
    </div>
  ))
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
          {!gameWon && (
          <button
              onClick={() => setIsHowToPlayOpen(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mx-auto block"
            >
              How to Play
            </button>
          )}
          {message && <p className="mt-4 text-xl text-center">{message}</p>}
          {/* Add the Play Again button */}
          {(gameWon || guessesLeft === 0) && (
  <div className="flex gap-2">
    <button
      onClick={handlePlayAgain}
      className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex-1"
    >
      Play Again
    </button>
    {gameWon && (
      <button
        onClick={handleShare}
        className="mt-4 bg-black hover:bg-[#1a8cd8] text-white font-bold py-2 px-4 rounded flex-1"
      >
        Share on X
      </button>
    )}
  </div>
)}

        </div>
      </div>

      {/* Add QR code at the bottom */}
      {gameWon && (<div className="mt-8 flex flex-col items-center">
            <p className="text-black mb-6">Get 1 Month of Cody Pro for free!</p>
            <QRCodeSVG 
              value="https://sourcegraph.com/cody?ref=devstarterpack"
              size={120}
              level="L"
            />
          </div>
        )}
      <div className="absolute bottom-4 text-center text-sm text-gray-600 z-10">
        Made with <a href="https://sourcegraph.com/cody" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 font-medium">Cody AI</a>
      </div>
    </div>
  )
}