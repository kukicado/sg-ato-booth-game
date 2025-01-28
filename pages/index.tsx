import { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';

const HowToPlayModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1B1B1B] p-6 rounded-lg max-w-md text-white">
        <h2 className="text-2xl font-bold mb-4">How to Play</h2>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Guess the 5-letter word in 4 tries or less</li>
          <li>After each guess, you&apos;ll get feedback:</li>
          <li className="ml-4">🟩 Green: Correct letter in correct position</li>
          <li className="ml-4">🟨 Yellow: Correct letter in wrong position</li>
          <li className="ml-4">⬜ Gray: Letter not in the word</li>
        </ul>
        <button
          onClick={onClose}
          className="bg-[#FF5543] text-white px-4 py-2 rounded hover:bg-[#E54434] w-full"
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
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [isBonus, setIsBonus] = useState(false);
  const [wordLength, setWordLength] = useState(5);

  const fetchCurrentRound = async () => {
    try {
      const response = await fetch('/api/round');
      const data = await response.json();
      setCurrentRound(data.roundNumber);
      setWinningCode(data.word);
      setIsBonus(data.isBonus || false);
      setWordLength(data.word.length);
    } catch (error) {
      console.error('Error fetching round:', error);
    }
  };

  useEffect(() => {
    fetchCurrentRound();
    // Poll for round updates every 30 seconds
    //const interval = setInterval(fetchCurrentRound, 10000);
    //return () => clearInterval(interval);
  }, []);

  const handlePlayAgain = () => {
    window.location.reload();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const upperGuess = guess.toUpperCase();
    
    if (guess.length !== wordLength) {
      setMessage(`Please enter a ${wordLength}-letter word.`)
      return
    }

    const feedback = upperGuess.split('').map((letter, index) => {
      if (letter === winningCode[index]) return 'correct'
      if (winningCode.includes(letter)) return 'present'
      return 'absent'
    })

    const newGuesses = [...previousGuesses]
    newGuesses[4 - guessesLeft] = upperGuess
    setPreviousGuesses(newGuesses)

    const newFeedback = [...previousFeedback]
    newFeedback[4 - guessesLeft] = feedback
    setPreviousFeedback(newFeedback)

    setGuessesLeft(guessesLeft - 1)

    if (upperGuess === winningCode) {
      setMessage('Congratulations!')
      setShowConfetti(true)
      setGameWon(true)
    } else if (guessesLeft === 1) {
      setMessage(`The word was ${winningCode}.`)
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
    if (guess.length < wordLength) {
      setGuess(prevGuess => prevGuess + key.toUpperCase())
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
    
    return `I won the Cody AI game in \n${4 - guessesLeft}/4\n\n${emojiGrid}\n\nYou can win too by learning about our Vision for Agents at  https://sourcegraph.com/agents`;
  }
  
  const handleShare = () => {
    const shareText = generateShareText();
    const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(tweetUrl, '_blank');
  }

  // Replace the number pad with a keyboard
  const keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  return (
    <div className="min-h-screen bg-[#151515] text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Add Modal component */}
      <HowToPlayModal isOpen={isHowToPlayOpen} onClose={() => setIsHowToPlayOpen(false)} />
      
      {/* Replace the two background divs with this single background div */}
      <div className="absolute inset-0 z-0">
        <img src="/bg.png" alt="Background" className="w-full h-full object-cover" />
      </div>

      <div className="z-10">
        {showConfetti && <ReactConfetti />}
        <div className="bg-[#1B1B1B] p-8 rounded-lg shadow-lg">
          <div className="flex flex-col items-center mb-10">
            <img src='/pictogram-dark.png' alt="Sourcegraph Logo" className="w-24 h-24 mb-4" />
            <div className="text-xl font-bold text-[#FF5543] mb-4">
              {isBonus ? 'Bonus Round!' : `Round ${currentRound} of 3`}
            </div>
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
          className={`w-10 h-12 border-2 flex items-center justify-center text-xl font-bold mr-1 ${
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
                <div key={index} className="flex mb-2 justify-center">
                  {(index === 4 - guessesLeft ? guess : previousGuesses[index] || '').padEnd(wordLength).split('').map((digit, digitIndex) => (
                    <div
                      key={digitIndex}
                      className={`w-10 h-12 border-2 flex items-center justify-center text-xl font-bold mr-1 ${
                        index === 4 - guessesLeft
                          ? 'bg-[#2A2A2A] border-[#FF5543]' // Highlight current guess with vermillion border
                          : previousFeedback[index] && previousFeedback[index][digitIndex] === 'correct'
                          ? 'bg-green-500 text-white'
                          : previousFeedback[index] && previousFeedback[index][digitIndex] === 'present'
                          ? 'bg-yellow-500 text-white'
                          : previousFeedback[index] && previousFeedback[index][digitIndex] === 'absent'
                          ? 'bg-gray-300'
                          : 'bg-[#2A2A2A]'
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
            <div className="mb-4">
              {keyboard.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-1 mb-1">
                  {row.map((letter) => (
                    <button
                      key={letter}
                      onClick={() => handleKeyPress(letter)}
                      className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white font-bold py-2 px-3 rounded min-w-[2rem]"
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              ))}
              <div className="flex justify-center gap-2 mt-2">
                <button
                  onClick={handleBackspace}
                  className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white font-bold py-2 px-4 rounded"
                >
                  ⌫
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-[#FF5543] hover:bg-[#E54434] text-white font-bold py-2 px-4 rounded"
                >
                  Enter
                </button>
              </div>
            </div>
          )}
          {!gameWon && (
          <button
              onClick={() => setIsHowToPlayOpen(true)}
              className="bg-[#FF5543] text-white px-4 py-2 rounded hover:bg-[#E54434] mx-auto block"
            >
              How to Play
            </button>
          )}
          {message && <p className="mt-4 text-xl text-center text-white">{message}</p>}
          {/* Add the Play Again button */}
          {(gameWon || guessesLeft === 0) && (
  <div className="flex gap-2">
    <button
      onClick={handlePlayAgain}
      className="mt-4 bg-[#FF5543] hover:bg-[#E54434] text-white font-bold py-2 px-4 rounded flex-1"
    >
      Play Again
    </button>
    {gameWon && (
      <button
        onClick={handleShare}
        className="mt-4 bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white font-bold py-2 px-4 rounded flex-1"
      >
        Share on X
      </button>
    )}
  </div>
)}

        </div>
      </div>
   <div className="absolute bottom-4 text-center text-sm text-gray-400 z-10">
        Made with <a href="https://sourcegraph.com/cody" target="_blank" rel="noopener noreferrer" className="text-[#FF5543] hover:text-[#E54434] font-medium underline">Cody AI</a>
      </div>
    </div>
  )
}