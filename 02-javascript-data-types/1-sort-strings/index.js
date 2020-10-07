/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const sortTypes = ['asc', 'desc'];
  const resultArr = [...arr];
  if (!sortTypes.includes(param)) {
    return resultArr;
  }
  const collator = new Intl.Collator('ru-RU', {caseFirst: 'upper'});
  resultArr.sort((a, b) => {
    if (param === 'asc') {
      return collator.compare(a, b);
    } else {
      return collator.compare(b, a);
    }
  });
  return resultArr;
}
