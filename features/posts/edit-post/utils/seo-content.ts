import { seoDescLimit, seoTitleLimit } from "../constant";

const nameFormatter = (name: string): string => {
  if (name.length <= 10) {
    return name;
  }

  const nameArr = name.split(" ");

  if (nameArr.length === 1) {
    return name;
  }

  return `${nameArr[0]} ${nameArr[1][0]}`;
};

const contentFormatter = (text: string, limit: number) => {
  if (text.length <= limit) {
    return text;
  }
  return `${text.slice(0, limit - 3)}...`;
};

export const seoTitleBuilder = (title: string, name?: string): string => {
  let tail = ` | Inkspace`;
  if (name) {
    tail = ` | ${nameFormatter(name)} | Inkspace`;
  }
  const limit = seoDescLimit.bad - tail.length;
  return `${contentFormatter(title, limit)}${tail}`;
};

export const seoDescriptionBuilder = (desc: string): string => {
  return contentFormatter(desc, seoDescLimit.bad);
};
