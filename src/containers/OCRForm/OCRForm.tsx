import * as React from 'react';
import { Form } from 'react-final-form';

import { MRZUtil } from 'utils/mrz';
import { IMRZInfo } from 'utils/mrz/interface';

import { BaseForm } from './component/BaseForm';
import { Scanner } from './component/Scanner';
import {
  SCANNER_AUTH_TOKEN,
  SCANNER_RECOGNIZERS,
  GENERAL_ERROR_MESSAGE,
} from './constants';
import { printValidation } from './herlpers';

import styles from './styles.module.css';

interface IState {
  parsedMRZ: IMRZInfo;
  initialValues: {
    dob: string;
    firstName: string;
    lastName: string;
    oib: string;
    gender: string;
    nationality: string;
    docNo: string;
    expirationDate: string;
  },
  error?: string;
}

export class OCRForm extends React.Component<{}, IState> {

  render() {
    return (
      <div className={styles.container}>
        <Scanner
          recognizers={SCANNER_RECOGNIZERS}
          onResultReady={this.onScanResultReady}
          onError={this.onScanError}
          token={SCANNER_AUTH_TOKEN}
        />
        <div className={styles.error}>{this.state?.error}</div>
        <div className={styles.colLeft}>
          <Form
            component={BaseForm}
            initialValues={this.state?.initialValues}
            onSubmit={this.onSubmit}
          />
        </div>
        <div className={styles.colRight}>
          Check Digit Validations
          {this.renderValidations()}
        </div>
      </div>
    )
  }

  private onScanResultReady = (results: any) => {
    try {
      const result = results.data && results.data[0] && results.data[0].result;
      const mrzStr = result.rawMRZString;
      const parsedMRZ = MRZUtil.parseMRZ(mrzStr);
      const { doc, personal, identification } = MRZUtil.parseMRZ(mrzStr);

      this.setState({
        initialValues: {
          dob: personal.dob.value,
          oib: doc.oib!,
          expirationDate: personal.expirationDate.value,
          firstName: identification.secondary,
          lastName: identification.primary,
          gender: personal.gender,
          nationality: personal.nationality,
          docNo: doc.docNo,
        },
        parsedMRZ,
        error: undefined,
      });
    } catch(err) {
      console.error(err);
      this.setState({ error: GENERAL_ERROR_MESSAGE });
    }

  }

  private onScanError = (event: IObjectAny) => {
    console.error(event);
  }

  private onSubmit = () => undefined;

  private renderValidations = () => {
    const { personal, validated } = (this.state && this.state.parsedMRZ) || {};

    return this.state?.parsedMRZ
      ? (
        <>
          <div>DOB: {printValidation(personal.dob.validated)}</div>
          <div>Expiration Date: {printValidation(personal.dob.validated)}</div>
          <div>Composite CD: {printValidation(validated)}</div>
        </>
      )
      : null;
  }
}