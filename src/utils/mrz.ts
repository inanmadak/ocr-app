import { identity } from './common';

interface IValidateableField {
  value: string;
  validated: boolean;
}

interface IDocInfo {
  typeAndStateCodes: string;
  docNo: string;
  oib?: string;
}

interface IPersonalInfo {
  dob: IValidateableField;
  gender: string;
  expirationDate: IValidateableField;
  nationality: string;
  optional?: string;
}

interface IIdentificationInfo {
  primary: string;
  secondary: string;
}

export interface IMRZInfo {
  doc: IDocInfo;
  personal: IPersonalInfo;
  identification: IIdentificationInfo;
  validated: boolean;
}

type Range = [number, (number | undefined)];

const alphabetHashMap = () => {
  const map: Map<string, number> = new Map();
  let fl = 'A'.charCodeAt(0);
  const ll = 'Z'.charCodeAt(0);

  for (let numValue = 10; fl <= ll; fl++, numValue++) {
    map.set(String.fromCharCode(fl), numValue);
  }

  return map;
}

const extractParts = (text: string) =>
  text
    .replace(/<+$/g, '<')
    .replace(/</g, ' ')
    .split(' ')
    .filter(identity);

const getLines = (mrzRaw: string) => mrzRaw.split('\n');

const getValidateableComposition = (rawMrz: string) => {
  const [upperLine, middleLine] = getLines(rawMrz);
  const upperLineNormalized = upperLine.slice(5);
  const middleLineNormalized = middleLine.replace(/[^0-9<,.]+/g, '')

  console.log(upperLineNormalized);
  console.log(middleLineNormalized);

  // join lines for calculation of composite check digit
  return upperLineNormalized.concat(middleLineNormalized);
}

// Range constants
const TYPE_STATE_CODE_RANGE: Range = [0, 5];
const DOB_RANGE: Range = [0, 7];
const DATE_VALUE_RANGE: Range = [0, 6];
const EXPIRY_DATE_RANGE: Range = [8, 7];
const NATIONALITY_RANGE: Range = [15, 3];

// Index constants
const GENDER_INDEX = 7;

/**
 * Validates a string with check digit by comparing calculated digit value with what is recorded in the string.
 * @param text A string with check digit at the end.
 */
const validateCheckDigit = (text: string) => {
  const charMap = alphabetHashMap();
  const weighters = [7, 3, 1];
  const multiplications: number[] = [];
  const checkDigit = text.slice(-1);
  let weighterIndex = 0;

  text = text.slice(0, text.length - 1);

  [...text].forEach((char) => {
    const integer = parseInt(char);

    if (isNaN(integer)) {
      multiplications.push(
        charMap.has(char) ? (charMap.get(char) as number) * weighters[weighterIndex] : 0
      );
    } else {
      multiplications.push(integer * weighters[weighterIndex]);
    }

    weighterIndex = weighterIndex === 2 ? 0 : weighterIndex + 1;
  });

  const total = multiplications.reduce((prev, current) => prev + current);

  const calculatedCheckDIgit = total % 10;

  return String(calculatedCheckDIgit) === checkDigit;
}

const validateCompositeCheckDigit = (rawMrz: string) => {
  const validated = validateCheckDigit(getValidateableComposition(rawMrz));
  console.log(validated);

  return validated;
}

const parseUpperLine = (mrzUpperLine: string): IDocInfo => {
  const parts = extractParts(mrzUpperLine);
  const [docInfo, oib] = parts;
  const typeAndStateCodes = docInfo.substr.apply(docInfo, TYPE_STATE_CODE_RANGE);
  const docNo = docInfo.substr(5);

  return {
    typeAndStateCodes,
    docNo,
    oib
  };
}

const parseMiddleLine = (mrzMiddleLine: string): IPersonalInfo => {
  const parts = extractParts(mrzMiddleLine);
  let demographics, optional;

  if (parts.length > 2) {
    [demographics, optional] = parts;
  } else {
    [demographics] = parts;
  }

  const dob = demographics.substr.apply(demographics, DOB_RANGE);
  const gender = demographics[GENDER_INDEX];
  const expirationDate = demographics.substr.apply(demographics, EXPIRY_DATE_RANGE);
  const nationality = demographics.substr.apply(demographics, NATIONALITY_RANGE);

  const dobValidation = validateCheckDigit(dob);
  const expirationDateValidation = validateCheckDigit(expirationDate);

  return {
    dob: {
      value: dob.substr.apply(dob, DATE_VALUE_RANGE),
      validated: dobValidation,
    },
    gender,
    expirationDate: {
      value: expirationDate.substr.apply(expirationDate, DATE_VALUE_RANGE),
      validated: expirationDateValidation
    },
    nationality,
    optional
  };

}

const parseLowerLine = (mrzLowerLine: string): IIdentificationInfo => {
  const identification = extractParts(mrzLowerLine);

  return {
    primary: identification[0],
    secondary: identification.slice(1).join(' '),
  }
}

export const parseMRZ = (mrzStr: string): IMRZInfo => {
  const [upperLine, middleLine, lowerLine] = getLines(mrzStr);

  validateCompositeCheckDigit(mrzStr);

  return {
    doc: parseUpperLine(upperLine),
    personal: parseMiddleLine(middleLine),
    identification: parseLowerLine(lowerLine),
    validated: validateCompositeCheckDigit(mrzStr),
  };
}