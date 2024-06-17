import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JSONData = { [key: string]: any };

export function snakeToCamel(json: JSONData) {
  Object.keys(json).forEach((key) => {
    const camelKeyArray = key.split("_");
    for (let i = 1; i < camelKeyArray.length; i++) {
      camelKeyArray[i] =
        camelKeyArray[i][0].toUpperCase() + camelKeyArray[i].substring(1);
    }

    const camelKey = camelKeyArray.join("");

    if (camelKey != key) {
      json[camelKey as keyof typeof json] = json[key];
      delete json[key];
    }

    if (json[camelKey] instanceof Object) {
      json[camelKey] = snakeToCamel(json[camelKey]);
    }
  });

  return json;
}

export function dateToDateString(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function dateToUTC(date: Date) {
  const utcDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
  );
  return utcDate;
}

export function utcToLocal(date: Date) {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    0,
    0,
    0,
    0
  );
}

export function dateToTimestamp(date: Date) {
  return Math.floor(date.valueOf() / 1000);
}

export function timestampToDate(timestamp: number) {
  return new Date(timestamp * 1000);
}

export function timestampToDateString(timestamp: number) {
  const date = timestampToDate(timestamp);
  return dateToDateString(date);
}
