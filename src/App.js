import React, { useState, useRef, useEffect } from "react";
import { AppButton, HintButton } from "./Components";
import "./App.css";
import { SOLUTIONS } from "./solutions";
import {
  findSmallestWordLength,
  findLargestWordLength,
  saveUserHistoryForToday,
  getUserHistoryForToday,
  getGameNumber,
  createInitialGrid,
  shuffleGrid,
} from "./utils";

function App() {
  const gameNumber = getGameNumber();
  let solution;
  if (SOLUTIONS.hasOwnProperty(gameNumber)) {
    solution = SOLUTIONS[gameNumber];
  } else {
    let valuesArray = Object.values(SOLUTIONS);
    solution = valuesArray[Math.floor(Math.random() * valuesArray.length)];
  }
  const words = solution["answer"];
  const hint = solution["hint"];
  const smallestLength = findSmallestWordLength(words);
  const largestLength = findLargestWordLength(words);

  // State variables
  const copyTextRef = useRef(null);
  const [guessEnabled, setGuessEnabled] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [textCopied, setTextCopied] = useState(false);
  const [selectedLetters, setSelectedLetters] = useState([]);

  const history = getUserHistoryForToday();
  const [grid, setGrid] = useState(
    history?.["grid"] || createInitialGrid(words)
  );
  const [guessedWords, setGuessedWords] = useState(
    history?.["guessedWords"] ||
      words.map((word) => Array(word.length).fill(""))
  );
  const [wordBank, setWordBank] = useState(history?.["wordBank"] || []);
  const [attempts, setAttempts] = useState(history?.["attempts"] || []);
  const [finishedGame, setFinishedGame] = useState(
    history?.["finishedGame"] || false
  );
  const [hardMode, setHardMode] = useState(history?.["hardMode"] || true);

  const handleGuess = () => {
    makeGuess();
  };

  const handleShuffle = () => {
    const newGrid = shuffleGrid([...grid]);
    setGrid(newGrid);
    saveUserHistoryForToday("grid", newGrid);
  };

  const handleCopyToClipboard = () => {
    if (copyTextRef.current) {
      const hiddenTextArea = document.createElement("textarea");
      const yaas = "😎";
      const nooo = "👿";
      const strikes = attempts
        .map((attempt) => (attempt ? yaas : nooo))
        .join("");
      hiddenTextArea.value = `Worddicted #${gameNumber}${hardMode ? `*` : ""}\n${strikes}\n\nhttps://worddicted.github.io/`;
      document.body.appendChild(hiddenTextArea);
      hiddenTextArea.select();
      document.execCommand("copy");
      document.body.removeChild(hiddenTextArea);
      setTextCopied(true);
    }
  };

  const revealWord = (guess) => {
    const wordIndex = words.findIndex((word) => word.startsWith(guess));
    const updatedGuessedWords = [...guessedWords];
    updatedGuessedWords[wordIndex] = words[wordIndex].split("");
    setGuessedWords(updatedGuessedWords);
    saveUserHistoryForToday("guessedWords", updatedGuessedWords);

    const updatedGrid = grid.map((row) =>
      row.map((entry) => {
        if (selectedLetters.includes(entry["id"])) {
          return { id: entry["id"], value: "*" };
        } else {
          return entry;
        }
      })
    );

    setGrid(updatedGrid);
    setSelectedLetters([]);
    saveUserHistoryForToday("grid", updatedGrid);

    if (
      updatedGuessedWords.every((word) => word.every((letter) => letter !== ""))
    ) {
      setFinishedGame(true);
      saveUserHistoryForToday("finishedGame", true);
    }
  };

  const revealLetters = (guess) => {
    let guessedLetters = guess;
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const guessStatus = guessedWords[i];
      for (let j = 0; j < word.length; j++) {
        if (guessStatus[j] === "" && guessedLetters.includes(word[j])) {
          const indexToRemove = guessedLetters.indexOf(word[j]);
          guessedLetters =
            guessedLetters.slice(0, indexToRemove) +
            guessedLetters.slice(indexToRemove + 1);
          guessedWords[i][j] = word[j];
        }
      }
    }
    setGuessedWords(guessedWords);
    setSelectedLetters([]);
    saveUserHistoryForToday("guessedWords", guessedWords);
  };

  const makeGuess = () => {
    const input = userInput.toLowerCase();
    if (words.includes(input)) {
      // case where the user made a correct guess
      setAttempts([...attempts, true]);
      saveUserHistoryForToday("attempts", [...attempts, true]);
      // update guessed words
      revealWord(input);
    } else {
      // case where the user made an incorrect guess
      setAttempts([...attempts, false]);
      saveUserHistoryForToday("attempts", [...attempts, false]);
      setWordBank([...wordBank, input]);
      saveUserHistoryForToday("wordBank", [...wordBank, input]);
      revealLetters(input);
    }
    setUserInput("");
  };

  const onLetterClick = (letter) => {
    setSelectedLetters([...selectedLetters, letter["id"]]);
    const newGuess = userInput + letter["value"];
    setUserInput(newGuess);
    if (newGuess.length >= smallestLength && newGuess.length <= largestLength) {
      setGuessEnabled(true);
    } else {
      setGuessEnabled(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1
          style={{
            marginBottom: "0px",
          }}
        >
          Worddicted
        </h1>
        {!finishedGame ? (
          <>
            {/* Hints */}
            <HintButton hint={hint} setHardMode={setHardMode} />
            {/* Guesses */}
            <h3 style={{ marginBottom: "0px" }}>
              Guesses{" "}
              <span style={{ fontSize: "24px" }}>
                {attempts.map((attempt) => (attempt ? "✅" : "❌"))}
              </span>
            </h3>
            <div>
              <span style={{ fontSize: "18px" }}>
                <b>Incorrect guesses:</b> {wordBank.join(", ")}{" "}
                {wordBank.length === 0 && "None so far, you're a star!⭐"}
              </span>
            </div>
            <div>
              {guessedWords.map((word, wordIndex) => {
                const guesses = word.map((letter, letterIndex) => {
                  return (
                    <span key={`${wordIndex}_${letterIndex}`}>
                      {letter.length > 0 ? `${letter} ` : "_ "}
                    </span>
                  );
                });
                return (
                  <>
                    {guesses}
                    <br />
                  </>
                );
              })}
            </div>
            <div>Guess: {userInput}</div>
            {/* Grid */}
            <div style={{ marginTop: "16px" }}>
              {grid.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: "flex" }}>
                  {row.map((entry) => (
                    <div
                      key={entry["id"]}
                      style={{
                        backgroundColor: "beige",
                        width: `50px`,
                        height: `50px`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "Futura, sans-serif",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        margin: "4px",
                        cursor: entry["value"] === "*" ? "click" : "pointer",
                        color:
                          entry["value"] === "*"
                            ? "beige"
                            : selectedLetters.includes(entry["id"])
                              ? "grey"
                              : "black",
                      }}
                      onClick={() =>
                        entry["value"] !== "*" && onLetterClick(entry)
                      }
                    >
                      {entry["value"]}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ display: "flex" }}>
              <AppButton onClick={handleShuffle} text="Shuffle" />{" "}
              <AppButton
                onClick={handleGuess}
                disabled={!guessEnabled}
                text="Guess"
              />
            </div>
          </>
        ) : (
          // Finished board
          <>
            <h3 style={{ marginBottom: "0px" }}>
              Nice job finishing the game!
            </h3>
            <p style={{ marginBottom: "0px" }}>
              Worddicted #{gameNumber}
              {hardMode && "*"}{" "}
              <span style={{ fontSize: "24px" }}>
                {attempts.map((attempt) => (attempt ? "😎" : "👿"))}
              </span>
            </p>
            <p style={{ fontSize: "18px" }}>
              {textCopied &&
                "Result copied to keyboard, now paste and share with friends!"}
            </p>
            <AppButton
              onClick={handleCopyToClipboard}
              text="Share with Friends"
            />
            <div style={{ display: "none" }}>
              <textarea ref={copyTextRef} readOnly />
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
