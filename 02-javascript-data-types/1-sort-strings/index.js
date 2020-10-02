/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const resultArr = Array.from(arr);
    if (param === 'asc') {
        return resultArr.sort(compareString);
    } else {
        return resultArr.sort(compareString).reverse();
    }
}

export function compareString(a, b) {
    for (let i = 0; i < a.length; i++) {
        const compChar = compareChar(a[i], b[i]);
        if (compChar !== 0) {
            return compChar;
        }
    }
    return 0;
}
export function compareChar(a, b) {
  //Заглавную выше прописной
  if (a.toLowerCase() === b && a.charCodeAt(0) !== b.charCodeAt(0)) {
    return -1;
  }
  // далее сравниваем тока прописные
  const codeA = a.toLowerCase().charCodeAt(0);
  const codeB = b.toLowerCase().charCodeAt(0);
  //обработка ё
  if (codeA === 1105) {
    if (1078 <= codeB && codeB <= 1103) {
      return -1;
    } else {
      return 1;
    }
  }
  // Поднимаем русские буквы вверх по приоритету сортировки
  // а = символы до русских букв
  // && b = 'а-я' или 'ё'
  if (codeA <= 1025 && (1072 <= codeB && codeB <= 1103 || codeB === 1105)) {
    return 1;
  }
  if (codeA < codeB) {
    return -1;
  }
  if (codeA > codeB) {
    return 1;
  }
  return 0;
}
