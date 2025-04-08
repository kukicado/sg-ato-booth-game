import { useState, useEffect } from "react";
import ReactConfetti from "react-confetti";
import { QRCodeSVG } from "qrcode.react";
import Head from "next/head";

const HowToPlayModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
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
          className="bg-[#FF4F00] text-white px-4 py-2 rounded hover:bg-[#E64500] w-full"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

const HubspotFormModal = ({
  isOpen,
  onSubmit,
}: {
  isOpen: boolean;
  onSubmit: () => void;
}) => {
  useEffect(() => {
    // Load Hubspot form script
    if (isOpen && typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "//js.hsforms.net/forms/embed/v2.js";
      script.charset = "utf-8";
      script.type = "text/javascript";
      document.body.appendChild(script);

      script.onload = () => {
        // Using Window interface extension to avoid 'any' type
        interface CustomWindow extends Window {
          hbspt?: {
            forms: {
              create: (config: object) => void;
            };
          };
        }
        const customWindow = window as CustomWindow;

        if (customWindow.hbspt) {
          customWindow.hbspt.forms.create({
            portalId: "2762526",
            formId: "7454eda1-520b-4a71-838c-528e40ac1cdb",
            region: "na1",
            target: "#hubspot-form-container",
            onFormSubmit: () => {
              // Wait a moment before closing the modal to allow Hubspot to process
              setTimeout(() => {
                onSubmit();
              }, 1000);
            },
            onFormReady: () => {
              // Run code after form is loaded to fix checkbox layout issues
              try {
                // Find all checkbox containers and fix their layout
                const containers = document.querySelectorAll('.legal-consent-container');
                containers.forEach(container => {
                  const checkboxes = container.querySelectorAll('.hs-form-booleancheckbox-display');
                  checkboxes.forEach(checkbox => {
                    // Cast to HTMLElement to access style property
                    (checkbox as HTMLElement).style.display = 'flex';
                    (checkbox as HTMLElement).style.alignItems = 'flex-start';
                  });
                });
              } catch (e) {
                console.error('Error fixing checkbox layout:', e);
              }
            },
            // Styling customizations
            cssClass: "hubspot-custom-form",
            submitButtonClass: "hubspot-submit-button",
            formFieldClass: "hubspot-form-field",
            labelClass: "hubspot-form-label",
            inputClass: "hubspot-form-input",
            errorClass: "hubspot-form-error",
            css: `.hs-form fieldset { max-width: 100% !important; width: 100% !important; }
              .hs-form .hs-input { width: 100% !important; box-sizing: border-box !important; max-width: none !important; transition: none !important; }
              .hs-form .actions { text-align: center; }
              .hs-form .hs-richtext { margin-bottom: 10px; }
              .submitted-message { font-size: 1.1rem; color: #10b981; text-align: center; padding: 1rem; }
              .hs-form input.hs-input:not([type=checkbox]):not([type=radio]) { width: 100% !important; }
              .hs-form select.hs-input { width: 100% !important; }
              .hs-form textarea.hs-input { width: 100% !important; }
              .hs-form .input { margin-right: 0 !important; width: 100% !important; }
              .hs-form .form-columns-1 .input, .hs-form .form-columns-2 .input { margin-right: 0 !important; }
              .hs-form .form-columns-2 .hs-form-field { width: 50% !important; padding-right: 10px !important; }
              /* Aggressive checkbox styling fixes */
              .hs-form .legal-consent-container .hs-form-booleancheckbox-display { display: flex !important; }
              .hs-form .legal-consent-container .hs-form-booleancheckbox-display > input { order: 1 !important; margin-right: 10px !important; margin-top: 5px !important; }
              .hs-form .legal-consent-container .hs-form-booleancheckbox-display > span { order: 2 !important; display: inline !important; }
              .hs-form .hs-fieldtype-booleancheckbox .input { display: flex !important; }
              .hs-form .hs-fieldtype-booleancheckbox span.hs-form-booleancheckbox-display { display: flex !important; align-items: flex-start !important; }
              .hs-form .hs-fieldtype-booleancheckbox span.hs-form-booleancheckbox-display p { margin-top: 0 !important; }
              .hs-form .hs-fieldtype-booleancheckbox label { padding-top: 0 !important; }
              .hs-form .hs-fieldtype-booleancheckbox input { margin: 4px 10px 0 0 !important; width: auto !important; }`,
          });
        }
      };
    }

    return () => {
      // Clean up script when component unmounts
      const formContainer = document.getElementById("hubspot-form-container");
      if (formContainer) {
        formContainer.innerHTML = "";
      }
    };
  }, [isOpen, onSubmit]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white p-6 md:p-8 rounded-lg max-w-md w-full shadow-xl border border-gray-200">
        <h2 className="text-2xl font-bold mb-2 text-[#FF4F00]">
          Sign Up to Play
        </h2>
        <p className="mb-5 text-gray-600">
          Please complete this form to play the game!
        </p>
        <div id="hubspot-form-container" className="w-full"></div>
      </div>
    </div>
  );
};

