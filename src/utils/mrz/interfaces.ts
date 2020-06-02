interface IValidateableField {
  value: string;
  validated: boolean;
}

export interface IDocInfo {
  typeAndStateCodes: string;
  docNo: string;
  oib?: string;
}

export interface IPersonalInfo {
  dob: IValidateableField;
  gender: string;
  expirationDate: IValidateableField;
  nationality: string;
  optional?: string;
}

export interface IIdentificationInfo {
  primary: string;
  secondary: string;
}

export interface IMRZInfo {
  doc: IDocInfo;
  personal: IPersonalInfo;
  identification: IIdentificationInfo;
  validated: boolean;
}