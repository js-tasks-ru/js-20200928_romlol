/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  switch (size) {
    case 0:
      return '';
    case undefined:
      return string;
    default: {
      let repeatCount = 0;
      let prevSymbol;
      let result = '';
      for (let i = 0; i < string.length; i++) {
        if (string[i] === prevSymbol) {
          repeatCount++;
        } else {
          repeatCount = 0;
        }
        if (repeatCount < size) {
          result += string[i];
        }
        prevSymbol = string[i];
      }
      return result;
    }
  }
}
