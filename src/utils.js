export const findSmallestWordLength = (words) => {
  if (words.length === 0) {
    return 0; // Return 0 for an empty list of words
  }

  const smallestLength = words.reduce((minLength, currentWord) => {
    const currentLength = currentWord.length;
    return currentLength < minLength ? currentLength : minLength;
  }, words[0].length);

  return smallestLength;
};

export const findLargestWordLength = (words) => {
  if (words.length === 0) {
    return 0; // Return 0 for an empty list of words
  }

  const largestLength = words.reduce((maxLength, currentWord) => {
    const currentLength = currentWord.length;
    return currentLength > maxLength ? currentLength : maxLength;
  }, words[0].length);

  return largestLength;
};

export const getGameNumber = () => {
  // Get the user's time zone
  let userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Get the current date and time in the user's time zone
  let currentDate = new Date();
  let userTimeZoneOffset = currentDate.toLocaleString("en", {
    timeZone: userTimeZone,
  });
  let userCurrentDateTime = new Date(userTimeZoneOffset);

  // Calculate the game number
  return Math.floor(
    (userCurrentDateTime.getTime() - new Date("2024-01-19").getTime()) /
      (1000 * 60 * 60 * 24)
  );
};

export const createInitialGrid = (words, lettersPerRow = 6) => {
  const flattenedString = words.join("");
  const totalLetters = flattenedString.length;
  const missingChars =
    (lettersPerRow - (totalLetters % lettersPerRow)) % lettersPerRow;
  const stars = "*".repeat(missingChars);

  const modifiedString = flattenedString + stars;

  const shuffledLetters = modifiedString
    .split("")
    .sort(() => Math.random() - 0.5);

  const numRows = Math.ceil(modifiedString.length / lettersPerRow);
  const grid = [];

  for (let i = 0; i < numRows; i++) {
    const row = [];
    for (let j = 0; j < lettersPerRow; j++) {
      const index = i * lettersPerRow + j;
      const letter = shuffledLetters[index];
      row.push({ id: index, value: letter });
    }
    grid.push(row);
  }

  return grid;
};

export const removeExcessStars = (grid, lettersPerRow = 6) => {
  const stars = grid.flat().filter((entry) => entry.value === "*");
  let starsToAllow = stars.length % lettersPerRow;

  const updatedGrid = [];
  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    for (let j = 0; j < row.length; j++) {
      const kv = row[j];
      if (kv["value"] === "*" && starsToAllow > 0) {
        starsToAllow -= 1;
        updatedGrid.push(kv);
      } else if (kv["value"] !== "*") {
        updatedGrid.push(kv);
      }
    }
  }
  const numRows = Math.ceil(updatedGrid.length / lettersPerRow);
  const reshapedArray = Array.from({ length: numRows }, (_, rowIndex) =>
    updatedGrid.slice(rowIndex * lettersPerRow, (rowIndex + 1) * lettersPerRow)
  );
  return reshapedArray;
};

export const shuffleGrid = (grid, lettersPerRow = 6) => {
  const flatGrid = grid.flat();
  const shuffledFlatGrid = flatGrid.sort(() => Math.random() - 0.5);
  const shuffledGrid = [];
  for (let i = 0; i < shuffledFlatGrid.length; i += lettersPerRow) {
    const row = shuffledFlatGrid.slice(i, i + lettersPerRow);
    shuffledGrid.push(row);
  }
  return shuffledGrid;
};

// User history utils

// Function to get today's date in the format 'YYYY-MM-DD'
const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Function to save user history for today to localStorage
export const saveUserHistoryForToday = (key, value) => {
  const today = getFormattedDate();
  const historyString = localStorage.getItem("userHistory");
  const userHistory = historyString ? JSON.parse(historyString) : {};

  if (!userHistory[today]) {
    userHistory[today] = {};
  }

  userHistory[today][key] = value;
  localStorage.setItem("userHistory", JSON.stringify(userHistory));
};

// Function to retrieve user history for today from localStorage
export const getUserHistoryForToday = () => {
  const today = getFormattedDate();
  const historyString = localStorage.getItem("userHistory");
  const userHistory = historyString ? JSON.parse(historyString) : {};
  return userHistory[today] || {};
};
