export function removeKeys<R>(obj, keys: string[]): R {
  const res = {};
  Object.keys(obj).forEach((key) => {
    if (!keys.includes(key)) {
      res[key] = obj[key];
    }
  });
  return res as R;
}
