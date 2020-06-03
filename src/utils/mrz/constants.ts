import { Range } from './interface';

// Range constants - should be used on extracted data
export const TYPE_STATE_CODE_RANGE: Range = [0, 5];
export const TYPE_RANGE: Range = [0, 2];
export const STATE_CODE_RANGE: Range = [2, 3];
export const DOB_RANGE: Range = [0, 7];
export const DATE_VALUE_RANGE: Range = [0, 6];
export const EXPIRY_DATE_RANGE: Range = [8, 7];
export const NATIONALITY_RANGE: Range = [15, 3];

// Index constants
export const GENDER_INDEX = 7;
export const DOC_OPTIONAL_INDEX = 5;

// String constants
export const IDENTIFIER_GROUP_SEPARATOR = '<<';
export const HUMAN_SEPARATOR = ' ';

// Regex constants
export const MACHINE_PLACEHOLDER_RGX = /</g;
export const DIGIT_PLACEHOLDER_ONLY_RGX = /[^0-9<,.]+/g;