export function pipe(value, ...fns) {
  return fns.reduce((currentValue, fn) => fn(currentValue), value);
}

