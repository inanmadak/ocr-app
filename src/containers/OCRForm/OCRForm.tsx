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
import { printValidation } from './helpers';

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
    type: string;
    stateCode: string;
  },
  error?: string;
}

export class OCRForm extends React.Component<{}, IState> {

  render() {
    return (
      <div className={styles.container}>
        <Scanner
          recognizers={SCANNER_RECOGNIZERS}
          token={SCANNER_AUTH_TOKEN}
          onResultReady={this.onScanResultReady}
          onError={this.onScanError}
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
          <b>Check Digit Validations</b>
          {this.renderValidations()}
        </div>
      </div>
    )
  }

  private renderValidations = () => {
    const { personal, doc, validated } = this.state?.parsedMRZ || {};

    return this.state?.parsedMRZ
      ? (
        <>
          <div>Doc No: {printValidation(doc.docNo.validated)}</div>
          <div>Date of Birth: {printValidation(personal.dob.validated)}</div>
          <div>Expiration Date: {printValidation(personal.dob.validated)}</div>
          <div>Composite CD: {printValidation(validated)}</div>
        </>
      )
      : null;
  }

  private onScanResultReady = (results: any) => {
    try {
      const result = results.data && results.data[0] && results.data[0].result;
      const mrzStr = result.rawMRZString;
      const parsedMRZ = MRZUtil.parseMRZ(mrzStr);
      const { doc, personal, identification } = parsedMRZ;

      this.setState({
        initialValues: {
          dob: personal.dob.value,
          oib: doc.oib!,
          expirationDate: personal.expirationDate.value,
          firstName: identification.secondary,
          lastName: identification.primary,
          gender: personal.gender,
          nationality: personal.nationality,
          docNo: doc.docNo.value,
          type: doc.type,
          stateCode: doc.stateCode,
        },
        parsedMRZ,
        error: undefined,
      });
    } catch (err) {
      console.error(err);
      this.setState({ error: GENERAL_ERROR_MESSAGE });
    }
  }

  private onScanError = (event: IObjectAny) => {
    console.error(event);
  }

  private onSubmit = () => undefined;
}