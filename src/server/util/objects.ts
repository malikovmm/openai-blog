export function removeAllExceptNames<R>(obj, names: string[]): R {
  const res = {};
  Object.keys(obj).forEach((key) => {
    if (!names.includes(key)) {
      res[key] = obj[key];
    }
  });
  return res as R;
}
