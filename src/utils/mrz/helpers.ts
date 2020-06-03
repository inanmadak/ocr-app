import { identity } from 'utils/common';

import {
  DIGIT_PLACEHOLDER_ONLY_RGX,
  DOCNO_STARTING_INDEX,
  HUMAN_SEPARATOR,
  MACHINE_PLACEHOLDER_RGX,
  EMPTY,
} from './constants';

export const alphabetHashMap = () => {
  const map: Map<string, number> = new Map();
  let fl = 'A'.charCodeAt(0);
  const ll = 'Z'.charCodeAt(0);

  for (let numValue = 10; fl <= ll; fl++, numValue++) {
    map.set(String.fromCharCode(fl), numValue);
  }

  return map;
}

export const extractParts = (mrzLine: string) =>
  mrzLine
    .replace(MACHINE_PLACEHOLDER_RGX, HUMAN_SEPARATOR)
    .split(HUMAN_SEPARATOR)
    .filter(identity);

export const getLines = (rawMrz: string) => rawMrz.split('\n');

export const getValidateableComposition = (rawMrz: string) => {
  const [upperLine, middleLine] = getLines(rawMrz);
  const upperLineNormalized = upperLine.slice(DOCNO_STARTING_INDEX);
  const middleLineNormalized = middleLine.replace(DIGIT_PLACEHOLDER_ONLY_RGX, EMPTY);

  // join lines for calculation of composite check digit
  return upperLineNormalized.concat(middleLineNormalized);
}