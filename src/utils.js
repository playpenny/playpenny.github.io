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

// Function to get today's date in the format 'YYYY-MM-DD'
function getFormattedDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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
