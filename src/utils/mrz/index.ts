import { identity } from '../common';
import {
  DATE_VALUE_RANGE,
  DOB_RANGE,
  EXPIRY_DATE_RANGE,
  GENDER_INDEX,
  NATIONALITY_RANGE,
  TYPE_STATE_CODE_RANGE,
  DOC_OPTIONAL_INDEX,
  IDENTIFIER_GROUP_SEPARATOR,
  MACHINE_PLACEHOLDER,
  HUMAN_SEPARATOR,
} from './constants';
import {
  IDocInfo,
  IIdentificationInfo,
  IMRZInfo,
  IPersonalInfo,
} from './interface';

const alphabetHashMap = () => {
  const map: Map<string, number> = new Map();
  let fl = 'A'.charCodeAt(0);
  const ll = 'Z'.charCodeAt(0);

  for (let numValue = 10; fl <= ll; fl++, numValue++) {
    map.set(String.fromCharCode(fl), numValue);
  }

  return map;
}

const extractParts = (mrzLine: string) =>
  mrzLine
    .replace(/<+$/g, MACHINE_PLACEHOLDER)
    .replace(/</g, HUMAN_SEPARATOR)
    .split(HUMAN_SEPARATOR)
    .filter(identity);

const getLines = (mrzRaw: string) => mrzRaw.split('\n');

const getValidateableComposition = (rawMrz: string) => {
  const [upperLine, middleLine] = getLines(rawMrz);
  const upperLineNormalized = upperLine.slice(DOC_OPTIONAL_INDEX);
  const middleLineNormalized = middleLine.replace(/[^0-9<,.]+/g, '')

  // join lines for calculation of composite check digit
  return upperLineNormalized.concat(middleLineNormalized);
}

/**
 * Validates a string with check digit by comparing calculated digit value with what is recorded in the string.
 * @param text A machine readable string with check digit at the end.
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

const validateCompositeCheckDigit = (rawMrz: string) => validateCheckDigit(getValidateableComposition(rawMrz));

const parseUpperLine = (mrzUpperLine: string): IDocInfo => {
  const typeAndStateCodes = mrzUpperLine.substr.apply(mrzUpperLine, TYPE_STATE_CODE_RANGE);
  const parts = extractParts(mrzUpperLine.slice(DOC_OPTIONAL_INDEX));
  const [docNo, oib] = parts;

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
  const [rawPrimary, rawSecondary] = mrzLowerLine.split(IDENTIFIER_GROUP_SEPARATOR);

  let primary = extractParts(rawPrimary).join(HUMAN_SEPARATOR);
  let secondary = extractParts(rawSecondary).join(HUMAN_SEPARATOR);

  return {
    primary,
    secondary
  }
}

const parseMRZ = (mrzStr: string): IMRZInfo => {
  const [upperLine, middleLine, lowerLine] = getLines(mrzStr);

  return {
    doc: parseUpperLine(upperLine),
    personal: parseMiddleLine(middleLine),
    identification: parseLowerLine(lowerLine),
    validated: validateCompositeCheckDigit(mrzStr),
  };
}

export const MRZUtil = {
  parseMRZ
};