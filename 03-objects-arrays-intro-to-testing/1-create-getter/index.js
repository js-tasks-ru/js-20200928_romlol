/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  return (obj) => {
    const properties = path.split('.');
    let result = Object.assign({}, obj);
    for (const property of properties) {
      result = result[property];
      if (result === undefined) {
        return result;
      }
    }
    return result;
  };
}
