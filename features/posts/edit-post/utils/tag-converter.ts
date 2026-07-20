export const stringToArray = (value: string): string[] => {
  return value.split(",").map((v) => v.trim());
};

export const arrayToString = (value: string[]): string => {
  return value.join(", ");
};

export const finalTagsValue = (value: string): string[] => {
  const arrayList = stringToArray(value).filter(
    (s, _i, arr) => arr.indexOf(s) === arr.lastIndexOf(s),
  );
  const result = arrayList.filter((v) => !!v);
  return result;
};
