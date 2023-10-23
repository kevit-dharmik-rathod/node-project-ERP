export const utilityError = (code: number, error: Error | string): Error => {
  return new Error(JSON.stringify({code, error}));
};
