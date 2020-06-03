import {
  DOB_RANGE,
  DOCNO_STARTING_INDEX,
  EXPIRY_DATE_RANGE,
  GENDER_INDEX,
  HUMAN_SEPARATOR,
  IDENTIFIER_GROUP_SEPARATOR,
  MACHINE_PLACEHOLDER_RGX,
  NATIONALITY_RANGE,
  STATE_CODE_RANGE,
  TYPE_RANGE,
  TYPE_STATE_CODE_RANGE,
  CD_WEIGHTERS,
  DOCNO_MAX_LENGTH,
  DATE_VALUE_RANGE,
  EMPTY,
} from './constants';
import {
  alphabetHashMap,
  extractParts,
  getLines,
  getValidateableComposition,
} from './helpers';
import {
  IDocInfo,
  IIdentificationInfo,
  IMRZInfo,
  IPersonalInfo,
} from './interface';

/**
 * Validates a string with check digit by comparing calculated digit value with what is recorded in the string.
 * @param text A machine readable string with check digit at the end.
 */
const validateCheckDigit = (text: string) => {
  const charMap = alphabetHashMap();
  const multiplications: number[] = [];
  const checkDigit = text.slice(-1);
  let weighterIndex = 0;

  text = text.slice(0, text.length - 1);

  [...text].forEach((char) => {
    const integer = parseInt(char);

    if (isNaN(integer)) {
      multiplications.push(
        charMap.has(char) ? (charMap.get(char) as number) * CD_WEIGHTERS[weighterIndex] : 0
      );
    } else {
      multiplications.push(integer * CD_WEIGHTERS[weighterIndex]);
    }

    weighterIndex = weighterIndex === 2 ? 0 : weighterIndex + 1;
  });

  const total = multiplications.reduce((prev, current) => prev + current);

  const calculatedCheckDIgit = total % 10;

  return String(calculatedCheckDIgit) === checkDigit;
}

const validateCompositeCheckDigit = (rawMrz: string) => validateCheckDigit(getValidateableComposition(rawMrz));

/** Parsers */
const parseUpperLine = (mrzUpperLine: string): IDocInfo => {
  const typeAndStateCodes = mrzUpperLine.substr(...TYPE_STATE_CODE_RANGE);
  const type = typeAndStateCodes.substr(...TYPE_RANGE).replace(MACHINE_PLACEHOLDER_RGX, EMPTY);
  const stateCode = typeAndStateCodes.substr(...STATE_CODE_RANGE).replace(MACHINE_PLACEHOLDER_RGX, EMPTY);;

  const parts = extractParts(mrzUpperLine.slice(DOCNO_STARTING_INDEX));

  let [docNo, oib] = parts;
  let docNoValidation: boolean;

  // see if document no includes check digit
  if (docNo.length > DOCNO_MAX_LENGTH) {
    docNoValidation = validateCheckDigit(docNo);
    docNo = docNo.substr(0, DOCNO_MAX_LENGTH);
  }

  return {
    type,
    stateCode,
    docNo: {
      value: docNo,
      validated: docNoValidation!
    },
    oib
  };
}

const parseMiddleLine = (mrzMiddleLine: string): IPersonalInfo => {
  const parts = extractParts(mrzMiddleLine);
  let personal, optional;

  if (parts.length > 2) {
    [personal, optional] = parts;
  } else {
    [personal] = parts;
  }

  const dob = personal.substr(...DOB_RANGE);
  const gender = personal[GENDER_INDEX];
  const expirationDate = personal.substr(...EXPIRY_DATE_RANGE);
  const nationality = personal.substr(...NATIONALITY_RANGE);

  const dobValidation = validateCheckDigit(dob);
  const expirationDateValidation = validateCheckDigit(expirationDate);

  return {
    dob: {
      value: dob.substr(...DATE_VALUE_RANGE),
      validated: dobValidation,
    },
    gender,
    expirationDate: {
      value: expirationDate.substr(...DATE_VALUE_RANGE),
      validated: expirationDateValidation
    },
    nationality,
    optional
  };
}

const parseLowerLine = (mrzLowerLine: string): IIdentificationInfo => {
  const [rawPrimary, rawSecondary] = mrzLowerLine.split(IDENTIFIER_GROUP_SEPARATOR);

  const primary = extractParts(rawPrimary).join(HUMAN_SEPARATOR);
  const secondary = extractParts(rawSecondary).join(HUMAN_SEPARATOR);

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
  parseMRZ,
  validateCompositeCheckDigit
};