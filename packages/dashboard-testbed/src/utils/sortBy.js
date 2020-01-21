// @flow

const isNumber = (x: mixed) /*: boolean %checks*/ => typeof x === 'number';
const isString = (x: mixed) /*: boolean %checks*/ => typeof x === 'string';

function sortBy<T>(arr: T[], fn: T => number | string): T[] {
  const sortPriorities = new Map(arr.map(x => [x, fn(x)]));
  return arr.slice().sort((a, b) => {
    const prioA = sortPriorities.get(a) || '';
    const prioB = sortPriorities.get(b) || '';
    if (isNumber(prioA) && isNumber(prioB)) {
      if (prioA < prioB) return -1;
      if (prioA > prioB) return +1;
    }
    if (isString(prioA) && isString(prioB)) {
      if (prioA < prioB) return -1;
      if (prioA > prioB) return +1;
    }
    return 0;
  });
}

export default sortBy;