export default function Home() {
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [guessesLeft, setGuessesLeft] = useState(4);
  const [previousGuesses, setPreviousGuesses] = useState<string[]>(
    Array(4).fill("")
  );
  const [previousFeedback, setPreviousFeedback] = useState<string[][]>(
    Array(4).fill([])
  );
  const [gameWon, setGameWon] = useState(false);
  const [winningCode, setWinningCode] = useState("");
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isHubspotFormOpen, setIsHubspotFormOpen] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const generateWinningCode = () => {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const shuffled = digits.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5).join("");
  };

  useEffect(() => {
    setWinningCode(generateWinningCode());
  }, []);

  const handlePlayAgain = () => {
    window.location.reload();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.length !== 5) {
      setMessage("Please enter a 5-digit code.");
      return;
    }

    const feedback = guess.split("").map((digit, index) => {
      if (digit === winningCode[index]) return "correct";
      if (winningCode.includes(digit)) return "present";
      return "absent";
    });

    const newGuesses = [...previousGuesses];
    newGuesses[4 - guessesLeft] = guess;
    setPreviousGuesses(newGuesses);

    const newFeedback = [...previousFeedback];
    newFeedback[4 - guessesLeft] = feedback;
    setPreviousFeedback(newFeedback);

    setGuessesLeft(guessesLeft - 1);

    if (guess === winningCode) {
      setMessage("Congratulations!");
      setShowConfetti(true);
      setGameWon(true);
    } else if (guessesLeft === 1) {
      setMessage(`The correct code was ${winningCode}.`);
    } else {
      setMessage(`${guessesLeft - 1} guesses left.`);
    }
    setGuess("");
  };

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleKeyPress = (key: string) => {
    if (guess.length < 5) {
      setGuess((prevGuess) => prevGuess + key);
    }
  };

  const handleBackspace = () => {
    setGuess((prevGuess) => prevGuess.slice(0, -1));
  };

  const generateShareText = () => {
    const emojiMap = {
      correct: "🟩",
      present: "🟨",
      absent: "⬜",
    };

    const rows = previousFeedback.slice(0, 4 - guessesLeft);
    const emojiGrid = rows
      .map((row) =>
        row
          .map((feedback) => emojiMap[feedback as keyof typeof emojiMap])
          .join("")
      )
      .join("\n");

    return `Cody AI Code Game\n${
      4 - guessesLeft
    }/4\n\n${emojiGrid}\n\nPlay at https://ato.cody.dev`;
  };

  const handleShare = () => {
    const shareText = generateShareText();
    const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}`;
    window.open(tweetUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
      <Head>
        <title>Cody AI Code Game</title>
      </Head>

      {/* Modal components */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />
      <HubspotFormModal
        isOpen={isHubspotFormOpen && !formSubmitted}
        onSubmit={() => {
          setIsHubspotFormOpen(false);
          setFormSubmitted(true);
        }}
      />

      <div className="absolute inset-0">
        <img
          src="/bg.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="z-10">
        {showConfetti && <ReactConfetti />}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex flex-col items-center mb-10">
            {/* Update the logo image */}
            <img
              src="/pictogram-dark.png"
              alt="Cody Logo"
              className="w-16 h-16 mb-4"
            />
          </div>

          {!formSubmitted && (
            <div className="text-center mb-6">
              <p className="text-lg font-medium">
                Please complete the form to play the game!
              </p>
              <button
                onClick={() => setIsHubspotFormOpen(true)}
                className="mt-6 bg-[#FF4F00] text-white px-8 py-4 rounded-lg hover:bg-[#E64500] font-bold text-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Sign Up to Play
              </button>
            </div>
          )}
          <div className="mb-4">
            {gameWon && <div className="text-center text-4xl mb-4">🎉🏆</div>}
            {gameWon
              ? // Show only the played rows up to the winning guess
                [...Array(4 - guessesLeft)].map((_, index) => (
                  <div key={index} className="flex mb-2 justify-center">
                    {previousGuesses[index]
                      .split("")
                      .map((digit, digitIndex) => (
                        <div
                          key={digitIndex}
                          className={`w-12 h-12 border-2 flex items-center justify-center text-2xl font-bold mr-2 ${
                            previousFeedback[index][digitIndex] === "correct"
                              ? "bg-green-500 text-white"
                              : previousFeedback[index][digitIndex] ===
                                "present"
                              ? "bg-yellow-500 text-white"
                              : previousFeedback[index][digitIndex] === "absent"
                              ? "bg-gray-300"
                              : "bg-white"
                          }`}
                        >
                          {/* Only show digits for the winning row (last row) */}
                          {index === 4 - guessesLeft - 1 ? digit : ""}
                        </div>
                      ))}
                  </div>
                ))
              : [...Array(4)].map((_, index) => (
                  <div key={index} className="flex mb-2">
                    {(index === 4 - guessesLeft
                      ? guess
                      : previousGuesses[index] || ""
                    )
                      .padEnd(5)
                      .split("")
                      .map((digit, digitIndex) => (
                        <div
                          key={digitIndex}
                          className={`w-12 h-12 border-2 flex items-center justify-center text-2xl font-bold mr-2 ${
                            index === 4 - guessesLeft
                              ? "bg-[#FF4F00]/10 border-[#FF4F00]"
                              : previousFeedback[index] &&
                                previousFeedback[index][digitIndex] ===
                                  "correct"
                              ? "bg-green-500 text-white"
                              : previousFeedback[index] &&
                                previousFeedback[index][digitIndex] ===
                                  "present"
                              ? "bg-yellow-500 text-white"
                              : previousFeedback[index] &&
                                previousFeedback[index][digitIndex] === "absent"
                              ? "bg-gray-300"
                              : "bg-white"
                          }`}
                        >
                          {digit !== " " ? digit : ""}
                        </div>
                      ))}
                  </div>
                ))}
          </div>
          {guessesLeft > 0 && !gameWon && formSubmitted && (
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
          {!gameWon && formSubmitted && (
            <button
              onClick={() => setIsHowToPlayOpen(true)}
              className="bg-[#FF4F00] text-white px-4 py-2 rounded hover:bg-[#E64500] mx-auto block"
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

      {/* Update QR code section styling to work better with new background */}
      {(gameWon || guessesLeft === 0) && (
        <div className="mt-12 flex flex-col items-center p-8 bg-white/90 rounded-lg">
          <p className="text-xl font-semibold text-gray-800 mb-8">
            Thanks for playing! Want to learn more?
          </p>
          <div className="flex gap-12">
            <div className="flex flex-col items-center transform hover:scale-105 transition-transform duration-200">
              <p className="text-base font-medium text-gray-700 mb-3 text-white">
                Learn about Sourcegraph Agents
              </p>
              <div className="p-3 bg-white rounded-lg shadow-md">
                <QRCodeSVG
                  value="https://sourcegraph.com/agents"
                  size={120}
                  level="L"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update footer styling for better contrast with new background */}
      <div className="absolute bottom-4 text-center text-sm text-white z-10">
        Made with{" "}
        <a
          href="https://sourcegraph.com/cody"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-200 font-medium"
        >
          Cody AI
        </a>
      </div>
    </div>
  );
}
